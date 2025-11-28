from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):

        self.active_connections: Dict[str, List[WebSocket]] = {}

        self.room_state: Dict[str, str] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
            self.room_state[room_id] = ""
        self.active_connections[room_id].append(websocket)
        print(f"Client connected to room {room_id}. Total clients: {len(self.active_connections[room_id])}")
        

        await websocket.send_text(self.room_state[room_id])

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
                print(f"Client disconnected from room {room_id}. Remaining clients: {len(self.active_connections[room_id])}")
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast(self, message: str, room_id: str, sender: WebSocket):

        if self.room_state.get(room_id) == message:
            return

        print(f"Broadcasting message to room {room_id}. Length: {len(message)}")

        self.room_state[room_id] = message
        
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                if connection != sender:
                    try:
                        await connection.send_text(message)
                    except RuntimeError:

                        self.disconnect(connection, room_id)

manager = ConnectionManager()
