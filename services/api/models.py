from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from database import Base

class WebhookEvent(Base):
    __tablename__ = "webhook_events"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, index=True, nullable=False)
    route = Column(String, index=True, nullable=False)
    headers = Column(JSON, nullable=False)
    payload = Column(JSON, nullable=False)
    status = Column(String, default="pending", index=True)
    idempotency_key = Column(String, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
