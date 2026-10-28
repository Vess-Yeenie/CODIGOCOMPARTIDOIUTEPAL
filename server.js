/**
 * @file server.js
 * @description Servidor principal Express para el Repositorio de Documentos IUTEPAL.
 * Gestiona el ciclo de vida del backend, la API RESTful para Trabajos Especiales de Grado (TEG),
 * autenticación de usuarios (Admin y Estudiante), auditoría de accesos (logs)
 * y el almacenamiento híbrido de archivos (Local en disco o Cloudinary en la nube).
 * 
 * @module Server
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config();

// Módulo de abstracción de base de datos (SQLite / MySQL)
const db = require('./db');

// Procesador de documentos (conversión Word a PDF y protección anti-modificación / anti-plagio)
const { processDocument } = require('./scripts/documentProcessor');

const app = express();
const port = process.env.PORT || 3000;

// Capturador global de errores para evitar que el servidor se caiga por excepciones imprevistas
process.on('uncaughtException', (err) => {
  console.error('[FATAL uncaughtException]:', err.message || err);
  if (err.stack) console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]:', reason);
});

/**
 * -----------------------------------------------------------------------------
 * CONFIGURACIÓN DEL SISTEMA DE ALMACENAMIENTO (LOCAL DISK VS CLOUDINARY)
 * -----------------------------------------------------------------------------
 * `storageType`: Define la estrategia de persistencia ('local' o 'cloudinary').
 * `uploadDir`: Carpeta física en disco donde se guardan los archivos locales.
 */
const storageType = (process.env.STORAGE_TYPE || 'local').toLowerCase();
const uploadDir = path.resolve(__dirname, process.env.UPLOAD_DIR || 'uploads');

// Crear la carpeta de uploads local si no existe en el sistema de archivos
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Configuración de credenciales de Cloudinary
 * Se utiliza para almacenamiento en la nube o migración de recursos remotos.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbdeldijt',
  api_key: process.env.CLOUDINARY_API_KEY || '524613794845678',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'iE-fwTkWZPpvsLdBdmWTtTke8Fo'
});

/**
 * Configuración de Multer para almacenamiento en disco local
 * Genera nombres de archivo seguros y únicos evitando colisiones.
 */
const localDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Sanitizar el nombre del archivo eliminando caracteres especiales
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `${base}_${uniqueSuffix}${ext}`);
  }
});

/**
 * Instancia de Multer según la estrategia configurada
 * - 'cloudinary': Utiliza buffer en memoria (memoryStorage) para streaming directo.
 * - 'local': Utiliza almacenamiento en disco físico (localDiskStorage).
 * Límite máximo: 100 MB para soportar presentaciones de video y documentos extensos.
 * fileFilter: Valida que solo se permitan PDFs y formatos de video permitidos.
 */
const upload = multer({
  storage: storageType === 'cloudinary' ? multer.memoryStorage() : localDiskStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Límite de 100MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.pdf', '.docx', '.doc', '.mp4', '.mov', '.avi', '.webm', '.mkv', '.png', '.jpg', '.jpeg', '.svg', '.webp'];
    if (!allowed.includes(ext)) {
      return cb(new Error('Tipo de archivo no permitido. Solo se aceptan documentos PDF (.pdf), Word (.docx, .doc), Videos (.mp4, .mov, .avi, etc.) e Imágenes (.png, .jpg, .svg, .webp)'), false);
    }
    cb(null, true);
  }
});

/**
 * -----------------------------------------------------------------------------
 * MIDDLEWARES GLOBALES
 * -----------------------------------------------------------------------------
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -----------------------------------------------------------------------------
 * CONTROL DE ACCESO Y SEGURIDAD EN ARCHIVOS DOCUMENTALES
 * -----------------------------------------------------------------------------
 * Asegura que los documentos PDF y presentaciones no sean accesibles mediante
 * URLs públicas directas ni por usuarios sin autenticación en la plataforma.
 */
