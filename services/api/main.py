from fastapi import FastAPI
from database import Base, engine
from health import router as health_router
from routes import router as relay_router
from replay import router as replay_router
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response
from events import router as events_router

from fastapi import WebSocket, WebSocketDisconnect
from ws import ConnectionManager
from subscriber import start_redis_subscriber

import asyncio

from threading import Thread
from subscriber import start_redis_subscriber


app = FastAPI(title="Hooktrace API")

from routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Hooktrace API")
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(relay_router)
app.include_router(replay_router)
app.include_router(events_router)



manager = ConnectionManager()


@app.on_event("startup")
def init_db():
    Base.metadata.create_all(bind=engine)

@app.on_event("startup")
def start_subscriber():
    Thread(
        target=start_redis_subscriber,
        args=(manager,),
        daemon=True
    ).start()




@app.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)



@app.get("/metrics")
def metrics():
    return Response(
        generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

