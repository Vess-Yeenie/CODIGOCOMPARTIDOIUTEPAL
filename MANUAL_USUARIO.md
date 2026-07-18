# Manual de Usuario: Repositorio de Documentos IUTEPAL

Este manual proporciona una guía detallada para el uso y administración del **Repositorio de Documentos y Trabajos de Grado de IUTEPAL**. El sistema permite centralizar, buscar y gestionar la producción académica de la institución de forma digital.

---

## Índice
1. [Introducción y Objetivos](#1-introducción-y-objetivos)
2. [Roles de Usuario y Permisos](#2-roles-de-usuario-y-permisos)
3. [Registro y Acceso al Sistema](#3-registro-y-acceso-al-sistema)
4. [Búsqueda y Visualización de Documentos](#4-búsqueda-y-visualización-de-documentos)
5. [Líneas de Investigación](#5-líneas-de-investigación)
6. [Gestión de Documentos (Solo Administrador)](#6-gestión-de-documentos-solo-administrador)
7. [Reporte de Accesos y Auditoría (Solo Administrador)](#7-reporte-de-accesos-y-auditoría-solo-administrador)
8. [Configuración de Cuenta y Cerrar Sesión](#8-configuración-de-cuenta-y-cerrar-sesión)

---

## 1. Introducción y Objetivos

El **Repositorio de Documentos IUTEPAL** es una plataforma web interactiva diseñada para la consulta, almacenamiento y control de documentos académicos. Sus principales objetivos son:
* **Facilitar el acceso** a trabajos de grado, presentaciones y hojas de resumen de estudiantes de diversas carreras.
* **Organizar la información** mediante categorizaciones por carrera académica y año de publicación.
* **Auditar el uso de recursos** mediante el registro de visualizaciones y descargas en tiempo real.

---

## 2. Roles de Usuario y Permisos

El sistema implementa dos roles principales con diferentes niveles de privilegios:

| Funcionalidad | Estudiante / Invitado | Administrador |
| :--- | :---: | :---: |
| Registrar cuenta nueva | Sí | Sí (por BD/Registro) |
| Iniciar Sesión | Sí | Sí |
| Filtrar por Carrera, Año y Tipo | Sí | Sí |
| Visualizar y Descargar PDF/Video | Sí | Sí |
| Ver Líneas de Investigación | Sí | Sí |
| Cambiar Contraseña | Sí | Sí |
| Añadir / Subir Documentos | No | Sí |
| Editar Metadatos de Trabajos | No | Sí |
| Eliminar Trabajos del Repositorio | No | Sí |
| Ver Reportes de Logs y Accesos | No | Sí |

---

## 3. Registro y Acceso al Sistema

### 3.1. Inicio de Sesión (`index.html`)
Al ingresar al sistema, el usuario visualiza directamente el formulario de inicio de sesión en el panel derecho.
* **Acceso Invitado**: Se realiza ingresando el correo registrado y la contraseña correspondiente.
* **Acceso Administrador**: Se ingresa mediante credenciales administrativas predefinidas (ej. Usuario: `admin` y Contraseña: `123`).
* Si el usuario no tiene una cuenta creada, puede acceder al formulario de registro a través del enlace **Regístrate aquí** ubicado en la parte inferior del formulario.

### 3.2. Formulario de Registro (`registro.html`)
Página independiente a la que se accede únicamente desde el enlace de registro del login. Para registrarse, el usuario debe completar los siguientes campos con validaciones integradas:
* **Nombre y Apellido**: Solo se permiten caracteres alfabéticos (letras y espacios).
* **Correo Electrónico**: Formato estándar de correo (`usuario@dominio.com`).
* **Contraseña**: Mínimo 3 caracteres para garantizar una seguridad básica.
* **IUTEPALISTA (Casilla de verificación)**: Se marca si el usuario pertenece activamente a la comunidad de IUTEPAL.

---

## 4. Búsqueda y Visualización de Documentos

El menú principal (`menu.html`) está diseñado de forma intuitiva con herramientas de filtro avanzado y visualización:

```
+-------------------------------------------------------------------------+
| [LOGO]    [ BUSCADOR TEXTO ]  (Trabajo) (Presentación) (Resumen) [AÑO] |
+-------------------------------------------------------------------------+
| CARRERAS   |                                                            |
| (INF)      |                       LISTADO DE                           |
| (PROD)     |                       DOCUMENTOS                           |
| (ELEC)     |                      (Cards de PDF)                        |
| (CONT)     |                                                            |
+------------+------------------------------------------------------------+
```

### 4.1. Barra de Búsqueda
Ubicada en la cabecera del menú. Permite filtrar los trabajos dinámicamente en tiempo real escribiendo palabras clave relacionadas con el título o los autores.

### 4.2. Filtros por Tipo de Documento
Tres botones con iconos correspondientes a:
* **Trabajo de Grado**
* **Presentación**
* **Hoja de Resumen**

Al presionar un tipo, la pantalla se refresca mostrando únicamente los archivos de esa categoría.

### 4.3. Filtro por Año
Un menú desplegable ubicado a la derecha de la cabecera que permite delimitar la búsqueda a un año específico de publicación académica (por ejemplo: `2024`, `2025`, `2026`).

### 4.4. Panel de Carreras (Barra Lateral)
Permite hacer clic sobre la carrera correspondiente para filtrar el listado de documentos:
* **Informática**
* **Producción Industrial**
* **Electrónica**
* **Contabilidad**
* **Administración de Empresas**
* **Preescolar**

### 4.5. Cards de Documentos y Descarga
Cada documento se visualiza en una tarjeta ("card") interactiva que muestra el nombre del proyecto, carrera y año.
* Al hacer clic sobre una tarjeta, se abre el visualizador del PDF o se reproduce el archivo multimedia si es formato de video.
* Cada acción de visualización o descarga de un estudiante registra una entrada en la base de datos de logs para auditoría.

---

## 5. Líneas de Investigación

El sistema cuenta con un botón especial en la cabecera representado por un icono de documento.
* **Acción**: Abre un visor modal interactivo que muestra las **Líneas de Investigación** autorizadas por la institución en formato PDF.
* Esta sección permite que los investigadores o estudiantes orienten sus futuros proyectos según los marcos teóricos de la universidad.

---

## 6. Gestión de Documentos (Solo Administrador)

Los administradores del sistema tienen acceso a herramientas exclusivas para el mantenimiento de la base de datos de documentos.

### 6.1. Añadir Trabajo de Grado/Multimedia
1. Presionar el botón flotante **"+" (Añadir Trabajo)** en el panel lateral.
2. Se desplegará un formulario modal para ingresar los metadatos:
   * **Nombre del Proyecto**: Título representativo del trabajo académico.
   * **Carrera**: Menú de selección (Informática, Administración, etc.).
   * **Año**: Número entero entre `2000` y `2026`.
   * **Tipo de Documento**: Selección (Trabajo de Grado, Presentación, Resumen).
   * **Archivo**: Carga del archivo digital (`.pdf`, `.mp4`, `.mov`, `.avi`).
3. El sistema sube el archivo a **Cloudinary** a través de un stream fragmentado (`multer.memoryStorage`) para conexiones inestables, y guarda la URL segura en la base de datos MySQL local.

### 6.2. Editar Documento (✎)
El administrador verá el icono de un lápiz sobre cada tarjeta de documento. Al pulsarlo, el modal se precarga con la información del archivo para modificar cualquiera de sus metadatos o adjuntar un nuevo PDF/Video de reemplazo.

### 6.3. Eliminar Documento (🗑️)
El administrador verá un icono de papelera. Al pulsarlo, el sistema:
1. Extrae el `public_id` de la URL de Cloudinary.
2. Elimina el archivo físico almacenado en los servidores de la nube.
3. Elimina de manera definitiva la fila de registro en la tabla `trabajos` de la base de datos local.

---

## 7. Reporte de Accesos y Auditoría (Solo Administrador)

Ubicado en la barra lateral mediante un icono de gráfico/reporte.
* **Funcionalidad**: Carga un reporte de auditoría interactivo en tiempo real.
* **Datos mostrados**:
  * Nombre del usuario que accedió.
  * Si el usuario es miembro interno (Iutepalista) o externo.
  * Fecha exacta y hora del evento.
  * Acción realizada (`view` para visualizar o `download` para descargar).
  * Título del documento sobre el cual se ejecutó la acción.

---

## 8. Configuración de Cuenta y Cerrar Sesión

### 8.1. Cambiar Contraseña
Disponible a través del botón con el icono de candado/llave en la esquina superior derecha.
* **Usuarios Generales**: Modifica la contraseña de su propia cuenta ingresando su clave actual y confirmando la nueva contraseña.
* **Administrador**: Permite actualizar el nombre de usuario de administración y/o la contraseña maestra del panel de control.

### 8.2. Cerrar Sesión
Representado por el icono de salida en la cabecera.
* Limpia los datos de inicio de sesión almacenados localmente (`localStorage.clear()`) y redirecciona al usuario de vuelta a la pantalla de bienvenida (`index.html`) para evitar el uso indebido de cuentas en computadoras compartidas.
