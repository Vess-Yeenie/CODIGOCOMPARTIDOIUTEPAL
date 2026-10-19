/**
 * @file migrate.js
 * @description Utilidad CLI de migración, respaldo y sincronización bidireccional de activos digitales y base de datos.
 * 
 * Modos de Operación y Escenarios Soportados:
 * 1. Nube -> Disco Local (`--target=local`):
 *    Descarga todos los documentos desde Cloudinary a la carpeta física local `uploads/`,
 *    normaliza nombres de archivo sanitizados y actualiza los registros en la base de datos (SQLite/MySQL).
 * 2. Nube Antigua -> Nube Nueva (`--target=cloudinary`):
 *    Descarga desde la cuenta de Cloudinary origen y retransmite por stream a una nueva cuenta Cloudinary destino.
 * 3. Descarga Masiva por API (`--all-api`):
 *    Explora la API de administración de Cloudinary descargando cualquier activo huérfano.
 * 
 * @module Scripts/Migrate
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
require('dotenv').config();

const cloudinaryOld = require('cloudinary').v2;
const db = require('../db');

// Configuración de cuenta origen (antigua)
cloudinaryOld.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbdeldijt',
  api_key: process.env.CLOUDINARY_API_KEY || '524613794845678',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'iE-fwTkWZPpvsLdBdmWTtTke8Fo'
});

// Configuración de cuenta destino (nueva) si aplica
let cloudinaryNew = null;
if (process.env.NEW_CLOUDINARY_CLOUD_NAME && process.env.NEW_CLOUDINARY_API_KEY && process.env.NEW_CLOUDINARY_API_SECRET) {
  cloudinaryNew = require('cloudinary').v2;
  cloudinaryNew.config({
    cloud_name: process.env.NEW_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEW_CLOUDINARY_API_KEY,
    api_secret: process.env.NEW_CLOUDINARY_API_SECRET
  });
}

// Parámetros CLI
const args = process.argv.slice(2);
const target = args.find(a => a.startsWith('--target=')) ? args.find(a => a.startsWith('--target=')).split('=')[1] : 'local';
const forceDownload = args.includes('--force');
const syncAllApiResources = args.includes('--all-api');

// Directorio local de destino
const uploadDir = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Función para descargar un archivo vía HTTP/HTTPS con soporte a redirecciones
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const request = client.get(url, (response) => {
      // Manejar redirecciones 301, 302, 307
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode} - ${response.statusMessage} al descargar ${url}`));
      }

      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close(() => resolve(destPath));
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });

    request.on('error', (err) => {
      reject(err);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout de 30s excedido para ${url}`));
    });
  });
}

/**
 * Extraer nombre de archivo limpio y único desde una URL de Cloudinary
 */
function extractFilenameFromUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const uploadIndex = pathname.indexOf('/upload/');
    if (uploadIndex !== -1) {
      // Tomar lo que está después de /upload/v12345/
      const afterUpload = pathname.substring(uploadIndex + 8);
      const parts = afterUpload.split('/').filter(p => !p.startsWith('v') || isNaN(p.substring(1)));
      return parts.join('_').replace(/[^a-zA-Z0-9_.-]/g, '_');
    }
    const basename = path.basename(pathname);
    return basename.replace(/[^a-zA-Z0-9_.-]/g, '_');
  } catch (e) {
    return 'archivo_' + Date.now() + '.pdf';
  }
}

/**
 * Función principal de migración
 */
