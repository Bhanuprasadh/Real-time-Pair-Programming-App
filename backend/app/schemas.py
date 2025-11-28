from pydantic import BaseModel
from typing import Optional

class RoomCreate(BaseModel):
    pass # No specific fields needed to create a room, just generates an ID

class RoomResponse(BaseModel):
    room_id: str

class AutocompleteRequest(BaseModel):
    code: str
    cursorPosition: int
    language: str

class AutocompleteResponse(BaseModel):
    suggestion: str