async function verifyDocumentAccess(req, res, next) {
  try {
    // 1. Extraer identificador de usuario desde cabeceras, query params o cookies
    let userId = req.headers['x-user-id'] || req.query.userId || req.query.auth_user;
    
    if (!userId && req.headers.cookie) {
      const match = req.headers.cookie.match(/(?:^|;\s*)currentUserId=([^;]+)/);
      if (match) userId = decodeURIComponent(match[1]);
    }

    // Si no se proporcionó ninguna credencial de usuario
    if (userId === undefined || userId === null || String(userId).trim() === '') {
      return res.status(401).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"><title>Acceso no autorizado - IUTEPAL</title>
        <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#04224e;color:#fff;text-align:center;margin:0;}
        .card{background:#fff;color:#333;padding:40px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.3);max-width:450px;}
        h1{color:#c0392b;font-size:1.5em;margin-top:0;}p{line-height:1.5;color:#555;}
        a{display:inline-block;margin-top:20px;background:#fdd534;color:#04224e;padding:10px 20px;border-radius:25px;text-decoration:none;font-weight:bold;}
        </style></head>
        <body>
          <div class="card">
            <h1>Acceso No Autorizado</h1>
            <p>Los archivos y documentos del repositorio institucional IUTEPAL están protegidos contra descargas y accesos públicos directos.</p>
            <p>Por favor, inicie sesión en la plataforma con sus credenciales para consultar o descargar este documento.</p>
            <a href="/login.html">Iniciar Sesión</a>
          </div>
        </body></html>
      `);
    }

    // Administrador institucional (ID 0 o 'admin')
    if (String(userId) === '0' || String(userId).toLowerCase() === 'admin') {
      req.authenticatedUser = { id: 0, nombre: 'Admin', email: 'admin', esIutepalista: 1 };
      return next();
    }

    // Verificar existencia del usuario en la base de datos
    const [rows] = await db.execute('SELECT id, nombre, email, esIutepalista FROM usuario WHERE id = ?', [userId]);
    if (!rows || rows.length === 0) {
      return res.status(403).send('Acceso denegado: Usuario no registrado o sesión inválida.');
    }

    req.authenticatedUser = rows[0];
    next();
  } catch (err) {
    console.error('[Seguridad] Error al validar autorización de archivo:', err);
    res.status(500).send('Error interno de verificación de seguridad.');
  }
}

/**
 * Ruta de acceso protegido a archivos locales físicos en `/uploads/:filename`
 * Reemplaza el middleware express.static abierto previamente para garantizar la protección.
 */
app.get('/uploads/:filename', (req, res, next) => {
  const filename = path.basename(req.params.filename);
  const ext = path.extname(filename).toLowerCase();
  // Imágenes públicas (iconos de carreras, etc.) se sirven de forma directa
  if (['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ico'].includes(ext)) {
    const fullPath = path.join(uploadDir, filename);
    if (!fullPath.startsWith(uploadDir)) return res.status(403).send('Acceso denegado');
    if (!fs.existsSync(fullPath)) return res.status(404).send('Imagen no encontrada');
    return res.sendFile(fullPath);
  }
  return verifyDocumentAccess(req, res, next);
}, (req, res) => {
  const filename = path.basename(req.params.filename);
  const fullPath = path.join(uploadDir, filename);

  // Prevenir Directory Traversal
  if (!fullPath.startsWith(uploadDir)) {
    return res.status(403).send('Acceso denegado');
  }

  if (!fs.existsSync(fullPath)) {
    return res.status(404).send('Archivo no encontrado');
  }

  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + encodeURIComponent(filename) + '"');
  } else if (['.mp4', '.webm', '.mov', '.avi'].includes(ext)) {
    res.setHeader('Content-Type', 'video/' + (ext === '.mp4' ? 'mp4' : ext.replace('.', '')));
  }

  res.sendFile(fullPath);
});

/**
 * Despacho seguro de activos estáticos del frontend:
 * 1. `STRUCTURE`: Directorio modular con CSS, SCRIPTS, IMG, y PDFs de líneas institucionales.
 * 2. Vistas HTML y scripts públicos permitidos en la raíz (protegiendo archivos .env, .sql, db.js, etc.).
 */
app.use('/STRUCTURE', express.static(path.join(__dirname, 'STRUCTURE')));
app.use(express.static(path.join(__dirname, 'STRUCTURE')));

const allowedPublicRootFiles = ['index.html', 'login.html', 'menu.html', 'registro.html', 'login.js', 'registro.js', 'sw.js', 'manifest.json', 'favicon.ico'];
allowedPublicRootFiles.forEach(file => {
  app.get(`/${file}`, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * -----------------------------------------------------------------------------
 * RUTAS DE LA API RESTful
 * -----------------------------------------------------------------------------
 */

/**
 * @name POST /upload
 * @description Sube un archivo documental al sistema validando su tipo, convirtiendo documentos
 * de Word a PDF de forma nativa y aplicando protección criptográfica de permisos anti-modificación
 * y anti-plagio a los PDFs:
 * - 'trabajo' o 'resumen': Archivos PDF (.pdf) o Word (.docx, .doc).
 * - 'presentacion': Archivos de video (.mp4, etc.), PDF o Word.
 * 
 * @param {express.Request} req - Petición con archivo multipart/form-data bajo el campo 'documento'.
 * @param {express.Response} res - Respuesta JSON { message: string, url: string, protected?: boolean }.
 */
app.post('/upload', upload.single('documento'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    const tipo = (req.body.tipo || '').toLowerCase();
    const ext = path.extname(req.file.originalname).toLowerCase();
    const isDoc = ['.pdf', '.docx', '.doc'].includes(ext);
    const allowedPresentations = ['.pdf', '.docx', '.doc', '.mp4', '.mov', '.avi', '.webm', '.mkv'];

    // 1. Validación para Trabajo de Grado y Resumen -> PDF o Word (.docx, .doc)
    if ((tipo === 'trabajo' || tipo === 'resumen') && !isDoc) {
      if (req.file.path && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(400).json({ 
        error: 'Validación de archivo fallida: Para Trabajos de Grado y Resúmenes, el archivo debe ser un documento en formato PDF (.pdf) o Word (.docx, .doc).' 
      });
    }

    // 2. Validación para Presentación -> PDF, Word o Video
    if (tipo === 'presentacion' && !allowedPresentations.includes(ext)) {
      if (req.file.path && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(400).json({ 
        error: 'Validación de archivo fallida: Para Presentaciones, el archivo debe ser un documento PDF (.pdf), Word (.docx, .doc) o un archivo de video (.mp4, .mov, etc.).' 
      });
    }

    // Caso A: El archivo es un documento (PDF o Word) -> Convertir y/o Proteger
    if (isDoc) {
      if (storageType === 'cloudinary') {
        const uniqueId = `${Date.now()}_${Math.round(Math.random() * 1E6)}`;
        const tempInput = path.join(uploadDir, `temp_raw_${uniqueId}${ext}`);
        const tempProtectedPdf = path.join(uploadDir, `temp_prot_${uniqueId}.pdf`);

        try {
          fs.writeFileSync(tempInput, req.file.buffer);

          // Procesar documento: si es Word lo convierte a PDF y encripta con permisos anti-modificación y anti-plagio
          await processDocument(tempInput, tempProtectedPdf);

          const protectedBuffer = fs.readFileSync(tempProtectedPdf);

          // Subida por streaming directo del PDF protegido a Cloudinary
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                resource_type: 'raw',
                format: 'pdf',
                folder: 'trabajos_iutepal'
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(protectedBuffer);
          });

          return res.json({ 
            message: ext === '.pdf'
              ? 'Documento PDF protegido contra modificación/plagio y subido a Cloudinary exitosamente'
              : 'Documento Word convertido a PDF, protegido contra modificación/plagio y subido a Cloudinary exitosamente', 
            url: result.secure_url,
            protected: true
          });
        } finally {
          if (fs.existsSync(tempInput)) try { fs.unlinkSync(tempInput); } catch (_) {}
          if (fs.existsSync(tempProtectedPdf)) try { fs.unlinkSync(tempProtectedPdf); } catch (_) {}
        }
      } else {
        // Almacenamiento 100% local en servidor físico
        const originalSavedPath = req.file.path;
        const baseName = path.basename(req.file.filename, ext);
        const finalPdfFilename = `${baseName}.pdf`;
        const tempProtectedPdf = path.join(uploadDir, `prot_${Date.now()}_${finalPdfFilename}`);
        const targetPdfPath = path.join(uploadDir, finalPdfFilename);

        try {
          // Procesar documento: conversión si es Word + protección anti-plagio/modificación
          await processDocument(originalSavedPath, tempProtectedPdf);

          // Eliminar archivo original no protegido o Word temporal
          if (fs.existsSync(originalSavedPath)) {
            try { fs.unlinkSync(originalSavedPath); } catch (_) {}
          }

          if (fs.existsSync(targetPdfPath)) {
            try { fs.unlinkSync(targetPdfPath); } catch (_) {}
          }
          fs.renameSync(tempProtectedPdf, targetPdfPath);

          const relativeUrl = `/uploads/${finalPdfFilename}`;
          return res.json({ 
            message: ext === '.pdf'
              ? 'Documento PDF protegido contra modificación/plagio y guardado localmente'
              : 'Documento Word convertido a PDF, protegido y guardado localmente', 
            url: relativeUrl,
            protected: true
          });
        } catch (procErr) {
          if (fs.existsSync(tempProtectedPdf)) try { fs.unlinkSync(tempProtectedPdf); } catch (_) {}
          throw procErr;
        }
      }
    }

    // Caso B: El archivo es un video (para presentaciones)
    if (storageType === 'cloudinary') {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            chunk_size: 6000000,
            folder: 'trabajos_iutepal'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      return res.json({ message: 'Video subido exitosamente a Cloudinary', url: result.secure_url });
    } else {
      const relativeUrl = `/uploads/${req.file.filename}`;
      return res.json({ message: 'Video subido exitosamente al almacenamiento local', url: relativeUrl });
    }
  } catch (error) {
    console.error("Error detallado al subir documento:", error);
    res.status(500).json({ error: error.message || 'Error al procesar y subir el documento' });
  }
});

/**
 * @name GET /carreras
 * @description Obtiene el listado de todas las carreras institucionales desde la base de datos.
 */
app.get('/carreras', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM carreras ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    res.status(500).json({ error: 'Error al obtener carreras de la base de datos' });
  }
});

/**
 * @name POST /carreras
 * @description Registra una nueva carrera institucional con su icono y color distintivo.
 * Acepta multipart/form-data con imagen en 'icono' o body JSON.
 */
app.post('/carreras', upload.single('icono'), async (req, res) => {
  try {
    let { nombre, codigo, color } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ success: false, error: 'El nombre de la carrera es obligatorio' });
    }
    nombre = nombre.trim();

    // Auto-generar código identificador si no se especificó
    if (!codigo || !codigo.trim()) {
      codigo = nombre
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
    } else {
      codigo = codigo.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "_");
    }

    if (!color || !color.trim()) {
      color = '#00bcd4';
    } else {
      color = color.trim();
    }

    // Comprobar unicidad del código
    const [existing] = await db.execute('SELECT id FROM carreras WHERE codigo = ?', [codigo]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, error: `Ya existe una carrera con el código '${codigo}'.` });
    }

    let iconoUrl = 'STRUCTURE/IMG/coco.png';

    if (req.file) {
      if (storageType === 'cloudinary') {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'carreras_iutepal'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        iconoUrl = result.secure_url;
      } else {
        iconoUrl = `/uploads/${req.file.filename}`;
      }
    } else if (req.body.icono && typeof req.body.icono === 'string' && req.body.icono.trim()) {
      iconoUrl = req.body.icono.trim();
    }

    const [insertResult] = await db.execute(
      'INSERT INTO carreras (codigo, nombre, icono, color) VALUES (?, ?, ?, ?)',
      [codigo, nombre, iconoUrl, color]
    );

    const newId = insertResult ? insertResult.insertId : null;
    res.json({
      success: true,
      message: 'Carrera creada exitosamente',
      carrera: { id: newId, codigo, nombre, icono: iconoUrl, color }
    });
  } catch (error) {
    console.error("Error al registrar carrera:", error);
    res.status(500).json({ success: false, error: error.message || 'Error al registrar carrera' });
  }
});

/**
 * @name PUT /carreras/:id
 * @description Modifica una carrera institucional existente (nombre, código, color, icono).
 * Si el código cambia, actualiza automáticamente las referencias asociadas en la tabla 'trabajos'.
 */
const updateCarreraHandler = async (req, res) => {
  try {
    const { id } = req.params;
    let { nombre, codigo, color } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ success: false, error: 'El nombre de la carrera es obligatorio' });
    }
    nombre = nombre.trim();

    // Obtener la carrera existente
    const [existing] = await db.execute('SELECT * FROM carreras WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Carrera no encontrada' });
    }
    const currentCarrera = existing[0];
    const oldCodigo = currentCarrera.codigo;

    // Normalizar o auto-generar código identificador
    if (!codigo || !codigo.trim()) {
      codigo = nombre
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
    } else {
      codigo = codigo.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "_");
    }

    if (!color || !color.trim()) {
      color = currentCarrera.color || '#00bcd4';
    } else {
      color = color.trim();
    }

    // Comprobar que no exista otra carrera con el mismo código
    const [duplicate] = await db.execute('SELECT id FROM carreras WHERE codigo = ? AND id != ?', [codigo, id]);
    if (duplicate && duplicate.length > 0) {
      return res.status(400).json({ success: false, error: `Ya existe otra carrera con el código '${codigo}'.` });
    }

    let iconoUrl = currentCarrera.icono || 'STRUCTURE/IMG/coco.png';

    if (req.file) {
      if (storageType === 'cloudinary') {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'carreras_iutepal'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        iconoUrl = result.secure_url;
      } else {
        iconoUrl = `/uploads/${req.file.filename}`;
      }
    } else if (req.body.icono && typeof req.body.icono === 'string' && req.body.icono.trim()) {
      iconoUrl = req.body.icono.trim();
    }

    await db.execute(
      'UPDATE carreras SET codigo = ?, nombre = ?, icono = ?, color = ? WHERE id = ?',
      [codigo, nombre, iconoUrl, color, id]
    );

    // Si el código cambió, sincronizar en cascada en la tabla trabajos
    if (oldCodigo && oldCodigo !== codigo) {
      await db.execute('UPDATE trabajos SET carrera = ? WHERE carrera = ?', [codigo, oldCodigo]);
    }

    res.json({
      success: true,
      message: 'Carrera actualizada exitosamente',
      carrera: { id: Number(id), codigo, nombre, icono: iconoUrl, color }
    });
  } catch (error) {
    console.error("Error al actualizar carrera:", error);
    res.status(500).json({ success: false, error: error.message || 'Error al actualizar carrera' });
  }
};

app.put('/carreras/:id', upload.single('icono'), updateCarreraHandler);
app.post('/carreras/:id', upload.single('icono'), updateCarreraHandler);

/**
 * @name DELETE /carreras/:id
 * @description Elimina una carrera institucional por su ID.
 */
app.delete('/carreras/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.execute('SELECT * FROM carreras WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Carrera no encontrada' });
    }
    await db.execute('DELETE FROM carreras WHERE id = ?', [id]);
    res.json({ success: true, message: `Carrera '${existing[0].nombre}' eliminada exitosamente` });
  } catch (error) {
    console.error("Error al eliminar carrera:", error);
    res.status(500).json({ success: false, error: 'Error al eliminar carrera' });
  }
});

/**
 * @name GET /trabajos
 * @description Obtiene la lista completa de todos los Trabajos Especiales de Grado (TEG),
 * Hojas de Resumen y Presentaciones almacenadas en la base de datos.
 * 
 * @param {express.Request} req - Petición HTTP entrante.
 * @param {express.Response} res - Array JSON con los objetos de trabajo.
 * @returns {Array<Object>} Lista de trabajos con { id, nombre, carrera, ano, tipo, pdf_url }
 */
app.get('/trabajos', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM trabajos');
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener trabajos:", error);
    res.status(500).json({ error: 'Error al obtener trabajos' });
  }
});

/**
 * @name POST /addTrabajo
 * @description Inserta un nuevo trabajo académico en el catálogo. Genera un ID con prefijo 't' y timestamp.
 * Valida que el año contenga exactamente 4 dígitos numéricos y la coherencia del tipo de archivo.
 * 
 * @param {express.Request} req - Body conteniendo { nombre, carrera, ano, tipo, pdf_url }.
 * @param {express.Response} res - Respuesta JSON { success: true, id }.
 */
app.post('/addTrabajo', async (req, res) => {
  try {
    const { nombre, carrera, ano, tipo, pdf_url } = req.body;

    // Validación estricta del campo año: exactamente 4 dígitos numéricos
    if (!ano || !/^\d{4}$/.test(String(ano).trim())) {
      return res.status(400).json({ 
        success: false, 
        error: 'El campo Año es obligatorio y debe contener exactamente 4 dígitos numéricos (ejemplo: 2024).' 
      });
    }

    // Validación de coherencia de tipo y extensión de archivo
    if ((tipo === 'trabajo' || tipo === 'resumen') && pdf_url) {
      const ext = path.extname(pdf_url.split('?')[0]).toLowerCase();
      if (ext && ext !== '.pdf' && !pdf_url.toLowerCase().includes('.pdf')) {
        return res.status(400).json({ 
          success: false, 
          error: 'Para Trabajos de Grado y Resúmenes, el documento asociado debe ser estrictamente un archivo PDF.' 
        });
      }
    }

    const id = 't' + Date.now();
    await db.execute(
      'INSERT INTO trabajos (id, nombre, carrera, ano, tipo, pdf_url) VALUES (?, ?, ?, ?, ?, ?)',
      [id, nombre, carrera, parseInt(ano, 10), tipo, pdf_url]
    );
    res.json({ success: true, id });
  } catch (error) {
    console.error("Error al añadir trabajo:", error);
    res.status(500).json({ error: 'No se pudo guardar en la base de datos' });
  }
});

/**
 * @name POST /updateTrabajo
 * @description Modifica los metadatos de un trabajo existente y opcionalmente actualiza su URL de archivo.
 * Valida que el año contenga exactamente 4 dígitos numéricos y la coherencia del tipo.
 * 
 * @param {express.Request} req - Body conteniendo { id, nombre, carrera, ano, tipo, pdf_url? }.
 * @param {express.Response} res - Resultado de la operación { success: boolean, message: string }.
 */
app.post('/updateTrabajo', async (req, res) => {
  try {
    const { id, nombre, carrera, ano, tipo, pdf_url } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "ID requerido" });
    }

    // Validación estricta del campo año: exactamente 4 dígitos numéricos
    if (!ano || !/^\d{4}$/.test(String(ano).trim())) {
      return res.status(400).json({ 
        success: false, 
        message: 'El campo Año es obligatorio y debe contener exactamente 4 dígitos numéricos (ejemplo: 2024).' 
      });
    }

    // Validación de coherencia de tipo y extensión de archivo
    if ((tipo === 'trabajo' || tipo === 'resumen') && pdf_url) {
      const ext = path.extname(pdf_url.split('?')[0]).toLowerCase();
      if (ext && ext !== '.pdf' && !pdf_url.toLowerCase().includes('.pdf')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Para Trabajos de Grado y Resúmenes, el documento asociado debe ser estrictamente un archivo PDF.' 
        });
      }
    }

    let sql = "UPDATE trabajos SET nombre = ?, carrera = ?, ano = ?, tipo = ?";
    const params = [nombre, carrera, parseInt(ano, 10), tipo];

    // Solo actualizar la URL del archivo si se envió un valor no vacío
    if (pdf_url !== undefined && pdf_url !== null && pdf_url !== "") {
      sql += ", pdf_url = ?";
      params.push(pdf_url);
    }

    sql += " WHERE id = ?";
    params.push(id);

    await db.execute(sql, params);
    res.json({ success: true, message: "Trabajo actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar trabajo:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

/**
 * Deduplicador en memoria para evitar registros dobles de auditoría en ráfaga (incremento x2 por error).
 * Ignora llamadas idénticas recibidas para el mismo usuario, acción y documento dentro de una ventana de 3 segundos.
 */
const recentAuditLogs = new Set();
async function registerAuditLog(usuarioId, action, docId) {
  const uid = usuarioId !== undefined && usuarioId !== null ? String(usuarioId) : '0';
  const did = docId !== undefined && docId !== null ? String(docId) : '';
  const key = `${uid}_${action}_${did}`;

  if (recentAuditLogs.has(key)) {
    return false; // Duplicado detectado y omitido
  }
  recentAuditLogs.add(key);
  setTimeout(() => recentAuditLogs.delete(key), 3000);

  const fecha = new Date().toISOString();
  try {
    await db.execute('INSERT INTO logs (usuario_id, action, doc_id, fecha) VALUES (?, ?, ?, ?)', [uid, action, did || null, fecha]);
    return true;
  } catch (err) {
    console.warn('[Audit] Error al registrar log de auditoría:', err);
    return false;
  }
}

/**
 * @name GET /download/:id
 * @description Descarga garantizada y segura de un documento académico.
 * Configura las cabeceras Content-Disposition: attachment con el nombre real del trabajo
 * y su extensión correspondiente (.pdf o video), canalizando archivos locales o remotos sin fallos.
 */
app.get('/download/:id', verifyDocumentAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM trabajos WHERE id = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).send('Documento no encontrado');
    }

    const trabajo = rows[0];
    const pdf_url = trabajo.pdf_url;
    if (!pdf_url) {
      return res.status(404).send('El documento no posee un archivo enlazado');
    }

    // Sanitizar nombre de archivo para evitar caracteres no permitidos en el sistema operativo
    const cleanBase = (trabajo.nombre || 'documento')
      .replace(/[/\\?%*:|"<>#]/g, '_')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 120);

    let ext = path.extname(pdf_url.split('?')[0]).toLowerCase();
    if (!ext) {
      ext = trabajo.tipo === 'video' ? '.mp4' : '.pdf';
    }
    const downloadFilename = `${cleanBase}${ext}`;

    // Registrar acción de auditoría única (descarga sin duplicar)
    const userId = req.authenticatedUser ? req.authenticatedUser.id : (req.query.userId || 0);
    registerAuditLog(userId, 'download', id);

    // Caso 1: Archivo local en /uploads/
    if (pdf_url.startsWith('/uploads/') || pdf_url.startsWith('uploads/')) {
      const filename = path.basename(pdf_url);
      const fullPath = path.join(uploadDir, filename);

      if (!fs.existsSync(fullPath)) {
        return res.status(404).send('Archivo físico no encontrado en el servidor local.');
      }

      return res.download(fullPath, downloadFilename);
    }

    // Caso 2: Archivo remoto (Cloudinary u otro servidor HTTP/HTTPS)
    if (pdf_url.startsWith('http://') || pdf_url.startsWith('https://')) {
      const https = require('https');
      const http = require('http');
      const client = pdf_url.startsWith('https://') ? https : http;

      client.get(pdf_url, (remoteRes) => {
        if (remoteRes.statusCode >= 400) {
          return res.status(remoteRes.statusCode).send('No se pudo recuperar el archivo desde el almacenamiento remoto.');
        }

        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadFilename)}"; filename*=UTF-8''${encodeURIComponent(downloadFilename)}`);
        res.setHeader('Content-Type', remoteRes.headers['content-type'] || (ext === '.pdf' ? 'application/pdf' : 'application/octet-stream'));
        
        remoteRes.pipe(res);
      }).on('error', (err) => {
        console.error('Error al transferir archivo remoto para descarga:', err);
        res.status(500).send('Fallo al descargar el archivo remoto.');
      });
      return;
    }

    res.status(400).send('Formato de ruta de documento no soportado');
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    res.status(500).send('Error interno en la descarga');
  }
});

