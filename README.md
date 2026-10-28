# 🎓 Repositorio de Documentos y Trabajos Especiales de Grado - IUTEPAL

> Sistema web institucional para la catalogación, custodia, difusión, seguridad anti-plagio y auditoría de Trabajos Especiales de Grado (TEG), Hojas de Resumen y Presentaciones del Instituto Universitario de Tecnología Juan Pablo Pérez Alfonzo (IUTEPAL) - Extensión Puerto Cabello.

---

## 🌳 Árbol del Proyecto (Estructura de Directorios)

```text
CODIGOCOMPARTIDOIUTEPAL/
│
├── data/                               # Almacén de base de datos embebida
│   └── database.sqlite                 # Base de datos SQLite local (generada automáticamente)
│
├── Manuales/                           # Manuales institucionales en formato PDF y Markdown
│   ├── Manual de Requisitos Técnicos e Instalación.pdf
│   ├── Manual de Usuario.pdf
│   └── Manual del Sistema.pdf
│
├── scripts/                            # Scripts de mantenimiento, procesamiento documental y utilidades CLI
│   ├── documentProcessor.js            # Orquestador Node.js para procesamiento de documentos y seguridad
│   ├── process_document.py             # Pipeline Python: Conversión Word a PDF, Marca de agua y Cifrado
│   ├── watermark_existing_uploads.py   # Procesador por lotes de seguridad para PDFs existentes en uploads/
│   ├── generate-analista-pdf.js        # Compilador automatizado de manual técnico en PDF
│   ├── migrate.js                      # Utilidad de migración Cloudinary <-> Almacenamiento Local
│   ├── seed.js                         # Inicializador y sembrador de BD desde volcado SQL
│   └── update_urls_local.sql           # Sentencias SQL para actualización masiva de URLs
│
├── STRUCTURE/                          # Activos del frontend modular
│   ├── CSS/                            # Hojas de estilo por vista y diseño global
│   │   ├── bienvenida.css              # Estilos de la portada de bienvenida y reloj digital
│   │   ├── loadingscreen.css           # Estilos de la pantalla de carga inicial
│   │   ├── login.css                   # Estilos de formularios de acceso y registro
│   │   ├── menu.css                    # Estilos del catálogo, tarjetas, filtros, sidebar y modales
│   │   └── theme.css                   # Variables de color institucional y tokens de diseño
│   ├── IMG/                            # Logotipos oficiales IUTEPAL, iconos SVG normalizados y banners
│   │   └── backup_icons/               # Respaldo de iconos originales de carreras antes de normalización
│   ├── PDFs/                           # Documentos institucionales fijos y líneas de investigación
│   └── SCRIPTS/                        # Controladores JavaScript modulares para el cliente
│       ├── bienvenida.js               # Reloj en tiempo real y navegación de la portada
│       ├── custom-alert.js             # Sistema de alertas modales asíncronas institucionales
│       └── menu.js                     # Controlador principal del catálogo, filtros, subida y auditoría
│
├── uploads/                            # Directorio local de persistencia para archivos subidos protegidos
│   └── backup_original_pdfs/           # Copias de seguridad originales previas al cifrado y marca de agua
│
├── .env                                # Configuración de variables de entorno activas (ignorado en git)
├── .env.example                        # Plantilla documentada de variables de entorno
├── database_clevercloud.sql            # Volcado SQL listo para Clever Cloud (sin CREATE DATABASE para evitar error #1044)
├── database_mysql_cloudinary.sql       # Volcado SQL completo con URLs de Cloudinary
├── db.js                               # Capa de abstracción y adaptador dual SQLite / MySQL
├── document_upload(3).sql              # Volcado SQL institucional con datos semilla
├── DOCUMENTACION_TECNICA.md            # Especificación técnica completa, diagramas y API v2.2.0
├── index.html                          # Vista de bienvenida institucional (reloj y accesos)
├── login.html                          # Vista de autenticación para administradores y estudiantes
├── login.js                            # Lógica del cliente para inicio de sesión y gestión de roles
├── manifest.json                       # Configuración de Progressive Web App (PWA)
├── menu.html                           # Vista principal del catálogo documental, sidebar y dashboard
├── package.json                        # Definición de dependencias, metadatos y scripts npm
├── registro.html                       # Vista de registro de nuevos usuarios
├── registro.js                         # Validaciones en cliente y envío de nuevos registros
├── server.js                           # Servidor Express, API RESTful y despacho estático
└── sw.js                               # Service Worker para PWA (estrategia network-first)
```

