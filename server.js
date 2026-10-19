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
require('dotenv').config();

// Módulo de abstracción de base de datos (SQLite / MySQL)
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

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
 */
const upload = multer({
  storage: storageType === 'cloudinary' ? multer.memoryStorage() : localDiskStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // Límite de 100MB
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
 * Despacho de Archivos Estáticos:
 * 1. `/uploads`: Acceso directo a documentos físicos almacenados en el servidor.
 * 2. `__dirname`: Servir archivos raíz (index.html, login.html, manifest.json, etc.).
 * 3. `STRUCTURE`: Servir activos del frontend modular (CSS, SCRIPTS, IMG, PDFs).
 */
app.use('/uploads', express.static(uploadDir));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'STRUCTURE')));

/**
 * -----------------------------------------------------------------------------
 * RUTAS DE LA API RESTful
 * -----------------------------------------------------------------------------
 */

/**
 * @name POST /upload
 * @description Sube un archivo documental (PDF, DOCX, MP4, etc.) al sistema.
 * Dependiendo de `STORAGE_TYPE`, persiste el archivo en el sistema de archivos local (`/uploads`)
 * o realiza un stream a Cloudinary.
 * 
 * @param {express.Request} req - Petición con archivo multipart/form-data bajo el campo 'documento'.
 * @param {express.Response} res - Respuesta JSON con el mensaje y la URL pública o relativa del archivo.
 * @returns {Object} { message: string, url: string }
 */
app.post('/upload', upload.single('documento'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    if (storageType === 'cloudinary') {
      // Subida por streaming directo a la nube
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
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
      return res.json({ message: 'Subido exitosamente a Cloudinary', url: result.secure_url });
    } else {
      // Almacenamiento 100% local en servidor físico
      const relativeUrl = `/uploads/${req.file.filename}`;
      return res.json({ message: 'Subido exitosamente al almacenamiento local', url: relativeUrl });
    }
  } catch (error) {
    console.error("Error detallado al subir documento:", error);
    res.status(500).json({ error: 'Error al subir el documento' });
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
 * 
 * @param {express.Request} req - Body conteniendo { nombre, carrera, ano, tipo, pdf_url }.
 * @param {express.Response} res - Respuesta JSON { success: true, id }.
 */
app.post('/addTrabajo', async (req, res) => {
  try {
    const { nombre, carrera, ano, tipo, pdf_url } = req.body;
    const id = 't' + Date.now();
    await db.execute(
      'INSERT INTO trabajos (id, nombre, carrera, ano, tipo, pdf_url) VALUES (?, ?, ?, ?, ?, ?)',
      [id, nombre, carrera, ano, tipo, pdf_url]
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

    let sql = "UPDATE trabajos SET nombre = ?, carrera = ?, ano = ?, tipo = ?";
    const params = [nombre, carrera, ano, tipo];

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
 * @description Autentica al Administrador del sistema o verifica credenciales en BD.
 * Soporta credenciales por defecto (admin / 123) y usuarios registrados.
 * 
 * @param {express.Request} req - Body con { username, password }.
 * @param {express.Response} res - { success: boolean, user?: Object }.
 */
app.post('/login-admin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación de administrador directo
    if (username === 'admin' && password === '123') {
      return res.json({ success: true, user: { id: 0, nombre: 'Admin', email: 'admin' } });
    }

    const [rows] = await db.execute('SELECT * FROM usuario WHERE email = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.json({ success: false });
    }
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
 * @description Modifica la contraseña de un usuario validando primero su clave actual.
 * 
 * @param {express.Request} req - Body con { usuario_id, currentPassword, newPassword }.
 * @param {express.Response} res - { success: boolean, message: string }.
 */
app.post('/change-password', async (req, res) => {
  try {
    const { usuario_id, currentPassword, newPassword } = req.body;
    const [user] = await db.execute(
      'SELECT password FROM usuario WHERE id = ?', 
      [usuario_id]
    );

    if (!user || user.length === 0 || user[0].password !== currentPassword) {
      return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta' });
    }

    await db.execute(
      'UPDATE usuario SET password = ? WHERE id = ?',
      [newPassword, usuario_id]
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
    const [rows] = await db.execute(`
      SELECT u.nombre, u.esIutepalista, l.fecha, l.action, t.nombre as doc_name
      FROM logs l 
      LEFT JOIN usuario u ON l.usuario_id = u.id
      LEFT JOIN trabajos t ON l.doc_id = t.id
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
    const { usuario_id, action, doc_id, fecha } = req.body;
    await db.execute('INSERT INTO logs (usuario_id, action, doc_id, fecha) VALUES (?, ?, ?, ?)', [usuario_id, action, doc_id, fecha]);
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
app.listen(port, () => {
  console.log('='.repeat(60));
  console.log(` Servidor IUTEPAL en ejecución`);
  console.log(` URL Local      : http://localhost:${port}`);
  console.log(` Motor BD       : ${db.type.toUpperCase()}`);
  console.log(` Almacenamiento : ${storageType.toUpperCase()} (${storageType === 'local' ? uploadDir : 'Cloudinary'})`);
  console.log('='.repeat(60));
});