/**
 * @name GET /view/:id
 * @description Visualización segura del archivo protegido (PDF o Video) en el navegador.
 * Evita exponer URLs públicas directas no autorizadas.
 */
app.get('/view/:id', verifyDocumentAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM trabajos WHERE id = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).send('Documento no encontrado');
    }

    const trabajo = rows[0];
    const pdf_url = trabajo.pdf_url;
    if (!pdf_url) {
      return res.status(404).send('El documento no posee un archivo enlazado');
    }

    // Registrar en auditoría la acción de visualización única (sin duplicar)
    const userId = req.authenticatedUser ? req.authenticatedUser.id : (req.query.userId || 0);
    registerAuditLog(userId, 'view', id);

    // Caso 1: Archivo local en /uploads/
    if (pdf_url.startsWith('/uploads/') || pdf_url.startsWith('uploads/')) {
      const filename = path.basename(pdf_url);
      const fullPath = path.join(uploadDir, filename);

      if (!fs.existsSync(fullPath)) {
        return res.status(404).send('Archivo físico no encontrado');
      }

      const ext = path.extname(filename).toLowerCase();
      if (ext === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
      } else if (['.mp4', '.webm', '.mov', '.avi'].includes(ext)) {
        res.setHeader('Content-Type', 'video/' + ext.replace('.', ''));
      }
      res.setHeader('Content-Disposition', 'inline; filename="' + encodeURIComponent(filename) + '"');
      return res.sendFile(fullPath);
    }

    // Caso 2: Archivo remoto (Cloudinary u otro)
    if (pdf_url.startsWith('http://') || pdf_url.startsWith('https://')) {
      const https = require('https');
      const http = require('http');
      const client = pdf_url.startsWith('https://') ? https : http;

      client.get(pdf_url, (remoteRes) => {
        if (remoteRes.statusCode >= 400) {
          return res.status(remoteRes.statusCode).send('No se pudo recuperar el archivo remoto');
        }

        const ext = path.extname(pdf_url.split('?')[0]).toLowerCase();
        res.setHeader('Content-Type', remoteRes.headers['content-type'] || (ext === '.pdf' ? 'application/pdf' : 'application/octet-stream'));
        res.setHeader('Content-Disposition', 'inline');
        
        remoteRes.pipe(res);
      }).on('error', (err) => {
        console.error('Error al visualizar archivo remoto:', err);
        res.status(500).send('Error al visualizar archivo');
      });
      return;
    }

    res.status(400).send('Formato de ruta no válido');
  } catch (error) {
    console.error('Error al visualizar documento:', error);
    res.status(500).send('Error interno al visualizar documento');
  }
});