async function runMigration() {
  console.log('='.repeat(70));
  console.log('  SISTEMA DE MIGRACIÓN: CLOUDINARY -> LOCAL / NUEVA CUENTA');
  console.log(`  Destino seleccionado: ${target.toUpperCase()}`);
  console.log(`  Motor de Base de Datos: ${db.type.toUpperCase()}`);
  console.log(`  Carpeta local de uploads: ${uploadDir}`);
  console.log('='.repeat(70));

  const targetCloudinary = (target === 'cloudinary' && cloudinaryNew) ? cloudinaryNew : cloudinaryOld;

  if (target === 'cloudinary' && !targetCloudinary) {
    console.error('\n[Error Fatal]: Para migrar a Cloudinary, debes configurar las credenciales en tu archivo .env');
    process.exit(1);
  }

  // 1. Obtener todos los trabajos desde la base de datos
  const [trabajos] = await db.execute('SELECT id, nombre, carrera, ano, tipo, pdf_url FROM trabajos');
  console.log(`\n[1/4] Se encontraron ${trabajos.length} registros en la tabla 'trabajos'.`);

  const sqlStatements = [];
  let downloadedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  console.log('\n[2/4] Procesando documentos...');

  for (let i = 0; i < trabajos.length; i++) {
    const item = trabajos[i];
    const originalUrl = item.pdf_url;
    console.log(`\n  [${i + 1}/${trabajos.length}] ID: ${item.id} - ${item.nombre.substring(0, 40)}...`);

    if (!originalUrl) {
      console.log(`    -> Documento sin URL o vacío, omitiendo.`);
      skippedCount++;
      continue;
    }

    const isHttp = originalUrl.startsWith('http');
    const isLocal = originalUrl.startsWith('/uploads/') || originalUrl.startsWith('uploads/');

    try {
      if (target === 'local') {
        // --- MODO 1: MIGRACIÓN A ALMACENAMIENTO LOCAL ---
        if (!isHttp) {
          console.log(`    -> Ya tiene ruta local: ${originalUrl}`);
          skippedCount++;
          continue;
        }

        const filename = extractFilenameFromUrl(originalUrl);
        const localFilePath = path.join(uploadDir, filename);

        if (!fs.existsSync(localFilePath) || forceDownload) {
          process.stdout.write(`    -> Descargando desde Cloudinary a ${filename}... `);
          await downloadFile(originalUrl, localFilePath);
          downloadedCount++;
          console.log('OK');
        } else {
          console.log(`    -> Archivo local ya existe (${filename}), omitiendo descarga.`);
        }

        const newLocalUrl = `/uploads/${filename}`;

        // Actualizar en la base de datos activa
        await db.execute('UPDATE trabajos SET pdf_url = ? WHERE id = ?', [newLocalUrl, item.id]);
        updatedCount++;

        // Generar instrucción SQL masiva
        const escapedId = item.id.replace(/'/g, "''");
        sqlStatements.push(`UPDATE trabajos SET pdf_url = '${newLocalUrl}' WHERE id = '${escapedId}';`);

      } else if (target === 'cloudinary') {
        // --- MODO 2: MIGRACIÓN A CLOUDINARY (DESDE LOCAL O CUENTA ANTIGUA) ---
        let fileToUpload = null;

        if (isLocal) {
          // El archivo ya está en la carpeta uploads/ local
          const localFilename = path.basename(originalUrl);
          fileToUpload = path.join(uploadDir, localFilename);
          if (!fs.existsSync(fileToUpload)) {
            console.error(`    [ERROR] No se encontró el archivo local en: ${fileToUpload}`);
            errorCount++;
            continue;
          }
        } else if (isHttp) {
          // El archivo está en una URL externa/antigua, descargar temporalmente
          const filename = extractFilenameFromUrl(originalUrl);
          fileToUpload = path.join(uploadDir, filename);
          if (!fs.existsSync(fileToUpload) || forceDownload) {
            process.stdout.write(`    -> Descargando temporalmente... `);
            await downloadFile(originalUrl, fileToUpload);
            console.log('OK');
          }
        }

        // Subir a Cloudinary (cuenta destino configurada)
        process.stdout.write(`    -> Subiendo a Cloudinary (${targetCloudinary === cloudinaryNew ? 'Nueva Cuenta' : 'Cuenta Actual'})... `);
        const uploadResult = await targetCloudinary.uploader.upload(fileToUpload, {
          folder: 'trabajos_iutepal',
          resource_type: 'auto'
        });
        console.log('OK');

        const newCloudUrl = uploadResult.secure_url;
        await db.execute('UPDATE trabajos SET pdf_url = ? WHERE id = ?', [newCloudUrl, item.id]);
        updatedCount++;

        const escapedId = item.id.replace(/'/g, "''");
        sqlStatements.push(`UPDATE trabajos SET pdf_url = '${newCloudUrl}' WHERE id = '${escapedId}';`);
      }
    } catch (err) {
      errorCount++;
      console.error(`    [ERROR] Falló procesamiento de ${item.id}:`, err.message);
    }
  }

  // 3. Sincronizar recursos adicionales de Cloudinary vía API si se solicitó o si existen en carpeta
  if (syncAllApiResources) {
    console.log('\n[3/4] Consultando recursos adicionales directamente desde la API de Cloudinary...');
    try {
      for (const resType of ['image', 'video', 'raw']) {
        let nextCursor = null;
        do {
          const apiRes = await cloudinaryOld.api.resources({
            resource_type: resType,
            max_results: 100,
            next_cursor: nextCursor
          });

          for (const resItem of apiRes.resources) {
            const extraFilename = extractFilenameFromUrl(resItem.secure_url);
            const extraPath = path.join(uploadDir, extraFilename);
            if (!fs.existsSync(extraPath)) {
              try {
                process.stdout.write(`  [API Sync] Descargando ${extraFilename}... `);
                await downloadFile(resItem.secure_url, extraPath);
                downloadedCount++;
                console.log('OK');
              } catch (e) {
                console.error(`Error: ${e.message}`);
              }
            }
          }
          nextCursor = apiRes.next_cursor;
        } while (nextCursor);
      }
    } catch (apiErr) {
      console.warn('  [Aviso] Consulta completa de API Cloudinary finalizada o con límite:', apiErr.message);
    }
  } else {
    console.log('\n[3/4] Paso de consulta API completa omitido (usa --all-api si deseas descargar también recursos huérfanos).');
  }

  // 4. Guardar archivo SQL masivo
  console.log('\n[4/4] Generando archivo de actualización masiva SQL...');
  const sqlFileName = target === 'local' ? 'update_urls_local.sql' : 'update_urls_new_cloudinary.sql';
  const sqlFilePath = path.join(__dirname, sqlFileName);

  const sqlHeader = [
    '--',
    `-- ACTUALIZACIÓN MASIVA DE RUTAS DE ARCHIVOS (${target.toUpperCase()})`,
    `-- Generado automáticamente el: ${new Date().toISOString()}`,
    '--',
    'START TRANSACTION;',
    ''
  ].join('\n');

  const sqlFooter = '\nCOMMIT;\n';
  fs.writeFileSync(sqlFilePath, sqlHeader + sqlStatements.join('\n') + sqlFooter, 'utf8');

  console.log(`  -> Archivo SQL guardado en: ${sqlFilePath}`);

  console.log('\n' + '='.repeat(70));
  console.log('  RESUMEN DE MIGRACIÓN:');
  console.log(`  - Total de registros analizados : ${trabajos.length}`);
  console.log(`  - Archivos descargados a disco  : ${downloadedCount}`);
  console.log(`  - Registros de BD actualizados  : ${updatedCount}`);
  console.log(`  - Registros omitidos (ya listos): ${skippedCount}`);
  console.log(`  - Errores encontrados          : ${errorCount}`);
  console.log(`  - Archivo SQL para phpMyAdmin   : scripts/${sqlFileName}`);
  console.log('='.repeat(70) + '\n');

  if (typeof db.close === 'function') {
    db.close();
  }
}

if (require.main === module) {
  runMigration().catch(err => {
    console.error('\n[Error Fatal durante la migración]:', err);
    process.exit(1);
  });
}

module.exports = runMigration;
