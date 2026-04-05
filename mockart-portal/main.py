import os
import shutil
from fastapi import FastAPI, Request, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse

# Mocks
from services.nucleus_mock import create_os
from services.gmg_mock import send_to_gmg_hotfolder
from services.esko_mock import launch_esko_workflow

app = FastAPI(title="Mockart Orchestrator Portal")

# Static and Templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Make sure hotfolder exists for testing
os.makedirs("tmp/gmg_in", exist_ok=True)

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/portal")
async def show_portal(request: Request):
    return templates.TemplateResponse("portal.html", {"request": request})

@app.post("/api/create_os")
async def api_create_os(
    client_name: str = Form(...),
    job_ticket: str = Form(...),
    details: str = Form(""),
    file: UploadFile = File(...)
):
    """
    Endpoint that handles the multipart form submittal from the portal.
    Orchestrates the Nucleus -> GMG flow.
    """
    try:
        # 1. Save uploaded file temporarily
        temp_path = f"tmp/{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 2. Nucleus API (Mock): Create OS
        os_id = create_os(client_name, job_ticket, details)
        
        # 3. GMG ColorServer (Mock): Send to Hot Folder
        # Emulating the Daisy Chain (Portal -> GMG -> Esko)
        gmg_status = send_to_gmg_hotfolder(temp_path, os_id)
        
        # Esko would typically be triggered by GMG's output hotfolder. 
        # But for architectural completeness, we mock what would happen 
        # if our backend orchestrated the Esko API directly after GMG finishes:
        esko_status = launch_esko_workflow(os_id, temp_path)
        
        return JSONResponse({
            "status": "success",
            "message": "Fluxo orquestrado com sucesso!",
            "data": {
                "os_id": os_id,
                "gmg_sync": gmg_status,
                "esko_trigger": esko_status
            }
        })
        
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=500)