/**
 * @name GET /usuarios
 * @description Obtiene el listado de todos los usuarios registrados para administración individual.
 * 
 * @param {express.Request} req - Petición HTTP.
 * @param {express.Response} res - Array JSON de usuarios con { id, nombre, email, esIutepalista }.
 */
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, nombre, email, esIutepalista FROM usuario ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

/**
 * @name POST /admin/update-user
 * @description Actualiza individualmente el nombre, correo o contraseña de un usuario específico.
 * Permite al Administrador gestionar las credenciales de cada usuario por separado en vez de un cambio global.
 * 
 * @param {express.Request} req - Body con { targetUserId, nombre, email, newPassword, esIutepalista }.
 * @param {express.Response} res - JSON { success: boolean, message: string }.
 */
app.post('/admin/update-user', async (req, res) => {
  try {
    const { targetUserId, nombre, email, newPassword, esIutepalista } = req.body;

    if (targetUserId === undefined || targetUserId === null || String(targetUserId).trim() === '') {
      return res.status(400).json({ success: false, message: 'Debe seleccionar un usuario para modificar.' });
    }

    // Verificar que el usuario exista en la base de datos
    const [existingUsers] = await db.execute('SELECT id, email FROM usuario WHERE id = ?', [targetUserId]);
    if (!existingUsers || existingUsers.length === 0) {
      return res.status(404).json({ success: false, message: 'El usuario seleccionado no existe.' });
    }

    // Si se modifica el email, validar que no colisione con otro usuario
    if (email && email.trim() !== existingUsers[0].email) {
      const [duplicateCheck] = await db.execute('SELECT id FROM usuario WHERE email = ? AND id != ?', [email.trim().toLowerCase(), targetUserId]);
      if (duplicateCheck && duplicateCheck.length > 0) {
        return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado por otro usuario.' });
      }
    }

    const updates = [];
    const params = [];

    if (nombre && nombre.trim() !== '') {
      updates.push("nombre = ?");
      params.push(nombre.trim());
    }

    if (email && email.trim() !== '') {
      updates.push("email = ?");
      params.push(email.trim().toLowerCase());
    }

    if (newPassword && newPassword.trim() !== '') {
      if (newPassword.trim().length < 3) {
        return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 3 caracteres.' });
      }
      updates.push("password = ?");
      params.push(newPassword.trim());
    }

    if (esIutepalista !== undefined && esIutepalista !== null) {
      updates.push("esIutepalista = ?");
      params.push(esIutepalista ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No se ingresaron cambios para actualizar.' });
    }

    const sql = `UPDATE usuario SET ${updates.join(', ')} WHERE id = ?`;
    params.push(targetUserId);

    await db.execute(sql, params);
    res.json({ success: true, message: 'Credenciales del usuario actualizadas exitosamente.' });
  } catch (error) {
    console.error("Error al actualizar usuario por admin:", error);
    res.status(500).json({ success: false, message: 'Error interno al actualizar usuario' });
  }
});

/**
 * @name DELETE /admin/delete-user/:id
 * @description Elimina permanentemente un usuario de la base de datos y sus registros asociados en logs.
 * Restringido: Protege al Administrador institucional principal (id 0 o email 'admin') contra eliminación.
 * 
 * @param {express.Request} req - Parámetro :id con el identificador del usuario.
 * @param {express.Response} res - JSON con resultado { success: boolean, message: string }.
 */
app.delete('/admin/delete-user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (id === undefined || id === null || String(id).trim() === '') {
      return res.status(400).json({ success: false, message: 'Identificador de usuario inválido.' });
    }

    // Proteger la cuenta del Administrador principal
    if (String(id).trim() === '0') {
      return res.status(403).json({ success: false, message: 'La cuenta del Administrador principal no puede ser eliminada.' });
    }

    const [rows] = await db.execute('SELECT id, nombre, email FROM usuario WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'El usuario seleccionado no existe en la base de datos.' });
    }

    const targetUser = rows[0];
    if (targetUser.email && targetUser.email.toLowerCase() === 'admin') {
      return res.status(403).json({ success: false, message: 'No se puede eliminar la cuenta de administrador institucional.' });
    }

    // 1. Limpieza de logs asociados
    try {
      await db.execute('DELETE FROM logs WHERE usuario_id = ?', [id]);
    } catch (logErr) {
      console.warn('[Admin] Advertencia al eliminar logs vinculados al usuario:', logErr.message);
    }

    // 2. Eliminación de la cuenta de usuario
    await db.execute('DELETE FROM usuario WHERE id = ?', [id]);
    console.log(`[Admin] Usuario eliminado exitosamente: ID ${id} (${targetUser.nombre} - ${targetUser.email})`);

    res.json({
      success: true,
      message: `El usuario "${targetUser.nombre}" (${targetUser.email}) fue eliminado exitosamente de la base de datos.`
    });
  } catch (error) {
    console.error('Error al eliminar usuario por admin:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al eliminar el usuario' });
  }
});

