/**
 * @file seed.js
 * @description Utilidad CLI de siembra (seeding) e inicialización masiva de datos en la base de datos.
 * Lee el archivo de volcado `document_upload(3).sql`, extrae las tuplas mediante expresiones regulares optimizadas
 * e inserta de forma idempotente (INSERT OR REPLACE en SQLite / ON DUPLICATE KEY UPDATE en MySQL) los registros
 * de usuarios, trabajos especiales de grado y bitácora histórica de auditoría.
 * 
 * @module Scripts/Seed
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('../db');

/**
 * Función principal de siembra y sincronización de datos institucionales.
 * @async
 * @returns {Promise<void>}
 */
async function seedDatabase() {
  console.log('='.repeat(60));
  console.log('  INICIALIZACIÓN Y SIEMBRA DE BASE DE DATOS');
  console.log(`  Motor activo: ${db.type.toUpperCase()}`);
  console.log('='.repeat(60));

  const sqlFilePath = path.join(__dirname, '..', 'document_upload(3).sql');
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`[Error] No se encontró el archivo SQL base en: ${sqlFilePath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

  // 1. Extraer Usuarios
  const userRegex = /\(([0-9]+),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*([0-9]+)\)/g;
  const users = [...sqlContent.matchAll(userRegex)].map(m => ({
    id: parseInt(m[1], 10),
    nombre: m[2],
    email: m[3],
    password: m[4],
    esIutepalista: parseInt(m[5], 10)
  }));

  console.log(`\n[1/3] Insertando ${users.length} usuarios...`);
  for (const u of users) {
    if (db.type === 'sqlite') {
      await db.execute(
        `INSERT OR REPLACE INTO usuario (id, nombre, email, password, esIutepalista) VALUES (?, ?, ?, ?, ?)`,
        [u.id, u.nombre, u.email, u.password, u.esIutepalista]
      );
    } else {
      await db.execute(
        `INSERT INTO usuario (id, nombre, email, password, esIutepalista) VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), password = VALUES(password), esIutepalista = VALUES(esIutepalista)`,
        [u.id, u.nombre, u.email, u.password, u.esIutepalista]
      );
    }
  }
  console.log('  -> Usuarios sincronizados con éxito.');

  // 2. Extraer Trabajos
  const trabajoRegex = /\('([^']+)',\s*'([^']*)',\s*'([^']*)',\s*([0-9]+),\s*'([^']*)',\s*'([^']*)'\)/g;
  const trabajos = [...sqlContent.matchAll(trabajoRegex)].map(m => ({
    id: m[1],
    nombre: m[2],
    carrera: m[3],
    ano: parseInt(m[4], 10),
    tipo: m[5],
    pdf_url: m[6]
  }));

  console.log(`\n[2/3] Insertando ${trabajos.length} trabajos de grado...`);
  for (const t of trabajos) {
    if (db.type === 'sqlite') {
      await db.execute(
        `INSERT OR REPLACE INTO trabajos (id, nombre, carrera, ano, tipo, pdf_url) VALUES (?, ?, ?, ?, ?, ?)`,
        [t.id, t.nombre, t.carrera, t.ano, t.tipo, t.pdf_url]
      );
    } else {
      await db.execute(
        `INSERT INTO trabajos (id, nombre, carrera, ano, tipo, pdf_url) VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), carrera = VALUES(carrera), ano = VALUES(ano), tipo = VALUES(tipo), pdf_url = VALUES(pdf_url)`,
        [t.id, t.nombre, t.carrera, t.ano, t.tipo, t.pdf_url]
      );
    }
  }
  console.log('  -> Trabajos sincronizados con éxito.');

  // 3. Extraer Logs
  const logRegex = /\(([0-9]+),\s*([0-9]+),\s*'([^']*)',\s*(NULL|'[^']*'),\s*'([^']*)'\)/g;
  const logs = [...sqlContent.matchAll(logRegex)].map(m => ({
    id: parseInt(m[1], 10),
    usuario_id: parseInt(m[2], 10),
    action: m[3],
    doc_id: m[4] === 'NULL' ? null : m[4].replace(/'/g, ''),
    fecha: m[5]
  }));

  console.log(`\n[3/3] Insertando ${logs.length} registros de auditoría/logs...`);
  for (const l of logs) {
    if (db.type === 'sqlite') {
      await db.execute(
        `INSERT OR REPLACE INTO logs (id, usuario_id, action, doc_id, fecha) VALUES (?, ?, ?, ?, ?)`,
        [l.id, l.usuario_id, l.action, l.doc_id, l.fecha]
      );
    } else {
      await db.execute(
        `INSERT INTO logs (id, usuario_id, action, doc_id, fecha) VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE action = VALUES(action), fecha = VALUES(fecha)`,
        [l.id, l.usuario_id, l.action, l.doc_id, l.fecha]
      );
    }
  }
  console.log('  -> Logs sincronizados con éxito.');

  console.log('\n' + '='.repeat(60));
  console.log('  ¡Siembra de base de datos completada exitosamente!');
  console.log('='.repeat(60) + '\n');

  if (typeof db.close === 'function') {
    db.close();
  }
}

if (require.main === module) {
  seedDatabase().catch(err => {
    console.error('[Error durante la siembra]:', err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
