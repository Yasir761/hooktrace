from fastapi import FastAPI
from database import Base, engine
from health import router as health_router
from routes import router as relay_router
from replay import router as replay_router


app = FastAPI(title="Hooktrace API")

Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(relay_router)
app.include_router(replay_router)