/**
 * @name POST /admin/delete-user
 * @description Endpoint alternativo vía POST para eliminar usuarios de la base de datos.
 */
app.post('/admin/delete-user', async (req, res) => {
  try {
    const targetUserId = req.body.targetUserId || req.body.id;

    if (targetUserId === undefined || targetUserId === null || String(targetUserId).trim() === '') {
      return res.status(400).json({ success: false, message: 'Debe seleccionar un usuario para eliminar.' });
    }

    if (String(targetUserId).trim() === '0') {
      return res.status(403).json({ success: false, message: 'La cuenta del Administrador principal no puede ser eliminada.' });
    }

    const [rows] = await db.execute('SELECT id, nombre, email FROM usuario WHERE id = ?', [targetUserId]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'El usuario seleccionado no existe en la base de datos.' });
    }

    const targetUser = rows[0];
    if (targetUser.email && targetUser.email.toLowerCase() === 'admin') {
      return res.status(403).json({ success: false, message: 'No se puede eliminar la cuenta de administrador institucional.' });
    }

    try {
      await db.execute('DELETE FROM logs WHERE usuario_id = ?', [targetUserId]);
    } catch (logErr) {
      console.warn('[Admin] Advertencia al eliminar logs vinculados al usuario:', logErr.message);
    }

    await db.execute('DELETE FROM usuario WHERE id = ?', [targetUserId]);
    console.log(`[Admin] Usuario eliminado exitosamente vía POST: ID ${targetUserId} (${targetUser.nombre} - ${targetUser.email})`);

    res.json({
      success: true,
      message: `El usuario "${targetUser.nombre}" (${targetUser.email}) fue eliminado exitosamente de la base de datos.`
    });
  } catch (error) {
    console.error('Error al eliminar usuario por admin vía POST:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al eliminar el usuario' });
  }
});

