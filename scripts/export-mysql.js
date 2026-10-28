/**
 * @file export-mysql.js
 * @description Utilidad para exportar la base de datos actual (con URLs de Cloudinary o locales)
 * a un archivo SQL completo compatible con MySQL / MariaDB / phpMyAdmin.
 * 
 * Genera el archivo 'database_mysql_cloudinary.sql' en la raíz del proyecto.
 * 
 * @module Scripts/ExportMySQL
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('../db');

function escapeSqlString(val) {
  if (val === null || val === undefined) return 'NULL';
  return "'" + String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
}

async function exportToMySQL() {
  console.log('='.repeat(65));
  console.log('  GENERANDO VOLCADO COMPLETO SQL PARA MYSQL / PHPMYADMIN');
  console.log('='.repeat(65));

  const outputPath = path.join(__dirname, '..', 'database_mysql_cloudinary.sql');
  const cleverPath = path.join(__dirname, '..', 'database_clevercloud.sql');

  // 1. Obtener registros de cada tabla (con fallback a SQLite local si MySQL remoto no responde)
  let usuarios = [];
  let trabajos = [];
  let logs = [];
  let fuente = db.type.toUpperCase();

  const forzarSqlite = process.argv.includes('--sqlite') || process.argv.includes('--from=sqlite');

  if (forzarSqlite) {
    fuente = 'SQLITE LOCAL';
    const { DatabaseSync } = require('node:sqlite');
    const sqlitePath = path.resolve(__dirname, '..', process.env.SQLITE_DB_PATH || './data/database.sqlite');
    const sqlite = new DatabaseSync(sqlitePath);
    usuarios = sqlite.prepare('SELECT * FROM usuario ORDER BY id ASC').all();
    trabajos = sqlite.prepare('SELECT * FROM trabajos ORDER BY ano DESC, nombre ASC').all();
    logs = sqlite.prepare('SELECT * FROM logs ORDER BY id ASC').all();
    sqlite.close();
  } else {
    try {
      [usuarios] = await db.execute('SELECT * FROM usuario ORDER BY id ASC');
      [trabajos] = await db.execute('SELECT * FROM trabajos ORDER BY ano DESC, nombre ASC');
      [logs] = await db.execute('SELECT * FROM logs ORDER BY id ASC');
    } catch (errDb) {
      console.warn(`[Aviso] No se pudo conectar a ${fuente} (${errDb.message}).`);
      console.warn('  -> Usando automáticamente base de datos SQLite local como respaldo...');
      fuente = 'SQLITE LOCAL (RESPALDO)';
      const { DatabaseSync } = require('node:sqlite');
      const sqlitePath = path.resolve(__dirname, '..', process.env.SQLITE_DB_PATH || './data/database.sqlite');
      const sqlite = new DatabaseSync(sqlitePath);
      usuarios = sqlite.prepare('SELECT * FROM usuario ORDER BY id ASC').all();
      trabajos = sqlite.prepare('SELECT * FROM trabajos ORDER BY ano DESC, nombre ASC').all();
      logs = sqlite.prepare('SELECT * FROM logs ORDER BY id ASC').all();
      sqlite.close();
    }
  }

  console.log(`  -> Fuente de datos: ${fuente}`);

  let sql = `-- ======================================================================\n`;
  sql += `-- BASE DE DATOS INSTITUCIONAL IUTEPAL (MYSQL / MARIADB / CLEVER CLOUD)\n`;
  sql += `-- Exportado automáticamente: ${new Date().toISOString()}\n`;
  sql += `-- Total Usuarios : ${usuarios.length}\n`;
  sql += `-- Total Trabajos : ${trabajos.length} (Con URLs activas en Cloudinary)\n`;
  sql += `-- Total Logs     : ${logs.length}\n`;
  sql += `-- Compatible con : Clever Cloud, Railway, phpMyAdmin, MySQL Local\n`;
  sql += `-- ======================================================================\n\n`;

  // Modos de compatibilidad esenciales
  // NO_AUTO_VALUE_ON_ZERO: Permite preservar el id = 0 para el usuario 'Admin' sin colisionar con id = 1
  sql += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n`;
  sql += `SET AUTOCOMMIT = 0;\n`;
  sql += `START TRANSACTION;\n`;
  sql += `SET time_zone = "+00:00";\n`;
  sql += `SET NAMES utf8mb4;\n`;
  sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  // NOTA: Para servicios en la nube (Clever Cloud, Railway, etc.), el usuario no tiene permisos
  // de superadministrador para crear bases de datos globales. No se agregan sentencias CREATE DATABASE ni USE.

  // 2. Tabla usuario
  sql += `-- ----------------------------------------------------------------------\n`;
  sql += `-- Estructura y Datos de la tabla 'usuario'\n`;
  sql += `-- ----------------------------------------------------------------------\n`;
  sql += `DROP TABLE IF EXISTS \`usuario\`;\n`;
  sql += `CREATE TABLE \`usuario\` (\n`;
  sql += `  \`id\` int(11) NOT NULL AUTO_INCREMENT,\n`;
  sql += `  \`nombre\` varchar(100) NOT NULL,\n`;
  sql += `  \`email\` varchar(100) NOT NULL UNIQUE,\n`;
  sql += `  \`password\` varchar(255) NOT NULL,\n`;
  sql += `  \`esIutepalista\` tinyint(1) DEFAULT 0,\n`;
  sql += `  PRIMARY KEY (\`id\`)\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  if (usuarios.length > 0) {
    sql += `INSERT INTO \`usuario\` (\`id\`, \`nombre\`, \`email\`, \`password\`, \`esIutepalista\`) VALUES\n`;
    const userLines = usuarios.map(u => 
      `  (${u.id}, ${escapeSqlString(u.nombre)}, ${escapeSqlString(u.email)}, ${escapeSqlString(u.password)}, ${u.esIutepalista ? 1 : 0})`
    );
    sql += userLines.join(',\n') + ';\n\n';
  }

  // 3. Tabla trabajos
  sql += `-- ----------------------------------------------------------------------\n`;
  sql += `-- Estructura y Datos de la tabla 'trabajos' (URLs Cloudinary)\n`;
  sql += `-- ----------------------------------------------------------------------\n`;
  sql += `DROP TABLE IF EXISTS \`trabajos\`;\n`;
  sql += `CREATE TABLE \`trabajos\` (\n`;
  sql += `  \`id\` varchar(50) NOT NULL,\n`;
  sql += `  \`nombre\` text DEFAULT NULL,\n`;
  sql += `  \`carrera\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`ano\` int(11) DEFAULT NULL,\n`;
  sql += `  \`tipo\` varchar(20) DEFAULT NULL,\n`;
  sql += `  \`pdf_url\` text DEFAULT NULL,\n`;
  sql += `  PRIMARY KEY (\`id\`)\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  if (trabajos.length > 0) {
    sql += `INSERT INTO \`trabajos\` (\`id\`, \`nombre\`, \`carrera\`, \`ano\`, \`tipo\`, \`pdf_url\`) VALUES\n`;
    const trabajoLines = trabajos.map(t => 
      `  (${escapeSqlString(t.id)}, ${escapeSqlString(t.nombre)}, ${escapeSqlString(t.carrera)}, ${t.ano !== null && t.ano !== undefined ? t.ano : 'NULL'}, ${escapeSqlString(t.tipo)}, ${escapeSqlString(t.pdf_url)})`
    );
    sql += trabajoLines.join(',\n') + ';\n\n';
  }

  // 4. Tabla logs
  sql += `-- ----------------------------------------------------------------------\n`;
  sql += `-- Estructura y Datos de la tabla 'logs'\n`;
  sql += `-- ----------------------------------------------------------------------\n`;
  sql += `DROP TABLE IF EXISTS \`logs\`;\n`;
  sql += `CREATE TABLE \`logs\` (\n`;
  sql += `  \`id\` int(11) NOT NULL AUTO_INCREMENT,\n`;
  sql += `  \`usuario_id\` int(11) NOT NULL,\n`;
  sql += `  \`action\` varchar(50) NOT NULL,\n`;
  sql += `  \`doc_id\` varchar(50) DEFAULT NULL,\n`;
  sql += `  \`fecha\` varchar(100) NOT NULL,\n`;
  sql += `  PRIMARY KEY (\`id\`),\n`;
  sql += `  KEY \`fk_logs_usuario\` (\`usuario_id\`),\n`;
  sql += `  KEY \`fk_logs_doc\` (\`doc_id\`),\n`;
  sql += `  CONSTRAINT \`fk_logs_usuario\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuario\` (\`id\`) ON DELETE CASCADE,\n`;
  sql += `  CONSTRAINT \`fk_logs_doc\` FOREIGN KEY (\`doc_id\`) REFERENCES \`trabajos\` (\`id\`) ON DELETE SET NULL\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  if (logs.length > 0) {
    sql += `INSERT INTO \`logs\` (\`id\`, \`usuario_id\`, \`action\`, \`doc_id\`, \`fecha\`) VALUES\n`;
    const logLines = logs.map(l => {
      const docIdVal = (l.doc_id && String(l.doc_id).trim() !== '' && l.doc_id !== 'null') ? escapeSqlString(l.doc_id) : 'NULL';
      return `  (${l.id}, ${l.usuario_id}, ${escapeSqlString(l.action)}, ${docIdVal}, ${escapeSqlString(l.fecha)})`;
    });
    sql += logLines.join(',\n') + ';\n\n';
  }

  sql += `COMMIT;\n`;
  sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;

  // Guardar en database_mysql_cloudinary.sql y en database_clevercloud.sql
  fs.writeFileSync(outputPath, sql, 'utf8');
  fs.writeFileSync(cleverPath, sql, 'utf8');

  console.log(`[Éxito] Archivos SQL generados exitosamente en:`);
  console.log(`  -> ${outputPath}`);
  console.log(`  -> ${cleverPath}`);
  console.log(`  -> Tamaño: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
  console.log('='.repeat(65) + '\n');

  if (typeof db.close === 'function') {
    db.close();
  }
}

if (require.main === module) {
  exportToMySQL().catch(err => {
    console.error('[Error al exportar a MySQL]:', err);
    process.exit(1);
  });
}

module.exports = exportToMySQL;
