import uuid
import time

def create_os(client_name: str, job_ticket: str, details: str) -> str:
    """
    Simulates sending a payload to the Nucleus ERP to create an Order of Service.
    """
    print(f"[NUCLEUS] Autenticando na API corporativa...")
    time.sleep(0.5)
    
    print(f"[NUCLEUS] Enviando Payload de OS para Cliente: {client_name}, Ticket: {job_ticket}")
    time.sleep(1)
    
    os_id = f"OS-{str(uuid.uuid4())[:8].upper()}"
    print(f"[NUCLEUS] Sucesso! OS Criada: {os_id}")
    
    return os_id
