/**
 * @file generate-analista-pdf.js
 * @description Generador automático de documentación corporativa en formato PDF imprimible.
 * Compila y formatea el archivo `MANUAL_ANALISTA_SISTEMAS.md` generando `manual_analista_sistemas.pdf`
 * utilizando la biblioteca `PDFKit`.
 * 
 * Capacidades del motor de renderizado:
 * - Portada institucional con identidad visual IUTEPAL, franjas heráldicas y ficha técnica de transferencia.
 * - Parser sintáctico de Markdown a primitivas de dibujo PDFKit (títulos H1 a H4, párrafos, viñetas, tablas y bloques de código).
 * - Algoritmo de control de flujo y salto de página automático (`ensureSpace`).
 * - Paginación diferida de dos pasadas con pie de página institucional ("Página X de Y").
 * 
 * @module Scripts/GenerateAnalistaPDF
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

/**
 * Función principal que orquesta la lectura de Markdown, instanciación del documento PDFKit y renderizado a disco.
 * @async
 * @returns {Promise<void>}
 */
async function buildAnalistaPdf() {
  console.log('='.repeat(60));
  console.log('  GENERANDO MANUAL DEL ANALISTA DE SISTEMAS EN PDF');
  console.log('='.repeat(60));

  let mdPath = path.join(__dirname, '..', 'MANUAL_ANALISTA_SISTEMAS.md');
  const pdfPath = path.join(__dirname, '..', 'manual_analista_sistemas.pdf');
  const logoPath = path.join(__dirname, '..', 'STRUCTURE', 'IMG', 'iutepal_logo.png');

  if (!fs.existsSync(mdPath)) {
    const fallbackPath = path.join(__dirname, '..', 'DOCUMENTACION_TECNICA.md');
    if (fs.existsSync(fallbackPath)) {
      mdPath = fallbackPath;
      console.log(`[Info] Utilizando fuente de documentación técnica: ${path.basename(fallbackPath)}`);
    } else {
      console.error(`[Error] No se encontró el archivo Markdown en: ${mdPath}`);
      process.exit(1);
    }
  }

  const markdownContent = fs.readFileSync(mdPath, 'utf8');

  // Inicializar documento PDF con buffer de páginas para numeración
  const doc = new PDFDocument({
    autoFirstPage: false,
    bufferPages: true,
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Paleta de Colores Corporativos
  const COLOR_PRIMARY = '#0F2942';    // Azul marino IUTEPAL
  const COLOR_SECONDARY = '#1D4ED8';  // Azul rey / títulos
  const COLOR_TEXT = '#1F2937';       // Texto oscuro principal
  const COLOR_MUTED = '#4B5563';      // Texto secundario
  const COLOR_BORDER = '#CBD5E1';     // Bordes suaves
  const COLOR_BG_CODE = '#F8FAFC';    // Fondo código
  const COLOR_GOLD = '#D97706';       // Dorado institucional

  const pageWidth = 612;
  const pageHeight = 792;
  const contentWidth = pageWidth - 100;

  // ==========================================
  // PÁGINA 1: PORTADA PROFESIONAL
  // ==========================================
  doc.addPage();

  // Franja decorativa superior
  doc.rect(0, 0, pageWidth, 12).fill(COLOR_PRIMARY);
  doc.rect(0, 12, pageWidth, 4).fill(COLOR_GOLD);

  // Logo IUTEPAL
  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, (pageWidth - 110) / 2, 70, { width: 110 });
    } catch (e) {
      console.warn('No se pudo incrustar el logo:', e.message);
    }
  }

  doc.y = 200;
  doc.font('Helvetica-Bold').fontSize(11).fillColor(COLOR_MUTED)
     .text('INSTITUTO UNIVERSITARIO DE TECNOLOGÍA', { align: 'center', characterSpacing: 1.5 });
  doc.text('JUAN PABLO PÉREZ ALFONZO (IUTEPAL)', { align: 'center', characterSpacing: 1.5 });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor(COLOR_SECONDARY)
     .text('DEPARTAMENTO DE INFORMÁTICA Y SISTEMAS', { align: 'center', characterSpacing: 1.2 });

  // Línea divisoria decorativa
  doc.moveDown(1.5);
  const lineY = doc.y;
  doc.strokeColor(COLOR_GOLD).lineWidth(2).moveTo(150, lineY).lineTo(pageWidth - 150, lineY).stroke();

  doc.y = lineY + 25;
  doc.font('Helvetica-Bold').fontSize(24).fillColor(COLOR_PRIMARY)
     .text('MANUAL TÉCNICO Y GUÍA DE TRASPASO', { align: 'center' });
  doc.moveDown(0.3);
  doc.font('Helvetica').fontSize(14).fillColor(COLOR_SECONDARY)
     .text('Para el Analista de Sistemas / Ingeniero de Mantenimiento', { align: 'center' });

  doc.moveDown(1.5);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(COLOR_TEXT)
     .text('Repositorio Documental y Gestión de Trabajos Especiales de Grado (TEG)', { align: 'center' });

  // Cuadro informativo inferior
  const boxY = pageHeight - 190;
  doc.roundedRect(80, boxY, pageWidth - 160, 105, 8).fillAndStroke('#F8FAFC', COLOR_BORDER);

  doc.fillColor(COLOR_PRIMARY);
  doc.font('Helvetica-Bold').fontSize(10).text('FICHA TÉCNICA DE TRANSFERENCIA:', 100, boxY + 15);
  doc.font('Helvetica').fontSize(9).fillColor(COLOR_TEXT);
  doc.text('• Versión del Software   : 2.0.0 (Edición 100% Local y Multi-Nube)', 100, boxY + 33);
  doc.text('• Arquitectura          : Express.js + SQLite/MySQL + Multer + Cloudinary', 100, boxY + 47);
  doc.text('• Fecha de Publicación  : Octubre 2026', 100, boxY + 61);
  doc.text('• Clasificación         : Documentación de Mantenimiento / Transferencia', 100, boxY + 75);

  // Franja decorativa inferior
  doc.rect(0, pageHeight - 12, pageWidth, 12).fill(COLOR_PRIMARY);

  // ==========================================
  // PÁGINAS DE CONTENIDO: PARSEO MARKDOWN
  // ==========================================
  doc.addPage();
  doc.y = 50;

  function ensureSpace(neededHeight) {
    if (doc.y + neededHeight > pageHeight - 60) {
      doc.addPage();
      doc.y = 50;
    }
  }

  function cleanMarkdownFormatting(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1');
  }

  const rawLines = markdownContent.split(/\r?\n/);
  let inCodeBlock = false;
  let codeBuffer = [];
  let inTable = false;
  let tableBuffer = [];

  function flushCodeBlock() {
    if (codeBuffer.length === 0) return;
    const textCode = codeBuffer.join('\n');
    const estimatedHeight = Math.min(codeBuffer.length * 11 + 16, 250);
    ensureSpace(estimatedHeight);

    const startY = doc.y;
    doc.roundedRect(50, startY, contentWidth, estimatedHeight, 4).fillAndStroke(COLOR_BG_CODE, COLOR_BORDER);

    doc.fillColor('#334155').font('Courier').fontSize(8.5);
    doc.text(textCode, 58, startY + 8, {
      width: contentWidth - 16,
      height: estimatedHeight - 16,
      lineGap: 2
    });

    doc.y = startY + estimatedHeight + 10;
    codeBuffer = [];
  }

  function flushTable() {
    if (tableBuffer.length === 0) return;
    const rows = tableBuffer.map(r => r.split('|').map(c => cleanMarkdownFormatting(c.trim())).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1));
    const cleanRows = rows.filter(r => !r.every(c => /^[-:]+$/.test(c)));

    if (cleanRows.length === 0) { tableBuffer = []; return; }

    const colCount = cleanRows[0].length;
    const colWidth = contentWidth / colCount;
    const rowHeight = 22;

    ensureSpace(cleanRows.length * rowHeight + 20);

    let tableY = doc.y;

    cleanRows.forEach((row, rowIdx) => {
      const isHeader = rowIdx === 0;
      const bg = isHeader ? COLOR_PRIMARY : (rowIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC');

      doc.rect(50, tableY, contentWidth, rowHeight).fillAndStroke(bg, COLOR_BORDER);

      row.forEach((cellText, colIdx) => {
        const cellX = 50 + (colIdx * colWidth) + 4;
        doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
           .fontSize(isHeader ? 8.5 : 8)
           .fillColor(isHeader ? '#FFFFFF' : COLOR_TEXT);

        doc.text(cellText, cellX, tableY + 6, {
          width: colWidth - 8,
          height: rowHeight - 6,
          ellipsis: true
        });
      });

      tableY += rowHeight;
    });

    doc.y = tableY + 12;
    tableBuffer = [];
  }

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Detección de Bloques de Código
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        if (inTable) { flushTable(); inTable = false; }
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Detección de Tablas
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      tableBuffer.push(line);
      continue;
    } else if (inTable) {
      flushTable();
      inTable = false;
    }

    // Encabezados H1
    if (line.startsWith('# ')) {
      ensureSpace(45);
      const title = cleanMarkdownFormatting(line.replace('# ', ''));
      doc.font('Helvetica-Bold').fontSize(17).fillColor(COLOR_PRIMARY).text(title);
      const lineY = doc.y + 2;
      doc.strokeColor(COLOR_GOLD).lineWidth(1.5).moveTo(50, lineY).lineTo(pageWidth - 50, lineY).stroke();
      doc.y = lineY + 10;
      continue;
    }

    // Encabezados H2
    if (line.startsWith('## ')) {
      ensureSpace(35);
      const title = cleanMarkdownFormatting(line.replace('## ', ''));
      doc.font('Helvetica-Bold').fontSize(13.5).fillColor(COLOR_SECONDARY).text(title);
      doc.moveDown(0.3);
      continue;
    }

    // Encabezados H3
    if (line.startsWith('### ')) {
      ensureSpace(28);
      const title = cleanMarkdownFormatting(line.replace('### ', ''));
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#1E293B').text(title);
      doc.moveDown(0.2);
      continue;
    }

    // Encabezados H4
    if (line.startsWith('#### ')) {
      ensureSpace(22);
      const title = cleanMarkdownFormatting(line.replace('#### ', ''));
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#334155').text(title);
      doc.moveDown(0.2);
      continue;
    }

    // Citas / Blockquotes
    if (line.startsWith('> ')) {
      ensureSpace(25);
      const quote = cleanMarkdownFormatting(line.replace('> ', ''));
      const quoteY = doc.y;
      doc.rect(50, quoteY, contentWidth, 20).fill('#EFF6FF');
      doc.rect(50, quoteY, 4, 20).fill(COLOR_SECONDARY);
      doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(COLOR_TEXT).text(quote, 60, quoteY + 5, { width: contentWidth - 15 });
      doc.y = quoteY + 26;
      continue;
    }

    // Líneas Horizontales
    if (line.trim() === '---') {
      ensureSpace(15);
      const hrY = doc.y + 4;
      doc.strokeColor(COLOR_BORDER).lineWidth(0.5).moveTo(50, hrY).lineTo(pageWidth - 50, hrY).stroke();
      doc.y = hrY + 8;
      continue;
    }

    // Elementos de Lista
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^[0-9]+\.\s/.test(line.trim())) {
      ensureSpace(14);
      const listContent = cleanMarkdownFormatting(line.trim().replace(/^[-*]\s+|^[0-9]+\.\s+/, ''));
      const bulletChar = /^[0-9]+\.\s/.test(line.trim()) ? line.trim().match(/^[0-9]+\./)[0] : '•';

      doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR_SECONDARY).text(bulletChar, 60, doc.y, { continued: true });
      doc.font('Helvetica').fontSize(9).fillColor(COLOR_TEXT).text('  ' + listContent, { width: contentWidth - 25, lineGap: 1.5 });
      doc.moveDown(0.15);
      continue;
    }

    // Texto Párrafo Común
    if (line.trim().length > 0) {
      ensureSpace(14);
      const cleanPara = cleanMarkdownFormatting(line.trim());
      doc.font('Helvetica').fontSize(9).fillColor(COLOR_TEXT).text(cleanPara, 50, doc.y, {
        width: contentWidth,
        lineGap: 2.2,
        align: 'justify'
      });
      doc.moveDown(0.3);
    } else {
      doc.moveDown(0.2);
    }
  }

  if (inCodeBlock) flushCodeBlock();
  if (inTable) flushTable();

  // ==========================================
  // ENCABEZADOS Y PIES DE PÁGINA (NUMERACIÓN)
  // ==========================================
  const totalPages = doc.bufferedPageRange().count;

  for (let i = 1; i < totalPages; i++) {
    doc.switchToPage(i);

    // Encabezado de página
    doc.font('Helvetica').fontSize(7.5).fillColor(COLOR_MUTED);
    doc.text('IUTEPAL - Manual del Analista de Sistemas | Versión 2.0.0', 50, 25, { width: contentWidth });
    doc.strokeColor(COLOR_BORDER).lineWidth(0.5).moveTo(50, 36).lineTo(pageWidth - 50, 36).stroke();

    // Pie de página
    doc.strokeColor(COLOR_BORDER).lineWidth(0.5).moveTo(50, pageHeight - 35).lineTo(pageWidth - 50, pageHeight - 35).stroke();
    doc.font('Helvetica').fontSize(7.5).fillColor(COLOR_MUTED);
    doc.text('Documentación Técnica de Mantenimiento', 50, pageHeight - 25);
    doc.text(`Página ${i + 1} de ${totalPages}`, pageWidth - 150, pageHeight - 25, { width: 100, align: 'right' });
  }

  doc.end();

  await new Promise((resolve) => writeStream.on('finish', resolve));

  const stats = fs.statSync(pdfPath);
  console.log(`  -> PDF generado con éxito en: ${pdfPath}`);
  console.log(`  -> Total de páginas : ${totalPages}`);
  console.log(`  -> Tamaño de archivo: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log('='.repeat(60) + '\n');
}

if (require.main === module) {
  buildAnalistaPdf().catch(err => {
    console.error('[Error generando PDF]:', err);
    process.exit(1);
  });
}

module.exports = buildAnalistaPdf;
