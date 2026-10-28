import os
import glob
import shutil
import sys
from process_document import process_document

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_dir = os.path.abspath(os.path.join(script_dir, ".."))
    uploads_dir = os.path.join(workspace_dir, "uploads")
    backup_dir = os.path.join(uploads_dir, "backup_original_pdfs")
    
    os.makedirs(backup_dir, exist_ok=True)
    
    pdf_files = [f for f in glob.glob(os.path.join(uploads_dir, "*.pdf")) if os.path.isfile(f)]
    total = len(pdf_files)
    print(f"Iniciando procesamiento de {total} documentos existentes en uploads/...")
    
    success_count = 0
    error_count = 0
    
    for idx, pdf_path in enumerate(pdf_files, 1):
        filename = os.path.basename(pdf_path)
        backup_path = os.path.join(backup_dir, filename)
        
        # 1. Guardar copia de seguridad si no existe
        if not os.path.exists(backup_path):
            shutil.copy2(pdf_path, backup_path)
            
        temp_out = os.path.join(uploads_dir, f"temp_proc_{idx}.pdf")
        
        try:
            # Procesar con marca de agua "IUTEPAL PUERTO CABELLO" y protección de permisos
            res = process_document(
                input_path=pdf_path,
                output_path=temp_out,
                watermark_text="IUTEPAL PUERTO CABELLO"
            )
            
            # Reemplazar archivo original con el archivo protegido y con marca de agua
            shutil.move(temp_out, pdf_path)
            pages = res.get("pages", 1)
            print(f"[{idx}/{total}] Protegido y con marca de agua ({pages} pags): {filename}")
            success_count += 1
        except Exception as e:
            if os.path.exists(temp_out):
                try: os.remove(temp_out)
                except Exception: pass
            print(f"[{idx}/{total}] Error en {filename}: {e}")
            error_count += 1
            
    print("\n" + "="*50)
    print(f"Resumen: {success_count} procesados con éxito, {error_count} errores de un total de {total}.")
    print(f"Copias de respaldo almacenadas en: uploads/backup_original_pdfs/")
    print("="*50)

if __name__ == "__main__":
    main()
