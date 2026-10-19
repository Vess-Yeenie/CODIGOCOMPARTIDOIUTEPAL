# 🎓 Repositorio de Documentos y Trabajos Especiales de Grado - IUTEPAL

> Sistema web institucional para la consulta, almacenamiento, difusión y auditoría de Trabajos Especiales de Grado (TEG), Hojas de Resumen y Presentaciones del Instituto Universitario de Tecnología Juan Pablo Pérez Alfonzo (IUTEPAL).

---

## 🌳 Árbol del Proyecto (Estructura de Directorios)

```text
CODIGOCOMPARTIDOIUTEPAL/
│
├── data/                               # Almacén de base de datos embebida
│   └── database.sqlite                 # Base de datos SQLite local (generada automáticamente)
│
├── Manuales/                           # Manuales institucionales en formato PDF
│   ├── Manual de Requisitos Técnicos e Instalación.pdf
│   ├── Manual de Usuario.pdf
│   └── Manual del Sistema.pdf
│
├── scripts/                            # Scripts de mantenimiento, siembra y utilidades CLI
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
│   │   ├── menu.css                    # Estilos del catálogo, tarjetas, filtros y modales
│   │   └── theme.css                   # Variables de color institucional y tokens de diseño
│   ├── IMG/                            # Logotipos oficiales IUTEPAL, iconos SVG y banners
│   ├── PDFs/                           # Documentos institucionales fijos y líneas de investigación
│   └── SCRIPTS/                        # Controladores JavaScript modulares para el cliente
│       ├── bienvenida.js               # Reloj en tiempo real y navegación de la portada
│       ├── custom-alert.js             # Sistema de alertas modales asíncronas institucionales
│       └── menu.js                     # Controlador principal del catálogo, filtros, subida y auditoría
│
├── uploads/                            # Directorio local de persistencia para archivos subidos
│
├── .env                                # Configuración de variables de entorno activas (ignorado en git)
├── .env.example                        # Plantilla documentada de variables de entorno
├── db.js                               # Capa de abstracción y adaptador dual SQLite / MySQL
├── document_upload(3).sql              # Volcado SQL institucional con datos semilla
├── index.html                          # Vista de bienvenida institucional (reloj y accesos)
├── login.html                          # Vista de autenticación para administradores y estudiantes
├── login.js                            # Lógica del cliente para inicio de sesión y gestión de roles
├── manifest.json                       # Configuración de Progressive Web App (PWA)
├── menu.html                           # Vista principal del catálogo documental y dashboard
├── package.json                        # Definición de dependencias, metadatos y scripts npm
├── registro.html                       # Vista de registro de nuevos usuarios
├── registro.js                         # Validaciones en cliente y envío de nuevos registros
├── server.js                           # Servidor Express, API RESTful y despacho estático
└── sw.js                               # Service Worker para PWA (estrategia network-first)
```

---

## 📁 Archivos Clave y su Propósito

### 1. Núcleo Backend y Base de Datos
- **[`server.js`](server.js):** Punto de entrada del servidor Express.js. Expone los endpoints REST (`/upload`, `/trabajos`, `/addTrabajo`, `/updateTrabajo`, `/deleteTrabajo`, `/register`, `/login-admin`, `/login-guest`, `/log-access`, `/change-password`, `/report`, `/log-action`). Implementa almacenamiento híbrido mediante Multer (disco local `uploads/` o Cloudinary en la nube) y sirve los recursos estáticos.
- **[`db.js`](db.js):** Capa de abstracción de datos unificada. Detecta la variable `DB_CLIENT` y conmuta de forma transparente entre **SQLite embebido** (a través de `node:sqlite` nativo de Node.js) y **MySQL** (mediante `mysql2/promise`), ofreciendo la misma interfaz `execute()` y `query()`.
- **[`.env.example`](.env.example):** Plantilla que documenta todas las variables requeridas: puerto (`PORT`), motor de base de datos (`DB_CLIENT`), credenciales MySQL, modo de almacenamiento (`STORAGE_TYPE`) y claves de Cloudinary.

### 2. Frontend y Vistas de Usuario
- **[`index.html`](index.html) & [`STRUCTURE/SCRIPTS/bienvenida.js`](STRUCTURE/SCRIPTS/bienvenida.js):** Pantalla de aterrizaje institucional que presenta el reloj digital en tiempo real y botones para ingresar o registrarse.
- **[`login.html`](login.html) & [`login.js`](login.js):** Formulario de acceso inteligente. Detecta automáticamente si el identificador ingresado es un correo electrónico (flujo de estudiante/visitante) o nombre de usuario (flujo de administrador), persistiendo el rol y tokens en `localStorage` y registrando el evento en la bitácora.
- **[`registro.html`](registro.html) & [`registro.js`](registro.js):** Formulario de auto-registro con validación reactiva de coincidencia de contraseñas (`setCustomValidity`), validación por expresiones regulares (alfabético para nombres/apellidos) y selector de condición institucional.
- **[`menu.html`](menu.html) & [`STRUCTURE/SCRIPTS/menu.js`](STRUCTURE/SCRIPTS/menu.js):** Panel interactivo y catálogo principal. Gestiona:
  - Filtrado en memoria simultáneo por carrera, año de grado, tipo de trabajo y búsqueda en tiempo real.
  - Renderizado de tarjetas con animaciones CSS escalonadas.
  - Subida de archivos con barra de progreso en vivo (`XMLHttpRequest` + `upload.progress`).
  - Visualización y descarga con registro automático en `/log-action`.
  - Modales para visualización de Líneas de Investigación, Reportes de Auditoría administrativa y cambio de contraseña.
