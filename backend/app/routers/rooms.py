from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database
import uuid

router = APIRouter()

@router.post("/rooms", response_model=schemas.RoomResponse)
def create_room(db: Session = Depends(database.get_db)):
    room_id = str(uuid.uuid4())
    db_room = models.Room(room_id=room_id)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return {"room_id": room_id}

@router.post("/autocomplete", response_model=schemas.AutocompleteResponse)
def autocomplete(request: schemas.AutocompleteRequest):
    # Mocked static/rule-based AI suggestion
    suggestion = ""
    code = request.code
    
    if "def " in code and ":" not in code:
        suggestion = ":\n    pass"
    elif "print" in code and "(" not in code:
        suggestion = "('Hello World')"
    elif "for " in code and ":" not in code:
        suggestion = " i in range(10):"
    else:
        suggestion = " # AI Suggestion"
        
    return {"suggestion": suggestion}