/**
 * @name DELETE /deleteTrabajo/:id
 * @description Elimina un trabajo por su identificador. Realiza una eliminación limpia:
 * 1. Consulta la ruta del archivo asociado (`pdf_url`).
 * 2. Si es local, borra el archivo físico de la carpeta `uploads/`.
 * 3. Si es de Cloudinary, solicita a la API de Cloudinary la destrucción del activo por su `public_id`.
 * 4. Elimina la fila de la tabla `trabajos`.
 * 
 * @param {express.Request} req - Parámetro de ruta :id.
 * @param {express.Response} res - Mensaje de confirmación { message: string }.
 */
app.delete('/deleteTrabajo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT pdf_url FROM trabajos WHERE id = ?', [id]);

    if (rows.length > 0) {
      const pdf_url = rows[0].pdf_url;

      // 1. Si es archivo local (/uploads/...)
      if (pdf_url && (pdf_url.startsWith('/uploads/') || pdf_url.startsWith('uploads/'))) {
        const filename = path.basename(pdf_url);
        const fullLocalPath = path.join(uploadDir, filename);
        if (fs.existsSync(fullLocalPath)) {
          try {
            fs.unlinkSync(fullLocalPath);
            console.log(`[Storage] Archivo físico local eliminado: ${filename}`);
          } catch (fileErr) {
            console.warn('[Storage] No se pudo borrar el archivo local:', fileErr.message);
          }
        }
      }
      // 2. Si es Cloudinary y está configurado
      else if (pdf_url && pdf_url.includes('res.cloudinary.com')) {
        const urlParts = pdf_url.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
          const public_id = urlParts.slice(uploadIndex + 2).join('/').split('.')[0];
          try {
            await cloudinary.uploader.destroy(public_id);
          } catch (cloudError) {
            console.error('Error al eliminar de Cloudinary:', cloudError.message);
          }
        }
      }
    }

    await db.execute('DELETE FROM trabajos WHERE id = ?', [id]);
    res.json({ message: 'Trabajo eliminado' });
  } catch (error) {
    console.error("Error al eliminar trabajo:", error);
    res.status(500).json({ error: 'Error al eliminar trabajo' });
  }
});

