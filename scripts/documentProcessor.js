const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Procesa un documento (PDF o Word .docx/.doc):
 * - Si es Word (.docx / .doc), lo convierte a PDF nativo con máxima fidelidad.
 * - Aplica marca de agua institucional ("IUTEPAL PUERTO CABELLO") diagonal y cintillos.
 * - Aplica protección criptográfica de permisos (deshabilita copia/plagio y modificación,
 *   permitiendo lectura libre sin clave e impresión).
 * 
 * @param {string} inputPath - Ruta del archivo subido.
 * @param {string} outputPath - Ruta donde se guardará el PDF protegido.
 * @param {string} [ownerKey] - Contraseña maestra de seguridad para sellar permisos.
 * @param {string} [watermarkText] - Texto para la marca de agua institucional.
 * @returns {Promise<{success: boolean, outputPath: string, originalType: string, pages: number, protected: boolean, watermarked: boolean}>}
 */
function processDocument(inputPath, outputPath, ownerKey, watermarkText) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'process_document.py');
    const key = ownerKey || process.env.PDF_OWNER_KEY || 'IutepalSecurityRepo2026';
    const wmText = watermarkText || process.env.PDF_WATERMARK_TEXT || 'IUTEPAL PUERTO CABELLO';
    
    const pyProcess = spawn('python', [pythonScript, inputPath, outputPath, key, wmText], {
      windowsHide: true
    });

    let stdoutData = '';
    let stderrData = '';

    pyProcess.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    pyProcess.on('error', (err) => {
      reject(new Error(`Error al ejecutar el procesador de documentos (Python): ${err.message}`));
    });

    pyProcess.on('close', (code) => {
      if (code !== 0) {
        let errorMsg = stderrData.trim();
        try {
          const parsed = JSON.parse(stdoutData.trim());
          if (parsed && parsed.error) errorMsg = parsed.error;
        } catch (_) {}
        return reject(new Error(errorMsg || `El procesador de documentos finalizó con código de salida ${code}`));
      }

      try {
        const result = JSON.parse(stdoutData.trim());
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error || 'Error desconocido al procesar documento'));
        }
      } catch (e) {
        reject(new Error(`Respuesta no procesable del procesador de documentos: ${stdoutData}`));
      }
    });
  });
}

module.exports = { processDocument };