---

## 🚀 Capacidades y Características Principales

1. **Autonomía 100% Local y Multi-Base de Datos:**
   - Funciona sin internet mediante base de datos **SQLite embebida** nativa (`data/database.sqlite`), con soporte alternativo e instantáneo para **MySQL / MariaDB** (XAMPP o Clever Cloud).
2. **Conversión Automática de Word a PDF:**
   - Permite cargar documentos tanto en `.pdf` como en `.docx` y `.doc`, convirtiéndolos de forma transparente a PDF de alta resolución mediante integración nativa con Microsoft Word COM en Windows.
3. **Seguridad Integral Anti-Plagio y Propiedad Intelectual:**
   - **Marca de agua vectorial:** Aplica el sello oficial `IUTEPAL PUERTO CABELLO` en diagonal semitransparente, junto a encabezado institucional y pie de página en cada hoja.
   - **Cifrado de permisos:** Bloquea la copia de texto (`Ctrl+C`), modificación de contenido, extracción de páginas o edición de formularios, permitiendo la lectura sin contraseña y la impresión física.
4. **Gestión Dinámica de Carreras (CRUD):**
   - Creación, edición y eliminación de especialidades académicas directamente desde la interfaz de administración, personalizando nombres, códigos, colores hexadecimales e iconos visuales.
   - Acceso rápido para administradores: Clic derecho sobre el icono de cualquier carrera en la barra lateral para editarla de inmediato.
5. **Control de Acceso Basado en Roles (RBAC) Hardened:**
   - Ocultamiento estricto a nivel de CSS y DOM (`.admin-only-btn`) de las herramientas de administración (Añadir Trabajo, Generar Reporte y Gestión de Carreras) cuando se navega en modo estudiante o visitante.

---

## 📁 Archivos Clave y su Propósito

### 1. Núcleo Backend y Base de Datos
- **[`server.js`](server.js):** Punto de entrada del servidor Express.js. Expone los endpoints REST (`/upload`, `/trabajos`, `/carreras`, `/addTrabajo`, `/updateTrabajo`, `/deleteTrabajo`, `/register`, `/login-admin`, `/login-guest`, `/log-access`, `/change-password`, `/report`, `/log-action`). Implementa almacenamiento en disco local con pipeline de seguridad y sirve los recursos estáticos.
- **[`db.js`](db.js):** Capa de abstracción de datos unificada. Detecta la variable `DB_CLIENT` y conmuta de forma transparente entre **SQLite embebido** (a través de `node:sqlite` nativo de Node.js) y **MySQL** (mediante `mysql2/promise`).
- **[`.env.example`](.env.example):** Plantilla que documenta todas las variables requeridas: puerto (`PORT`), motor de base de datos (`DB_CLIENT`), credenciales MySQL y directorio de subidas (`UPLOAD_DIR`).

### 2. Procesamiento Documental y Seguridad
- **[`scripts/documentProcessor.js`](scripts/documentProcessor.js):** Conector Node.js que invoca el subproceso Python para transformar y securizar documentos entrantes.
- **[`scripts/process_document.py`](scripts/process_document.py):** Pipeline en Python utilizando `docx2pdf`, `reportlab` y `pypdf` para convertir Word a PDF, estampar marcas de agua diagonales institucionales y cifrar permisos.
- **[`scripts/watermark_existing_uploads.py`](scripts/watermark_existing_uploads.py):** Script de mantenimiento que aplicó la protección anti-plagio a todo el lote histórico existente en `uploads/`.

