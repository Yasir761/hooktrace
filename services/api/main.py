from fastapi import FastAPI
from database import Base, engine
from health import router as health_router
from routes import router as relay_router
from replay import router as replay_router
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response



app = FastAPI(title="Hooktrace API")

Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(relay_router)
app.include_router(replay_router)


@app.get("/metrics")
def metrics():
    return Response(
        generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

