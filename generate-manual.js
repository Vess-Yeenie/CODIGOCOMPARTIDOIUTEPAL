const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

async function generateManual() {
  const outputPath = path.join(__dirname, 'manual_usuario.docx');
  const capturesPath = path.join(__dirname, 'STRUCTURE', 'IMG', 'captures');

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'Manual de Usuario',
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: 'Sistema de Gestión de Documentos IUTEPAL',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: '',
        }),
        new Paragraph({
          text: '¿Para qué sirve?',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: 'Este sistema permite a los usuarios del IUTEPAL buscar, visualizar y descargar trabajos académicos en formato PDF. Los administradores pueden además subir nuevos documentos, editar la información de los trabajos y eliminar registros obsoletos. El objetivo principal es facilitar el acceso a documentos de carreras como Informática, Producción Industrial, Electrónica, Contabilidad y más.',
        }),
        new Paragraph({
          text: '',
        }),
        new Paragraph({
          text: 'Módulos de Funcionalidad',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: 'El sistema tiene los siguientes módulos principales:',
        }),
        new Paragraph({
          text: '• Inicio de sesión: Los usuarios ingresan con su correo y contraseña para acceder a sus opciones, ya sea como invitado o administrador.',
        }),
        new Paragraph({
          text: '• Registro de usuario: Los nuevos usuarios se registran con nombre, email y contraseña para poder consultar documentos y usar el sistema.',
        }),
        new Paragraph({
          text: '• Búsqueda y filtrado de documentos: Los usuarios pueden filtrar trabajos por carrera, año y tipo para encontrar lo que necesitan rápidamente.',
        }),
        new Paragraph({
          text: '• Visualización de trabajos: El listado muestra los trabajos disponibles con datos como nombre, carrera y año.',
        }),
        new Paragraph({
          text: '• Descarga de documentos: Los usuarios pueden descargar los archivos PDF directamente desde el sistema.',
        }),
        new Paragraph({
          text: '• Gestión de documentos (solo admin): Los administradores pueden subir nuevos trabajos, editar metadatos y eliminar archivos cuando sea necesario.',
        }),
        new Paragraph({
          text: '• Reportes y actividad: Se registra la actividad de acceso y acciones realizadas por los usuarios para un control básico de uso.',
        }),
      ],
    }],
  });

  // Función para añadir sección con imagen
  async function addImageSection(imageName, title, description) {
    const imagePath = path.join(capturesPath, imageName);
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      doc.addSection({
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: 500,
                  height: 300,
                },
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: description,
          }),
        ],
      });
    }
  }

  // Añadir secciones con capturas
  await addImageSection('index.png', 'Página de Inicio', 'Esta es la página principal del sistema. Aquí puedes ver el logo del IUTEPAL y opciones para iniciar sesión como administrador o invitado. Es el punto de entrada al sistema.');

  await addImageSection('login admin.png', 'Inicio de Sesión - Administrador', 'Formulario de login para administradores. Ingresa tu usuario (por defecto "admin") y contraseña ("123") para acceder a todas las funciones del sistema, incluyendo gestión de documentos.');

  await addImageSection('login estudiante.png', 'Inicio de Sesión - Estudiante/Invitado', 'Formulario de login para estudiantes o invitados. Usa tu email y contraseña registrados para acceder a la consulta de documentos. Los invitados tienen permisos limitados.');

  await addImageSection('registrarse.png', 'Registro de Nuevo Usuario', 'Página para registrar nuevos usuarios. Completa los campos de nombre, email, contraseña y marca si eres estudiante del IUTEPAL. Después del registro podrás iniciar sesión.');

  await addImageSection('menu.png', 'Menú Principal', 'El menú principal muestra las opciones disponibles según tu rol. Los administradores ven opciones adicionales como "Añadir Trabajo" y "Reportes". Los invitados ven solo las opciones de consulta.');

  await addImageSection('añadir.png', 'Añadir Nuevo Trabajo (Solo Admin)', 'Formulario para subir nuevos documentos PDF. Selecciona el archivo, ingresa la carrera, año y tipo de trabajo. El sistema lo subirá automáticamente a la nube.');

  await addImageSection('contraseña.png', 'Cambiar Contraseña', 'Página para cambiar tu contraseña actual. Ingresa la contraseña antigua y la nueva dos veces para confirmar. Esta opción está disponible para todos los usuarios registrados.');

  await addImageSection('reporte.png', 'Reportes de Actividad', 'Vista de reportes que muestra la actividad de usuarios: accesos, descargas y acciones realizadas. Solo visible para administradores, útil para monitorear el uso del sistema.');

  // Sección final
  doc.addSection({
    children: [
      new Paragraph({
        text: 'Cómo usar el sistema',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: '1. Inicia sesión con tu cuenta de usuario o con las credenciales de administrador.',
      }),
      new Paragraph({
        text: '2. Navega por las carreras y busca el trabajo que necesitas.',
      }),
      new Paragraph({
        text: '3. Haz clic en el documento para verlo o descargarlo.',
      }),
      new Paragraph({
        text: '4. Si eres administrador, usa las opciones de cargar, editar o eliminar documentos.',
      }),
      new Paragraph({
        text: '5. Revisa los reportes de actividad para conocer el uso del sistema.',
      }),
      new Paragraph({
        text: '',
      }),
      new Paragraph({
        text: 'Consejos para el usuario',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: '• Mantén tus credenciales seguras y no las compartas.',
      }),
      new Paragraph({
        text: '• Busca por carrera y año para encontrar documentos más rápido.',
      }),
      new Paragraph({
        text: '• Si tienes problemas con un archivo, contacta al administrador.',
      }),
      new Paragraph({
        text: '• Usa el módulo de reportes para ver el historial de tu actividad.',
      }),
      new Paragraph({
        text: '',
      }),
      new Paragraph({
        text: 'Manual de usuario del sistema IUTEPAL',
        alignment: AlignmentType.CENTER,
      }),
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  console.log('Manual de usuario generado: manual_usuario.docx');
}

generateManual().catch(console.error);