### 3. Frontend y Vistas de Usuario
- **[`menu.html`](menu.html) & [`STRUCTURE/SCRIPTS/menu.js`](STRUCTURE/SCRIPTS/menu.js):** Catálogo principal. Gestiona filtros multicriterio (carrera, año, tipo), paginación (límite de 20 tarjetas), modales de subida con barra de progreso, atajos de gestión de carreras y reportes ejecutivos.
- **[`STRUCTURE/CSS/menu.css`](STRUCTURE/CSS/menu.css):** Hoja de estilo con la jerarquía institucional IUTEPAL, animaciones y regla de visibilidad estricta para roles administrativos (`body:not(.is-admin) .admin-only-btn { display: none !important; }`).
- **[`index.html`](index.html), [`login.html`](login.html), [`login.js`](login.js):** Control de acceso inteligente, distinguiendo acceso de estudiante/visitante (por correo) y administrador (por usuario).
- **[`STRUCTURE/SCRIPTS/custom-alert.js`](STRUCTURE/SCRIPTS/custom-alert.js):** Sistema de alertas modales accesibles y asíncronas con desenfoque de fondo.

---

## 🚀 Inicio Rápido (Entorno Local)

### 1. Requisitos del Sistema
- **Node.js:** v18.x o superior (v20+ o v22+ LTS recomendado).
- **Python:** v3.10 o superior con las dependencias:
  ```bash
  pip install pypdf reportlab docx2pdf
  ```
- **Microsoft Word:** Instalado en el sistema (requerido en Windows para la conversión nativa de `.docx`/`.doc`).

### 2. Instalación y Ejecución
```bash
# 1. Clonar el repositorio e ingresar a la carpeta
cd CODIGOCOMPARTIDOIUTEPAL

# 2. Instalar dependencias de Node.js
npm install

# 3. Iniciar el servidor local
npm start

# 4. Abrir en el navegador
http://localhost:3000
```

---

## 🔑 Credenciales Predeterminadas

| Rol | Usuario / Correo | Contraseña | Permisos y Alcance |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `123` | Control total: Subir trabajos (PDF/Word con protección automática), gestionar carreras, editar y eliminar registros, ver reportes y auditar accesos. |
| **Estudiante IUTEPAL** | `test@correo.com` *(o `ejemplo@gmail.com`)* | `123456` *(o `123`)* | Acceso preferencial a Hojas de Resumen académicas, visualización y descarga de documentos protegidos. |
| **Visitante** | `otro@gmail.com` | `123` | Consulta y descarga de trabajos de grado completos y presentaciones protegidas. |

---

## 🛠️ Comandos Disponibles

| Comando | Acción |
| :--- | :--- |
| `npm start` | Inicia el servidor de la aplicación en `http://localhost:3000`. |
| `npm run dev` | Inicia el servidor en modo desarrollo. |
| `npm run seed` | Inicializa y puebla la base de datos con carreras, usuarios y trabajos iniciales. |
| `npm run migrate` | Descarga todos los archivos desde Cloudinary a disco local (`uploads/`) y actualiza la BD. |
| `npm run migrate:cloudinary` | Sube los archivos locales a Cloudinary y actualiza la base de datos a URLs de la nube. |
| `npm run export:mysql` | Exporta la base de datos completa a un volcado SQL para MySQL (`database_mysql_cloudinary.sql`). |
| `npm run generate-pdf` | Compila y genera el manual del analista en formato PDF. |

---

## 📚 Documentación Técnica y Manuales

- 📗 **[`DOCUMENTACION_TECNICA.md`](DOCUMENTACION_TECNICA.md):** Especificación técnica v2.2.0, arquitectura, diagramas Mermaid, diccionario de base de datos y endpoints REST.
- 📕 **[`Manuales/Manual de Usuario.pdf`](Manuales/Manual%20de%20Usuario.pdf):** Guía funcional paso a paso para estudiantes, investigadores y administradores.
- 📘 **[`Manuales/Manual del Sistema.pdf`](Manuales/Manual%20del%20Sistema.pdf):** Manual de arquitectura, seguridad anti-plagio, ciclo de vida de peticiones y protocolos de resolución de incidencias.
- 📙 **[`Manuales/Manual de Requisitos Técnicos e Instalación.pdf`](Manuales/Manual%20de%20Requisitos%20Técnicos%20e%20Instalación.pdf):** Especificaciones de hardware, configuración de entorno y despliegue como servicio con PM2.

---
© 2026 IUTEPAL - Instituto Universitario de Tecnología Juan Pablo Pérez Alfonzo. Todos los derechos reservados.
