# 📘 Documentación Técnica del Sistema de Gestión Documental IUTEPAL

> **Versión del Sistema:** 2.0.0 (Edición 100% Local y Multi-Almacenamiento)  
> **Fecha de Actualización:** Octubre 2026  
> **Autor / Arquitectura:** Desarrollador Full-Stack Senior & Arquitecto de Software  
> **Institución:** Instituto Universitario de Tecnología Juan Pablo Pérez Alfonzo (IUTEPAL)

---

## 📑 Tabla de Contenidos

1. [Descripción General y Propósito del Sistema](#1-descripción-general-y-propósito-del-sistema)
2. [Arquitectura de Software y Componentes](#2-arquitectura-de-software-y-componentes)
3. [Manual de Instalación y Configuración Paso a Paso](#3-manual-de-instalación-y-configuración-paso-a-paso)
   - [Prerrequisitos](#prerrequisitos)
   - [Clonación e Instalación](#clonación-e-instalación)
   - [Variables de Entorno (.env)](#variables-de-entorno-env)
   - [Ejecución del Servidor](#ejecución-del-servidor)
4. [Estructura y Modelado de la Base de Datos](#4-estructura-y-modelado-de-la-base-de-datos)
   - [Diagrama Entidad-Relación](#diagrama-entidad-relación)
   - [Descripción Detallada de Tablas y Campos](#descripción-detallada-de-tablas-y-campos)
   - [Soporte Dual: SQLite Embebido vs. MySQL Local](#soporte-dual-sqlite-embebido-vs-mysql-local)
5. [Módulo de Almacenamiento y Gestión de Archivos](#5-módulo-de-almacenamiento-y-gestión-de-archivos)
   - [Funcionamiento Histórico (Cloudinary)](#funcionamiento-histórico-cloudinary)
   - [Nuevo Funcionamiento Local (Disco / Multer)](#nuevo-funcionamiento-local-disco--multer)
   - [Servicio y Resolución de Rutas Estáticas](#servicio-y-resolución-de-rutas-estáticas)
6. [Instrucciones y Procedimiento de Migración](#6-instrucciones-y-procedimiento-de-migración)
   - [Siembra Inicial de Datos (`seed`)](#siembra-inicial-de-datos-seed)
   - [Migración de Cloudinary a Local](#migración-de-cloudinary-a-local)
   - [Migración de Cloudinary a Nueva Cuenta Cloudinary](#migración-de-cloudinary-a-nueva-cuenta-cloudinary)
   - [Aplicación de Consultas SQL Masivas](#aplicación-de-consultas-sql-masivas)
7. [Referencia de la API REST](#7-referencia-de-la-api-rest)
8. [Mantenimiento, Respaldos y Buenas Prácticas](#8-mantenimiento-respaldos-y-buenas-prácticas)

---

## 1. Descripción General y Propósito del Sistema

El **Sistema de Gestión de Documentos y Trabajos Especiales de Grado (TEG) de IUTEPAL** es una plataforma web desarrollada para catalogar, almacenar, auditar y difundir la producción académica e investigativa generada en la institución. 

### Objetivos Clave de la Refactorización Arquitectónica
- **Independencia de la Nube:** Transición desde un esquema con base de datos en la nube y almacenamiento en proveedores externos (Cloudinary) hacia un esquema **100% autosuficiente y local**, capaz de operar sin conexión a internet en redes locales (LAN) o servidores de campus.
- **Portabilidad Inmediata (Zero-Config):** Integración de **SQLite local embebido** nativo para ejecución instantánea sin necesidad de configurar servicios pesados adicionales, manteniendo compatibilidad total con **MySQL / MariaDB local (XAMPP / WampServer / Docker)**.
- **Gestión Híbrida de Archivos:** Soporte nativo para almacenar documentos (PDF, Word, Diapositivas, Videos MP4) en disco local mediante `multer.diskStorage`, además de permitir la migración automatizada hacia una nueva cuenta de Cloudinary si la organización así lo requiere.

---

## 2. Arquitectura de Software y Componentes

El sistema sigue un patrón arquitectónico desacoplado basado en **Node.js + Express** en el Backend y una interfaz de usuario interactiva y responsiva con **HTML5, CSS3 modular y JavaScript Vanilla (ES6+)** en el Frontend.

```mermaid
graph TD
    User([Navegador / Cliente Web]) -->|HTTP / REST| Express[Servidor Express - server.js]
    Express --> Static[Servidor de Archivos Estáticos /uploads]
    Express --> DBAdapter[Adaptador Unificado DB - db.js]
    
    subgraph Almacenamiento Local
        Disk[Carpeta uploads/ en Disco Local]
    end

    subgraph Base de Datos
        DBAdapter -->|DB_CLIENT=sqlite| SQLite[(SQLite Local - data/database.sqlite)]
        DBAdapter -->|DB_CLIENT=mysql| MySQL[(MySQL Local / XAMPP)]
    end

    subgraph Nube / Migración (Opcional)
        Express -.->|STORAGE_TYPE=cloudinary| CloudinaryOld[Cloudinary Origen]
        MigrationScript[Script migrate.js] --> CloudinaryOld
        MigrationScript --> Disk
        MigrationScript -.->|Opcional| CloudinaryNew[Cloudinary Nuevo]
        MigrationScript --> DBAdapter
    end

    Static --> Disk
```

### Componentes del Repositorio

- **`server.js`:** Núcleo de la aplicación API REST. Configura middlewares, rutas de autenticación, control de accesos, gestión de trabajos y servicio de archivos estáticos.
- **`db.js`:** Capa de abstracción de base de datos agnóstica que conmuta limpiamente entre SQLite (nativo con WAL) y MySQL (usando pool de conexiones de alto rendimiento).
- **`scripts/migrate.js`:** Script de migración industrial que descarga archivos de Cloudinary, actualiza las referencias en la base de datos y genera archivos SQL de actualización masiva.
- **`scripts/seed.js`:** Seeder idempotente que analiza el dump SQL base (`document_upload(3).sql`) y puebla la base de datos local en segundos.
- **`uploads/`:** Directorio físico en el servidor donde se almacenan y sirven los documentos en modo local.
- **`STRUCTURE/`:** Recursos de diseño web (CSS, imágenes, scripts frontend e íconos SVG).
- **`menu.html` / `menu.js`:** Panel principal para búsqueda, filtrado por carrera/año/tipo, descarga y visualización de documentos.
- **`index.html` / `login.js` / `registro.js`:** Control de acceso, login de usuarios (Estudiantes, Iutepalistas, Administradores).

---

## 3. Manual de Instalación y Configuración Paso a Paso

### Prerrequisitos

- **Node.js:** Versión 18.x o superior (Recomendado v20.x o v24.x).
- **NPM:** Versión 9.x o superior (incluido con Node.js).
- *(Opcional)* **MySQL / MariaDB:** Servidor local como XAMPP, WampServer o MariaDB (solo si se configura `DB_CLIENT=mysql`). Si se utiliza `DB_CLIENT=sqlite`, no se requiere ningún motor externo.

---

### Clonación e Instalación

1. **Abrir la terminal** en el directorio deseado y clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd CODIGOCOMPARTIDOIUTEPAL
   ```

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

---

### Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto (puedes tomar `.env.example` como referencia). El archivo contiene la configuración central del sistema:

```env
# ==========================================
# CONFIGURACIÓN DEL SERVIDOR
# ==========================================
PORT=3000

# ==========================================
# MODO DE ALMACENAMIENTO DE ARCHIVOS
# 'local'       -> Guarda archivos en el servidor en la carpeta uploads/ (100% local y offline)
# 'cloudinary'  -> Sube archivos a la cuenta de Cloudinary configurada
# ==========================================
STORAGE_TYPE=local
UPLOAD_DIR=uploads

# ==========================================
# MOTOR DE BASE DE DATOS
# 'sqlite' -> Base de datos local embebida sin necesidad de instalar servicios adicionales (Recomendado)
# 'mysql'  -> Conexión a MySQL/MariaDB local (XAMPP, WAMP, Docker, etc.)
# ==========================================
DB_CLIENT=sqlite

# Configuración para SQLite (archivo local)
SQLITE_DB_PATH=./data/database.sqlite

# Configuración para MySQL Local (si DB_CLIENT=mysql)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=document_upload

# ==========================================
# CLOUDINARY (CUENTA ORIGEN / ACTUAL)
# ==========================================
CLOUDINARY_CLOUD_NAME=dbdeldijt
CLOUDINARY_API_KEY=524613794845678
CLOUDINARY_API_SECRET=iE-fwTkWZPpvsLdBdmWTtTke8Fo

# ==========================================
# CLOUDINARY (NUEVA CUENTA / DESTINO DE MIGRACIÓN)
# Completa estos valores para migrar de una cuenta de Cloudinary a otra
# ==========================================
NEW_CLOUDINARY_CLOUD_NAME=
NEW_CLOUDINARY_API_KEY=
NEW_CLOUDINARY_API_SECRET=
```

---

### Ejecución del Servidor

El proyecto incluye comandos estandarizados en `package.json`:

| Comando | Acción |
| :--- | :--- |
| `npm start` | Inicia el servidor de producción. |
| `npm run dev` | Inicia el servidor en modo desarrollo. |
| `npm run seed` | Inicializa y puebla la base de datos con los datos originales. |
| `npm run migrate` | Descarga todos los archivos de Cloudinary a local y actualiza la BD. |
| `npm run migrate:cloudinary` | Migra los archivos de la cuenta antigua a la nueva cuenta de Cloudinary. |

Para iniciar la aplicación:
```bash
npm start
```
Abre en tu navegador web: [http://localhost:3000](http://localhost:3000)

---

## 4. Estructura y Modelado de la Base de Datos

### Diagrama Entidad-Relación

```mermaid
erDiagram
    USUARIO ||--o{ LOGS : genera
    TRABAJOS ||--o{ LOGS : registra_accion

    USUARIO {
        int id PK "Identificador único"
        varchar nombre "Nombre completo o alias"
        varchar email UK "Correo electrónico (login invitado)"
        varchar password "Contraseña de acceso"
        tinyint esIutepalista "1 = Estudiante IUTEPAL, 0 = Visitante"
    }

    TRABAJOS {
        varchar id PK "Identificador alfanumérico (ej: t1, t1773283912947)"
        text nombre "Título completo del trabajo de grado"
        varchar carrera "Carrera: INFORMATICA, PRODUCCION, CONTABILIDAD, etc."
        int ano "Año de presentación académica"
        varchar tipo "Tipo: trabajo, presentacion, resumen, video"
        text pdf_url "Ruta local (/uploads/...) o URL en la nube"
    }

    LOGS {
        int id PK "Identificador auto-incremental del registro"
        int usuario_id FK "Referencia a USUARIO.id (CASCADE DELETE)"
        varchar action "Acción efectuada: view, download, access"
        varchar doc_id FK "Referencia a TRABAJOS.id (SET NULL)"
        varchar fecha "Fecha/hora de la interacción"
    }
```

---

### Descripción Detallada de Tablas y Campos

#### 1. Tabla `usuario`
Gestiona las credenciales y niveles de permiso de acceso a la plataforma.

| Campo | Tipo | Nulo | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER / INT(11) | NO | Clave primaria. El usuario `0` corresponde al Administrador predeterminado. |
| `nombre` | VARCHAR(100) | NO | Nombre y apellido del usuario registrado. |
| `email` | VARCHAR(100) | NO | Correo electrónico único utilizado como identificador de inicio de sesión. |
| `password` | VARCHAR(255) | NO | Contraseña de acceso. |
| `esIutepalista`| TINYINT(1) / INT | SÍ | Flag binario. `1` indica estudiante activo de IUTEPAL (permisos especiales de lectura), `0` indica público general/visitante. |

#### 2. Tabla `trabajos`
Catálogo central de los documentos académicos subidos.

| Campo | Tipo | Nulo | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | NO | Clave primaria generada con prefijo temporal (ej: `t177328...`). |
| `nombre` | TEXT | SÍ | Título del Trabajo Especial de Grado o proyecto. |
| `carrera` | VARCHAR(50) | SÍ | Escuela académica: `INFORMATICA`, `PRODUCCION`, `ELECTRONICA`, `CONTABILIDAD`, `ADMINISTRACION`, `PREESCOLAR`. |
| `ano` | INTEGER / INT(11) | SÍ | Año de publicación o defensa (ej: 2018, 2024). |
| `tipo` | VARCHAR(20) | SÍ | Categoría: `trabajo` (Tesis completa), `presentacion` (Diapositivas/Video), `resumen` (Hoja resumen). |
| `pdf_url` | TEXT | SÍ | **Ruta de acceso al archivo.** En local adopta el formato `/uploads/archivo.pdf`. En la nube contiene el enlace de Cloudinary. |

#### 3. Tabla `logs`
Tabla de auditoría para reportes de actividad, visualizaciones y descargas.

| Campo | Tipo | Nulo | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER / INT(11) | NO | Clave primaria auto-incremental. |
| `usuario_id` | INT(11) | NO | Clave foránea referenciando a `usuario(id)`. |
| `action` | VARCHAR(50) | NO | Tipo de interacción registrada: `access` (inicio de sesión), `view` (visualización), `download` (descarga). |
| `doc_id` | VARCHAR(50) | SÍ | Clave foránea referenciando a `trabajos(id)`. |
| `fecha` | VARCHAR(100) | NO | Estampa de tiempo en formato ISO o fecha local. |

---

### Soporte Dual: SQLite Embebido vs. MySQL Local

El módulo `db.js` abstrae las diferencias sintácticas y de conexión entre ambos motores:

| Característica | Modo SQLite (`DB_CLIENT=sqlite`) | Modo MySQL Local (`DB_CLIENT=mysql`) |
| :--- | :--- | :--- |
| **Instalación requerida** | Ninguna (Nativo en Node.js mediante `node:sqlite`). | Requiere XAMPP, WAMP, MariaDB o contenedor Docker. |
| **Ubicación de datos** | Archivo único en `./data/database.sqlite`. | Servidor MySQL en `localhost:3306`. |
| **Concurrencia** | Modo WAL (Write-Ahead Logging) activado para lecturas concurrentes rápidas. | Pool de conexiones configurable (`mysql2.createPool`). |
| **Claves Foráneas** | Activadas explícitamente (`PRAGMA foreign_keys = ON`). | Nativas en motor InnoDB (`ON DELETE CASCADE / SET NULL`). |
| **Auto-inicialización** | Crea automáticamente las 3 tablas y el Admin por defecto si el archivo es nuevo. | Requiere crear la base de datos `document_upload` previamente. |

---

## 5. Módulo de Almacenamiento y Gestión de Archivos

### Funcionamiento Histórico (Cloudinary)
En la versión anterior:
1. Al enviar un formulario en el cliente, `multer.memoryStorage` recibía el buffer completo del archivo en la memoria RAM del servidor.
2. Se iniciaba un stream hacia la API de Cloudinary (`cloudinary.uploader.upload_stream`) con fragmentación de 6MB.
3. Al recibir respuesta con `secure_url` (ej: `https://res.cloudinary.com/...`), esta URL pública externa se guardaba en el campo `pdf_url` de la tabla `trabajos`.
4. **Desventajas:** Dependencia absoluta de conexión a internet, costos por ancho de banda/almacenamiento, lentitud en conexiones de subida inestables y riesgo de enlaces rotos si la cuenta de Cloudinary expiraba.

---

### Nuevo Funcionamiento Local (Disco / Multer)
En la nueva versión:
1. **Almacenamiento Directo en Disco:**
   Multer almacena el archivo directamente en la carpeta física `uploads/` usando `diskStorage`, evitando saturar la memoria RAM:
   ```javascript
   const localDiskStorage = multer.diskStorage({
     destination: (req, file, cb) => cb(null, uploadDir),
     filename: (req, file, cb) => {
       const ext = path.extname(file.originalname);
       const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
       cb(null, `${base}_${uniqueSuffix}${ext}`);
     }
   });
   ```
2. **Generación de Enlaces Relativos:**
   El endpoint `/upload` responde con una ruta relativa interna:
   ```json
   {
     "message": "Subido exitosamente al almacenamiento local",
     "url": "/uploads/nombre_del_documento_17732899.pdf"
   }
   ```
3. **Persistencia en Base de Datos:**
   Al crearse o editarse el trabajo, la base de datos almacena `/uploads/nombre_del_documento_17732899.pdf`.
4. **Limpieza Automatizada:**
   Al invocar `DELETE /deleteTrabajo/:id`, el servidor consulta la ruta del archivo. Si pertenece a `/uploads/`, ejecuta `fs.unlinkSync` sobre el archivo físico en disco, previniendo la acumulación de archivos huérfanos.

---

### Servicio y Resolución de Rutas Estáticas

El servidor Express publica el directorio físico `uploads/` bajo el prefijo URL `/uploads`:

```javascript
app.use('/uploads', express.static(uploadDir));
```

- **Visualización en el Navegador:** Cuando el usuario hace clic sobre una tarjeta de trabajo en `menu.html`, el frontend ejecuta `window.open('/uploads/archivo.pdf', '_blank')`. El visor de PDF nativo del navegador abre el documento inmediatamente desde el servidor local.
- **Descargas Directas:** La función `downloadItem` en `menu.js` aprovecha el mismo origen (`same-origin`) para que el atributo HTML5 `download` fuerce la descarga local sin restricciones de CORS.

---

## 6. Instrucciones y Procedimiento de Migración

### Siembra Inicial de Datos (`seed`)

Para inicializar la base de datos local con los 5 usuarios, 25 trabajos y 15 registros de auditoría provenientes de la copia de seguridad SQL:

```bash
npm run seed
```
*Salida esperada:*
```text
[Database] Conectado exitosamente a SQLite local (...)
============================================================
  INICIALIZACIÓN Y SIEMBRA DE BASE DE DATOS
  Motor activo: SQLITE
============================================================
[1/3] Insertando 5 usuarios... OK
[2/3] Insertando 25 trabajos de grado... OK
[3/3] Insertando 15 registros de auditoría/logs... OK
============================================================
  ¡Siembra de base de datos completada exitosamente!
============================================================
```

---

### Migración de Cloudinary a Local

Para descargar todos los documentos de la cuenta de Cloudinary hacia la carpeta local `uploads/` y actualizar los enlaces en la base de datos:

```bash
npm run migrate
```

O directamente mediante Node.js:
```bash
node scripts/migrate.js --target=local
```

#### Opciones Adicionales de la Herramienta de Migración:
- `--force`: Fuerza la re-descarga de archivos incluso si ya existen en la carpeta `uploads/`.
- `--all-api`: Consulta exhaustivamente la API de Cloudinary para todas las categorías (`image`, `video`, `raw`) y descarga cualquier recurso que no se encuentre vinculado a la base de datos.

---

### Migración de Cloudinary a Nueva Cuenta Cloudinary

Si la institución ha creado una nueva cuenta de Cloudinary y desea transferir todos los archivos:

1. Configura las credenciales de la nueva cuenta en `.env`:
   ```env
   NEW_CLOUDINARY_CLOUD_NAME=mi_nueva_cuenta
   NEW_CLOUDINARY_API_KEY=123456789012345
   NEW_CLOUDINARY_API_SECRET=abcdef1234567890
   ```
2. Ejecuta el script con destino Cloudinary:
   ```bash
   npm run migrate:cloudinary
   ```
   El script:
   - Descarga cada archivo desde la cuenta antigua.
   - Lo sube a la nueva cuenta en la carpeta `trabajos_iutepal`.
   - Actualiza el registro de la base de datos con la nueva URL segura de Cloudinary.
   - Genera el archivo SQL de respaldo `scripts/update_urls_new_cloudinary.sql`.

---

### Retorno a la Nube (Migración de Local hacia Cloudinary y MySQL Remoto)

Si la institución decide volver a utilizar Cloudinary y una base de datos remota en la nube:

1. **Configurar `.env`:**
   ```env
   STORAGE_TYPE=cloudinary
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret

   DB_CLIENT=mysql
   MYSQL_ADDON_URI=mysql://usuario:password@host_remoto:3306/nombre_bd
   ```
2. **Subir los archivos locales a Cloudinary:**
   ```bash
   npm run migrate:cloudinary
   ```
   El script subirá los archivos locales presentes en `uploads/` a Cloudinary y actualizará las URLs en la base de datos a `https://res.cloudinary.com/...`.
3. **Poblar la base de datos remota:**
   Ejecuta `npm run seed` apuntando al host remoto.
4. **Reiniciar servidor:** `npm start`.

> 💡 **Nota para el Analista de Sistemas:** Para un desglose exhaustivo de mantenimiento, topología, runbooks de incidencias y arquitectura interna, consulta el manual complementario: [MANUAL_ANALISTA_SISTEMAS.md](MANUAL_ANALISTA_SISTEMAS.md).

---

### Aplicación de Consultas SQL Masivas

Tras ejecutar la migración a local, el sistema genera automáticamente el archivo:
📁 **`scripts/update_urls_local.sql`**

Este archivo contiene sentencias SQL masivas listas para ejecutarse en phpMyAdmin, DBeaver, HeidiSQL o MySQL Workbench:

```sql
START TRANSACTION;
UPDATE trabajos SET pdf_url = '/uploads/rh65vts0vnduynvu8bum.pdf' WHERE id = 't1';
UPDATE trabajos SET pdf_url = '/uploads/rgk9vugk3gwrpwogloib.pdf' WHERE id = 't1773283912947';
UPDATE trabajos SET pdf_url = '/uploads/w215454x9r8bmca0ldp3.pdf' WHERE id = 't1773284025846';
-- ...
COMMIT;
```

---

## 7. Referencia de la API REST

### Endpoints Principales

| Método | Endpoint | Descripción | Payload / Parámetros | Respuesta Exitosa |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/upload` | Sube un archivo a disco local o Cloudinary | Form-Data: `documento` (File) | `{ "message": "...", "url": "/uploads/..." }` |
| `GET` | `/trabajos` | Obtiene la lista completa de trabajos | Ninguno | `[ { "id": "t1", "nombre": "...", "pdf_url": "..." }, ... ]` |
| `POST` | `/addTrabajo` | Registra un nuevo trabajo académico | JSON: `{ "nombre", "carrera", "ano", "tipo", "pdf_url" }` | `{ "success": true, "id": "t..." }` |
| `POST` | `/updateTrabajo` | Actualiza metadatos o archivo de un trabajo | JSON: `{ "id", "nombre", "carrera", "ano", "tipo", "pdf_url" }` | `{ "success": true, "message": "..." }` |
| `DELETE` | `/deleteTrabajo/:id` | Elimina el registro y borra el archivo físico | Parámetro URL: `id` | `{ "message": "Trabajo eliminado" }` |
| `POST` | `/login-admin` | Autenticación de Administrador | JSON: `{ "username", "password" }` | `{ "success": true, "user": { ... } }` |
| `POST` | `/login-guest` | Autenticación de Estudiantes / Visitantes | JSON: `{ "email", "password" }` | `{ "success": true, "user": { ... } }` |
| `POST` | `/register` | Registro de nuevos usuarios | JSON: `{ "nombre", "email", "password", "esIutepalista" }` | `{ "success": true, "message": "..." }` |
| `POST` | `/change-password` | Cambio de contraseña de usuario | JSON: `{ "usuario_id", "currentPassword", "newPassword" }` | `{ "success": true, "message": "..." }` |
| `GET` | `/report` | Reporte consolidado de visualizaciones | Ninguno | `[ { "nombre", "esIutepalista", "fecha", "doc_name" }, ... ]` |
| `POST` | `/log-action` | Registro de auditoría (ver / descargar) | JSON: `{ "usuario_id", "action", "doc_id", "fecha" }` | `{ "message": "Acción registrada" }` |

---

## 8. Mantenimiento, Respaldos y Buenas Prácticas

1. **Respaldo de Archivos Locales:**
   Para respaldar los documentos subidos, basta con copiar o comprimir la carpeta `uploads/`:
   ```bash
   tar -czvf respaldo_uploads_$(date +%F).tar.gz uploads/
   ```

2. **Respaldo de Base de Datos:**
   - **En SQLite:** Copia el archivo `data/database.sqlite`.
   - **En MySQL:** Ejecuta `mysqldump -u root -p document_upload > respaldo_bd.sql`.

3. **Seguridad y Permisos de Archivos:**
   - En entornos Linux/Unix, asegúrate de que el usuario que ejecuta Node.js posea permisos de lectura y escritura sobre la carpeta `uploads/`:
     ```bash
     chmod -R 755 uploads/
     ```
   - No subas el archivo `.env` con contraseñas de producción al control de versiones (Git).

4. **Transición Transparente:**
   Para volver a usar Cloudinary en cualquier momento, basta con cambiar `STORAGE_TYPE=cloudinary` en el archivo `.env` y reiniciar el servidor. No se requiere modificar una sola línea de código fuente.

---
*Fin de la Documentación Técnica.*