/**
 * @name POST /register
 * @description Registra una nueva cuenta de usuario en el sistema.
 * 
 * @param {express.Request} req - Body con { nombre, email, password, esIutepalista }.
 * @param {express.Response} res - Respuesta JSON { success: true, message: string }.
 */
app.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, esIutepalista } = req.body;
    await db.execute(
      'INSERT INTO usuario (nombre, email, password, esIutepalista) VALUES (?, ?, ?, ?)',
      [nombre, email, password, esIutepalista ? 1 : 0]
    );
    res.json({ success: true, message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

/**
 * @name POST /login-admin
 * @description Autentica al Administrador del sistema verificando credenciales en BD.
 * Soporta usuarios administradores registrados y clave modificada individualmente.
 * 
 * @param {express.Request} req - Body con { username, password }.
 * @param {express.Response} res - { success: boolean, user?: Object }.
 */
app.post('/login-admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const cleanUsername = (username || '').trim();
    const cleanPassword = (password || '').trim();

    // 1. Verificar credenciales en la base de datos (por usuario, email o id = 0 si es admin)
    const isAdminLookup = cleanUsername.toLowerCase() === 'admin';
    const sql = isAdminLookup
      ? 'SELECT * FROM usuario WHERE (email = ? OR nombre = ? OR id = 0) AND password = ?'
      : 'SELECT * FROM usuario WHERE (email = ? OR nombre = ?) AND password = ?';
    const params = [cleanUsername, cleanUsername, cleanPassword];

    const [rows] = await db.execute(sql, params);

    if (rows && rows.length > 0) {
      return res.json({ success: true, user: rows[0] });
    }

    // 2. Fallback de instalación limpia inicial si aún no se ha modificado la BD
    if (cleanUsername.toLowerCase() === 'admin' && cleanPassword === '123') {
      return res.json({ success: true, user: { id: 0, nombre: 'Admin', email: 'admin' } });
    }

    res.json({ success: false, message: 'Credenciales de administrador incorrectas.' });
  } catch (error) {
    console.error("Error en login admin:", error);
    res.status(500).json({ error: 'Error en login admin' });
  }
});

