from fastapi import WebSocket
from typing import List

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)




class ConnectionManager:

    def __init__(self):
        self.connections = {}

    async def connect(self, websocket, token):
        await websocket.accept()
        self.connections[token] = websocket

    def disconnect(self, token):
        self.connections.pop(token, None)

    async def send_to_token(self, token, data):
        ws = self.connections.get(token)

        if ws:
            await ws.send_json(data)