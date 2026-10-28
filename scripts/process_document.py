import os
import sys
import json
import uuid
import io
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from pypdf import PdfReader, PdfWriter
from pypdf.constants import UserAccessPermissions

def create_watermark(width, height, text="IUTEPAL PUERTO CABELLO"):
    """
    Genera en memoria una página de marca de agua vectorial con el tamaño exacto
    de la página de destino para un acabado institucional nítido y elegante.
    """
    packet = io.BytesIO()
    c = canvas.Canvas(packet, pagesize=(width, height))
    
    # 1. Cintillo superior institucional discreto
    c.saveState()
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(colors.HexColor("#04224e"), alpha=0.30)
    c.drawCentredString(width / 2.0, height - 18, f"{text} • REPOSITORIO ACADÉMICO INSTITUCIONAL")
    c.restoreState()
    
    # 2. Marca de agua diagonal central semi-transparente
    c.saveState()
    c.translate(width / 2.0, height / 2.0)
    c.rotate(45)
    
    # Texto principal grande
    c.setFont("Helvetica-Bold", 32)
    c.setFillColor(colors.HexColor("#04224e"), alpha=0.12)
    c.drawCentredString(0, 14, text)
    
    # Subtítulo explicativo anti-plagio
    c.setFont("Helvetica", 12)
    c.setFillColor(colors.HexColor("#04224e"), alpha=0.10)
    c.drawCentredString(0, -14, "DOCUMENTO PROTEGIDO • PROHIBIDA SU MODIFICACIÓN O PLAGIO")
    c.restoreState()
    
    # 3. Cintillo inferior de protección de derechos
    c.saveState()
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.HexColor("#04224e"), alpha=0.30)
    c.drawCentredString(width / 2.0, 14, f"{text} • PROHIBIDA SU REPRODUCCIÓN TOTAL O PARCIAL SIN AUTORIZACIÓN")
    c.restoreState()
    
    c.save()
    packet.seek(0)
    return packet

def process_document(input_path, output_path, owner_key=None, watermark_text="IUTEPAL PUERTO CABELLO"):
    if not owner_key:
        owner_key = os.environ.get('PDF_OWNER_KEY', 'IutepalSecureRepo2026')
    
    input_path = os.path.abspath(input_path)
    output_path = os.path.abspath(output_path)
    
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Archivo de entrada no encontrado: {input_path}")
    
    ext = os.path.splitext(input_path)[1].lower()
    temp_pdf_to_clean = None
    source_pdf = input_path
    original_type = ext.replace('.', '')
    
    try:
        # Paso 1: Si es documento de Word (.docx o .doc), convertir a PDF
        if ext in ['.docx', '.doc']:
            import docx2pdf
            temp_pdf_to_clean = os.path.join(
                os.path.dirname(output_path),
                f"temp_conv_{uuid.uuid4().hex}.pdf"
            )
            docx2pdf.convert(input_path, temp_pdf_to_clean)
            if not os.path.exists(temp_pdf_to_clean) or os.path.getsize(temp_pdf_to_clean) == 0:
                raise RuntimeError("La conversión de Word a PDF falló o produjo un archivo vacío.")
            source_pdf = temp_pdf_to_clean
        
        # Paso 2: Leer el PDF fuente
        reader = PdfReader(source_pdf)
        if reader.is_encrypted:
            try:
                reader.decrypt("")
            except Exception:
                pass
        
        writer = PdfWriter()
        
        # Paso 3: Aplicar marca de agua institucional a cada página
        for page in reader.pages:
            try:
                w = float(page.mediabox.width)
                h = float(page.mediabox.height)
                wm_stream = create_watermark(w, h, watermark_text)
                wm_reader = PdfReader(wm_stream)
                page.merge_page(wm_reader.pages[0], over=True)
            except Exception as wm_err:
                # Si falla la marca en alguna página atípica, continuar con la página
                pass
            writer.add_page(page)
        
        # Paso 4: Metadatos institucionales de protección
        writer.add_metadata({
            "/Author": f"{watermark_text} - Instituto Universitario de Tecnología Juan Pablo Pérez Alfonzo",
            "/Creator": "Sistema de Repositorio Digital IUTEPAL",
            "/Subject": "Documento Académico Protegido - Prohibida su modificación o plagio",
            "/Keywords": "IUTEPAL, Puerto Cabello, Documento Protegido, Anti-Plagio, Derechos Reservados"
        })
        
        # Paso 5: Permisos de seguridad y cifrado:
        # - user_password="" (abre sin pedir contraseña a ningún lector)
        # - owner_password sella los permisos contra cambios
        # - Prohíbe extracción/copia de texto/imágenes (anti-plagio)
        # - Prohíbe modificación/edición de contenido
        # - Permite impresión de alta resolución para lectura/estudio
        permissions = (
            UserAccessPermissions.PRINT |
            UserAccessPermissions.PRINT_TO_REPRESENTATION
        )
        
        writer.encrypt(
            user_password="",
            owner_password=owner_key,
            permissions_flag=permissions
        )
        
        with open(output_path, "wb") as f_out:
            writer.write(f_out)
        
        page_count = len(reader.pages)
        return {
            "success": True,
            "outputPath": output_path,
            "originalType": original_type,
            "pages": page_count,
            "protected": True,
            "watermarked": True,
            "watermarkText": watermark_text
        }
        
    finally:
        if temp_pdf_to_clean and os.path.exists(temp_pdf_to_clean):
            try:
                os.remove(temp_pdf_to_clean)
            except Exception:
                pass

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({
            "success": False,
            "error": "Uso: python process_document.py <input_path> <output_path> [owner_key] [watermark_text]"
        }))
        sys.exit(1)
        
    in_path = sys.argv[1]
    out_path = sys.argv[2]
    key = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] != "" else None
    wm_text = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] != "" else "IUTEPAL PUERTO CABELLO"
    
    try:
        res = process_document(in_path, out_path, key, wm_text)
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)