/**
 * @name POST /login-guest
 * @description Autentica a estudiantes y visitantes mediante su correo electrónico institucional o personal.
 * 
 * @param {express.Request} req - Body con { email, password }.
 * @param {express.Response} res - { success: boolean, user?: Object }.
 */
app.post('/login-guest', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute(
      'SELECT id, nombre, email, password, esIutepalista FROM usuario WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error("Error en login-guest:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @name POST /log-access
 * @description Registra un evento de inicio de sesión o entrada a la plataforma en la bitácora (logs).
 * 
 * @param {express.Request} req - Body con { usuario_id, fecha }.
 * @param {express.Response} res - { message: 'Log registrado' }.
 */
app.post('/log-access', async (req, res) => {
  try {
    const { usuario_id, fecha } = req.body;
    await db.execute('INSERT INTO logs (usuario_id, action, doc_id, fecha) VALUES (?, ?, ?, ?)', [usuario_id, 'access', null, fecha]);
    res.json({ message: 'Log registrado' });
  } catch (error) {
    console.error("Error al registrar log:", error);
    res.status(500).json({ error: 'Error al registrar log' });
  }
});

/**
 * @name POST /change-password
 * @description Modifica la contraseña de un usuario individual validando primero su clave actual.
 * 
 * @param {express.Request} req - Body con { usuario_id, currentPassword, newPassword }.
 * @param {express.Response} res - { success: boolean, message: string }.
 */
app.post('/change-password', async (req, res) => {
  try {
    const { usuario_id, currentPassword, newPassword } = req.body;

    if (usuario_id === undefined || usuario_id === null || String(usuario_id).trim() === '') {
      return res.status(400).json({ success: false, message: 'ID de usuario requerido' });
    }

    if (!newPassword || newPassword.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 3 caracteres' });
    }

    // Buscar usuario por id numérico, texto o fallback de administrador principal
    const [user] = await db.execute(
      'SELECT id, password FROM usuario WHERE id = ? OR (id = 0 AND ? = "0")', 
      [usuario_id, String(usuario_id)]
    );

    if (!user || user.length === 0 || user[0].password !== currentPassword) {
      return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta' });
    }

    const targetId = user[0].id;
    await db.execute(
      'UPDATE usuario SET password = ? WHERE id = ?',
      [newPassword.trim(), targetId]
    );
    res.json({ success: true, message: 'Contraseña actualizada' });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ error: 'Error interno' });
  }
});

/**
 * @name GET /report
 * @description Retorna la bitácora de auditoría detallada de accesos, visualizaciones y descargas
 * cruzando los datos entre tablas `logs`, `usuario` y `trabajos`.
 * 
 * @param {express.Request} req - Petición HTTP.
 * @param {express.Response} res - Array JSON con registros de logs y nombres de usuario/documento.
 */
app.get('/report', async (req, res) => {
  try {
    const includeAdmin = req.query.includeAdmin === 'true';
    const whereClause = includeAdmin
      ? ''
      : `WHERE (l.usuario_id != 0 AND l.usuario_id != '0') AND (u.nombre IS NULL OR LOWER(u.nombre) NOT LIKE '%admin%') AND (u.email IS NULL OR LOWER(u.email) NOT LIKE '%admin%')`;

    const [rows] = await db.execute(`
      SELECT l.usuario_id, u.nombre, u.email, u.esIutepalista, l.fecha, l.action, l.doc_id, t.id as trabajo_id, t.nombre as doc_name
      FROM logs l 
      LEFT JOIN usuario u ON l.usuario_id = u.id
      LEFT JOIN trabajos t ON l.doc_id = t.id
      ${whereClause}
      ORDER BY l.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener reporte:", error);
    res.status(500).json({ error: 'Error al obtener reporte' });
  }
});

/**
 * @name POST /log-action
 * @description Registra una acción específica del usuario sobre un documento ('view' o 'download').
 * 
 * @param {express.Request} req - Body con { usuario_id, action, doc_id, fecha }.
 * @param {express.Response} res - { message: 'Acción registrada' }.
 */
app.post('/log-action', async (req, res) => {
  try {
    const { usuario_id, action, doc_id } = req.body;
    await registerAuditLog(usuario_id, action, doc_id);
    res.json({ message: 'Acción registrada' });
  } catch (error) {
    console.error("Error al registrar acción:", error);
    res.status(500).json({ error: 'Error al registrar acción' });
  }
});

/**
 * -----------------------------------------------------------------------------
 * INICIO DEL SERVIDOR HTTP
 * -----------------------------------------------------------------------------
 * Despliega la aplicación Express e imprime en consola los parámetros de configuración.
 */
const host = process.env.HOST || '0.0.0.0';

function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.listen(port, host, () => {
  const networkIp = getNetworkIp();
  console.log('='.repeat(60));
  console.log(` Servidor IUTEPAL en ejecución`);
  console.log(` URL Local       : http://localhost:${port}`);
  if (networkIp !== 'localhost') {
    console.log(` URL Red Local   : http://${networkIp}:${port} (desde otra PC / teléfono)`);
  }
  console.log(` Motor BD        : ${db.type.toUpperCase()}`);
  console.log(` Almacenamiento  : ${storageType.toUpperCase()} (${storageType === 'local' ? uploadDir : 'Cloudinary'})`);
  console.log('='.repeat(60));
});