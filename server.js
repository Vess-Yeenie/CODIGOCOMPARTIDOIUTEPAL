const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Habilitar CORS
app.use(cors());

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dbdeldijt', // Reemplaza con tu cloud name
  api_key: '524613794845678', // Reemplaza con tu API key
  api_secret: 'iE-fwTkWZPpvsLdBdmWTtTke8Fo' // Reemplaza con tu API secret
});

// Configurar conexión a MySQL (XAMPP)
const dbConfig = {
  host: 'localhost',
  port: 3306, // Puerto por defecto de XAMPP
  user: 'root', // Usuario por defecto
  password: '', // Password vacía por defecto en XAMPP
  database: 'document_upload' // Nombre de la BD
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Servir archivos desde el directorio raíz
app.use(express.static(path.join(__dirname, 'STRUCTURE')));

// Configurar Multer para uploads en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para subir documentos
app.post('/upload', upload.single('documento'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    // Subir a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
  { 
    resource_type: 'auto', // Detecta si es 'image', 'video' o 'raw'
    chunk_size: 6000000,   // Permite archivos más grandes (6MB por trozo)
    access_mode: 'public'  // Asegura acceso sin 401
  },
  (error, result) => {
    if (error) reject(error);
    else resolve(result);
  }
);
      stream.end(req.file.buffer);
    });

    // Conectar a MySQL y guardar metadatos
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'INSERT INTO documentos (nombre, url, public_id, usuario_id) VALUES (?, ?, ?, ?)',
      [req.file.originalname, result.secure_url, result.public_id, req.body.usuario_id || 1] // Ajusta según tu lógica
    );
    await connection.end();

    res.json({ message: 'Documento subido exitosamente', url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir el documento' });
  }
});

// Ruta para obtener trabajos
app.get('/trabajos', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM trabajos');
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener trabajos' });
  }
});

// Ruta para añadir trabajo
// En server.js - Ruta corregida
app.post('/addTrabajo', async (req, res) => {
  try {
    const { nombre, carrera, ano, tipo, pdf_url } = req.body; // Asegúrate de recibir 'ano'
    const connection = await mysql.createConnection(dbConfig);
    
    // El INSERT debe coincidir con tu SQL (id, nombre, carrera, ano, tipo, pdf_url)
    const id = 't' + Date.now(); // Generamos un ID temporal
    await connection.execute(
      'INSERT INTO trabajos (id, nombre, carrera, ano, tipo, pdf_url) VALUES (?, ?, ?, ?, ?, ?)',
      [id, nombre, carrera, ano, tipo, pdf_url]
    );
    
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    console.error("Error al añadir trabajo:", error);
    res.status(500).json({ error: 'No se pudo guardar en la base de datos' });
  }
});

// Ruta para actualizar trabajo
// --- Busca o añade esto en tu server.js ---

app.post('/updateTrabajo', async (req, res) => {
    try {
        const { id, nombre, carrera, ano, tipo, pdf_url } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "ID requerido" });
        }

        // 1. CREAR LA CONEXIÓN (Igual que en tus otras rutas)
        const connection = await mysql.createConnection(dbConfig);

        const sql = "UPDATE trabajos SET nombre = ?, carrera = ?, ano = ?, tipo = ?, pdf_url = ? WHERE id = ?";
        
        // 2. EJECUTAR
        await connection.execute(sql, [nombre, carrera, ano, tipo, pdf_url, id]);

        // 3. CERRAR LA CONEXIÓN
        await connection.end();

        res.json({ success: true, message: "Trabajo actualizado correctamente" });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});
// Ruta para eliminar trabajo
app.delete('/deleteTrabajo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);

    // Obtener el pdf_url antes de eliminar
    const [rows] = await connection.execute('SELECT pdf_url FROM trabajos WHERE id = ?', [id]);
    if (rows.length > 0) {
      const pdf_url = rows[0].pdf_url;
      // Si es una URL de Cloudinary, extraer public_id y eliminar
      if (pdf_url && pdf_url.includes('res.cloudinary.com')) {
        // Extraer public_id de la URL: /upload/v.../public_id.ext
        const urlParts = pdf_url.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
          const public_id = urlParts[uploadIndex + 2].split('.')[0]; // quitar extensión
          try {
            await cloudinary.uploader.destroy(public_id);
          } catch (cloudError) {
            console.error('Error al eliminar de Cloudinary:', cloudError);
            // No fallar la eliminación si Cloudinary falla
          }
        }
      }
    }

    await connection.execute('DELETE FROM trabajos WHERE id = ?', [id]);
    await connection.end();
    res.json({ message: 'Trabajo eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar trabajo' });
  }
});

// Ruta para registrar usuario
// Busca la ruta app.post('/register', ...) y asegúrate que el INSERT sea así:
app.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, esIutepalista } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    // CAMBIO AQUÍ: de "usuarios" a "usuario"
    const [result] = await connection.execute(
      'INSERT INTO usuario (nombre, email, password, esIutepalista) VALUES (?, ?, ?, ?)',
      [nombre, email, password, esIutepalista ? 1 : 0]
    );
    
    await connection.end();
    res.json({ success: true, message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta para login admin
app.post('/login-admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ? AND password = ? AND role = "admin"', [username, password]);
    await connection.end();
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en login admin' });
  }
});

// Ruta para login guest
app.post('/login-guest', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    // CAMBIO CLAVE: "FROM usuario" en lugar de "FROM usuarios"
    const [rows] = await connection.execute(
      'SELECT id, nombre, email, password, esIutepalista FROM usuario WHERE email = ? AND password = ?',
      [email, password]
    );

    await connection.end();

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

// Ruta para registrar log de acceso
app.post('/log-access', async (req, res) => {
  try {
    const { usuario_id, fecha } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('INSERT INTO logs (usuario_id, fecha) VALUES (?, ?)', [usuario_id, fecha]);
    await connection.end();
    res.json({ message: 'Log registrado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar log' });
  }
});
// Ruta para cambiar contraseña - AGREGAR A SERVER.JS
app.post('/change-password', async (req, res) => {
  try {
    const { usuario_id, currentPassword, newPassword } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    // 1. Verificar si la contraseña actual es correcta
    const [user] = await connection.execute(
      'SELECT password FROM usuario WHERE id = ?', 
      [usuario_id]
    );

    if (user.length === 0 || user[0].password !== currentPassword) {
      await connection.end();
      return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta' });
    }

    // 2. Actualizar a la nueva
    await connection.execute(
      'UPDATE usuario SET password = ? WHERE id = ?',
      [newPassword, usuario_id]
    );
    
    await connection.end();
    res.json({ success: true, message: 'Contraseña actualizada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});
// Ruta para obtener reporte de logs
// Ruta para obtener reporte de logs - CORREGIDA
// En server.js
app.get('/report', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT u.nombre, u.esIutepalista, l.fecha, l.action, t.nombre as doc_name
      FROM logs l 
      JOIN usuario u ON l.usuario_id = u.id   -- <--- ANTES DECÍA "usuarios"
      LEFT JOIN trabajos t ON l.doc_id = t.id
      ORDER BY l.fecha DESC
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reporte' });
  }
});
// Ruta para registrar acción de usuario (view/download)
app.post('/log-action', async (req, res) => {
  try {
    const { usuario_id, action, doc_id, fecha } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('INSERT INTO logs (usuario_id, action, doc_id, fecha) VALUES (?, ?, ?, ?)', [usuario_id, action, doc_id, fecha]);
    await connection.end();
    res.json({ message: 'Acción registrada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar acción' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});