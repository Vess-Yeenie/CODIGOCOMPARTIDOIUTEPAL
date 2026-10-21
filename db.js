/**
 * @file db.js
 * @description Capa de abstracción y conexión a base de datos agnóstica para el Repositorio IUTEPAL.
 * Proporciona un adaptador unificado con interfaz idéntica (execute, query, close) compatible con:
 * 1. SQLite embebido (utilizando el módulo nativo `node:sqlite` de Node.js v22+ sin dependencias de compilación en C++).
 * 2. MySQL / MariaDB (utilizando `mysql2/promise` para despliegues con servidor de base de datos relacional).
 * 
 * @module Database
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config();

/**
 * Cliente de base de datos seleccionado vía variable de entorno `DB_CLIENT`
 * Opciones válidas: 'sqlite' (por defecto) o 'mysql'.
 */
const dbClient = (process.env.DB_CLIENT || 'sqlite').toLowerCase();
let dbInstance = null;

if (dbClient === 'sqlite') {
  // =========================================================================
  // MOTOR SQLITE LOCAL (NATIVO EN NODE.JS)
  // =========================================================================
  const { DatabaseSync } = require('node:sqlite');
  const dbPath = path.resolve(__dirname, process.env.SQLITE_DB_PATH || './data/database.sqlite');
  const dbDir = path.dirname(dbPath);

  // Asegurar la existencia del directorio contenedor
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Inicializar base de datos sincrónica
  const sqlite = new DatabaseSync(dbPath);
  
  // Activar integridad referencial y modo WAL (Write-Ahead Logging) para alto desempeño y concurrencia
  sqlite.exec('PRAGMA foreign_keys = ON;');
  sqlite.exec('PRAGMA journal_mode = WAL;');

  /**
   * Definición del Esquema DDL para SQLite:
   * - `usuario`: Cuentas de administradores, estudiantes iutepalistas y visitantes.
   * - `trabajos`: Catálogo de Trabajos Especiales de Grado (TEG), Hojas de Resumen y Presentaciones.
   * - `logs`: Registro de auditoría de accesos y consumo de documentos (view/download).
   */
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      esIutepalista INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS trabajos (
      id VARCHAR(50) PRIMARY KEY,
      nombre TEXT DEFAULT NULL,
      carrera VARCHAR(50) DEFAULT NULL,
      ano INTEGER DEFAULT NULL,
      tipo VARCHAR(20) DEFAULT NULL,
      pdf_url TEXT DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      action VARCHAR(50) NOT NULL,
      doc_id VARCHAR(50) DEFAULT NULL,
      fecha VARCHAR(100) NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
      FOREIGN KEY (doc_id) REFERENCES trabajos(id) ON DELETE SET NULL
    );
  `);

  /**
   * Sembrar usuario administrador institucional predeterminado (id: 0, email: 'admin', pass: '123')
   * Garantiza que el sistema siempre sea operable tras una instalación limpia sin pasos manuales.
   */
  const adminCheck = sqlite.prepare("SELECT COUNT(*) AS count FROM usuario WHERE email = 'admin' OR id = 0").all();
  if (!adminCheck || adminCheck[0].count === 0) {
    sqlite.prepare(
      "INSERT OR IGNORE INTO usuario (id, nombre, email, password, esIutepalista) VALUES (?, ?, ?, ?, ?)"
    ).run(0, 'Admin', 'admin', '123', 1);
  }

  /**
   * Adaptador Unificado SQLite
   * Emula la respuesta [rows, fields] de mysql2 para total compatibilidad en los controladores de Express.
   */
  dbInstance = {
    type: 'sqlite',
    raw: sqlite,

    /**
     * Ejecuta una consulta SQL preparada con parámetros vinculados.
     * @param {string} sql - Sentencia SQL con marcadores '?'
     * @param {Array<any>} params - Valores vinculados
     * @returns {Promise<[Array<Object>, Object|null]>} Tupla compatible con mysql2
     */
    async execute(sql, params = []) {
      const trimmed = sql.trim().toUpperCase();
      const isSelect = trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('EXPLAIN');
      const cleanParams = (params || []).map(p => (p === undefined ? null : p));

      if (isSelect) {
        const stmt = sqlite.prepare(sql);
        const rows = stmt.all(...cleanParams);
        return [rows, null];
      } else {
        const stmt = sqlite.prepare(sql);
        const runResult = stmt.run(...cleanParams);
        const meta = {
          insertId: runResult.lastInsertRowid,
          affectedRows: runResult.changes
        };
        return [[], meta];
      }
    },

    /**
     * Alias para execute()
     */
    async query(sql, params = []) {
      return this.execute(sql, params);
    },

    /**
     * Cierra de forma ordenada la conexión a la base de datos SQLite.
     */
    close() {
      sqlite.close();
    }
  };
  console.log(`[Database] Conectado exitosamente a SQLite local (${dbPath})`);
} else {
  // =========================================================================
  // MOTOR MYSQL / MARIADB EXTERNO
  // =========================================================================
  const mysql = require('mysql2/promise');

  /**
   * Configuración del Pool de conexiones de MySQL
   * Soporta tanto URI completa (`MYSQL_ADDON_URI`) como variables individuales (.env).
   */
  /**
   * Configuración del Pool de conexiones de MySQL
   * Soporta tanto URI completa (`MYSQL_ADDON_URI`) como variables individuales (.env).
   * Límite predeterminado configurado en 3 conexiones para compatibilidad con planes gratuitos (Clever Cloud limita a 5).
   */
  let poolConfig;
  const maxConnections = parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 3;

  if (process.env.MYSQL_ADDON_URI) {
    try {
      const url = new URL(process.env.MYSQL_ADDON_URI);
      poolConfig = {
        host: url.hostname,
        port: parseInt(url.port, 10) || 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, ''),
        waitForConnections: true,
        connectionLimit: maxConnections,
        queueLimit: 0
      };
    } catch {
      poolConfig = process.env.MYSQL_ADDON_URI;
    }
  } else {
    poolConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'document_upload',
      waitForConnections: true,
      connectionLimit: maxConnections,
      queueLimit: 0
    };
  }

  const pool = mysql.createPool(poolConfig);

  /**
   * Adaptador Unificado MySQL
   */
  dbInstance = {
    type: 'mysql',
    raw: pool,

    /**
     * Ejecuta una consulta preparada en MySQL
     * @param {string} sql - Sentencia SQL con marcadores '?'
     * @param {Array<any>} params - Valores vinculados
     * @returns {Promise<[Array<Object>, Object]>}
     */
    async execute(sql, params = []) {
      const cleanParams = (params || []).map(p => (p === undefined ? null : p));
      return pool.execute(sql, cleanParams);
    },

    /**
     * Ejecuta una consulta directa en MySQL
     */
    async query(sql, params = []) {
      const cleanParams = (params || []).map(p => (p === undefined ? null : p));
      return pool.query(sql, cleanParams);
    },

    /**
     * Cierra el pool de conexiones MySQL.
     */
    close() {
      return pool.end();
    }
  };
  const targetHost = typeof poolConfig === 'string' ? 'URI' : `${poolConfig.host}:${poolConfig.port}`;
  console.log(`[Database] Pool de conexión inicializado para MySQL (${targetHost})`);
}

module.exports = dbInstance;
