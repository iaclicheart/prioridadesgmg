import shutil
import os
import time

def send_to_gmg_hotfolder(local_pdf_path: str, os_id: str) -> str:
    """
    Simulates writing the PDF block to an internal SMB network share (Hot Folder)
    that is actively monitored by GMG ColorServer.
    """
    dest_folder = "tmp/gmg_in"
    
    # Rename file with OS prefix for tracking in Hot Folder
    filename = os.path.basename(local_pdf_path)
    new_filename = f"{os_id}_{filename}"
    dest_path = os.path.join(dest_folder, new_filename)
    
    print(f"[GMG] Copiando {local_pdf_path} para Hot Folder na rede interna: {dest_path}")
    time.sleep(0.8) # Simulating network transfer time
    
    shutil.copy2(local_pdf_path, dest_path)
    print(f"[GMG] Arquivo dropado com sucesso. GMG iniciará o processamento via Hot Folder.")
    
    return "Dropped into GMG Hot Folder"
