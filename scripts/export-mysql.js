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

  // 1. Obtener registros de cada tabla
  const [usuarios] = await db.execute('SELECT * FROM usuario ORDER BY id ASC');
  const [trabajos] = await db.execute('SELECT * FROM trabajos ORDER BY ano DESC, nombre ASC');
  const [logs] = await db.execute('SELECT * FROM logs ORDER BY id ASC');

  let sql = `-- ======================================================================\n`;
  sql += `-- BASE DE DATOS INSTITUCIONAL IUTEPAL (MYSQL / MARIADB)\n`;
  sql += `-- Exportado automáticamente: ${new Date().toISOString()}\n`;
  sql += `-- Total Usuarios : ${usuarios.length}\n`;
  sql += `-- Total Trabajos : ${trabajos.length} (Con URLs activas en Cloudinary)\n`;
  sql += `-- Total Logs     : ${logs.length}\n`;
  sql += `-- ======================================================================\n\n`;

  sql += `SET NAMES utf8mb4;\n`;
  sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  sql += `CREATE DATABASE IF NOT EXISTS \`document_upload\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
  sql += `USE \`document_upload\`;\n\n`;

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
    const logLines = logs.map(l => 
      `  (${l.id}, ${l.usuario_id}, ${escapeSqlString(l.action)}, ${escapeSqlString(l.doc_id)}, ${escapeSqlString(l.fecha)})`
    );
    sql += logLines.join(',\n') + ';\n\n';
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;

  fs.writeFileSync(outputPath, sql, 'utf8');

  console.log(`[Éxito] Archivo generado exitosamente en:`);
  console.log(`  -> ${outputPath}`);
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