- **[`STRUCTURE/SCRIPTS/custom-alert.js`](STRUCTURE/SCRIPTS/custom-alert.js):** Reemplazo moderno y accesible para `window.alert()`. Soporta ejecución asíncrona mediante `Promise` (`await alert(...)`), desenfoque de fondo y atajos de teclado (`Enter` / `Esc`).
- **[`sw.js`](sw.js) & [`manifest.json`](manifest.json):** Habilita la instalación de la plataforma como Progressive Web App (PWA) de escritorio o móvil con política network-first.

### 3. Scripts de Mantenimiento y DevOps
- **[`scripts/seed.js`](scripts/seed.js):** Procesa el volcado institucional `document_upload(3).sql` y puebla de forma idempotente las tablas de usuarios, trabajos y bitácora en la base de datos configurada.
- **[`scripts/migrate.js`](scripts/migrate.js):** Utilidad para respaldar y migrar masivamente archivos desde Cloudinary al almacenamiento local en disco (`uploads/`) o retransmitir entre cuentas en la nube.
- **[`scripts/generate-analista-pdf.js`](scripts/generate-analista-pdf.js):** Motor de compilación documental basado en `PDFKit` que toma `MANUAL_ANALISTA_SISTEMAS.md` y genera un PDF profesional con portada y tablas.

---

## 🚀 Inicio Rápido (Entorno Local)

### 1. Requisitos
- **Node.js** v18 o superior (v22+ recomendado para SQLite nativo).
- **NPM** v9 o superior.

### 2. Instalación y Ejecución
```bash
# 1. Clonar el repositorio e ingresar a la carpeta
cd CODIGOCOMPARTIDOIUTEPAL

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local
npm start

# 4. Abrir en el navegador (o ejecutar 'npm run open')
http://localhost:3000
```

---

## 🔑 Credenciales Predeterminadas

| Rol | Usuario / Correo | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `123` | Control total: Subir, editar, eliminar trabajos, cambiar contraseñas y ver reportes de actividad. |
| **Estudiante IUTEPAL** | `test@correo.com` *(o `ejemplo@gmail.com`)* | `123456` *(o `123`)* | Acceso preferencial a Hojas de Resumen académicas y visualización de documentos. |
| **Visitante** | `otro@gmail.com` | `123` | Consulta y descarga de trabajos de grado completos y presentaciones. |

---

## 🛠️ Comandos Disponibles

| Comando | Acción |
| :--- | :--- |
| `npm start` | Inicia el servidor de la aplicación en `http://localhost:3000`. |
| `npm run dev` | Inicia el servidor en modo desarrollo. |
| `npm run open` | Abre la aplicación en el navegador predeterminado de Windows. |
| `npm run seed` | Inicializa y puebla la base de datos con los datos institucionales. |
| `npm run migrate` | Descarga todos los archivos desde Cloudinary a disco local (`uploads/`) y actualiza la BD. |
| `npm run migrate:cloudinary` | Sube los archivos locales a Cloudinary y actualiza la base de datos a URLs de la nube. |
| `npm run export:mysql` | Exporta la base de datos completa con URLs de Cloudinary a un volcado SQL para MySQL (`database_mysql_cloudinary.sql`). |
| `npm run generate-pdf` | Compila y genera el manual del analista en formato PDF (`manual_analista_sistemas.pdf`). |

---

## 📚 Documentación Técnica y Manuales

- 📄 **[MANUAL_ANALISTA_SISTEMAS.pdf](manual_analista_sistemas.pdf):** Manual oficial completo en formato PDF imprimible para el analista de sistemas / desarrollador de mantenimiento.
- 📘 **[MANUAL_ANALISTA_SISTEMAS.md](MANUAL_ANALISTA_SISTEMAS.md):** Manual técnico exhaustivo en Markdown con topología, matriz de variables `.env`, runbooks de incidencias y análisis de código.
- 📗 **[DOCUMENTACION_TECNICA.md](DOCUMENTACION_TECNICA.md):** Especificación de arquitectura, diagramas Mermaid, APIs y procedimientos de migración.
- 📙 **[MANUAL_USUARIO.md](MANUAL_USUARIO.md):** Manual funcional para estudiantes, profesores y administradores.
- 📐 **[CARTA_ESTRUCTURADA.md](CARTA_ESTRUCTURADA.md):** Carta estructurada y descomposición modular de la interfaz y módulos.

---
© 2026 IUTEPAL - Todos los derechos reservados.

