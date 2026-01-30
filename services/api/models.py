from sqlalchemy import Column, Integer, String, JSON, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class WebhookEvent(Base):
    __tablename__ = "webhook_events"

    id = Column(Integer, primary_key=True, index=True)

    token = Column(String, index=True, nullable=False)
    route = Column(String, index=True, nullable=False)

    provider = Column(String, nullable=True)

    headers = Column(JSON, nullable=False)
    payload = Column(JSON, nullable=False)

    status = Column(String, default="pending", index=True)

    attempt_count = Column(Integer, default=0)
    next_retry_at = Column(DateTime(timezone=True), nullable=True)
    last_error = Column(Text, nullable=True)

    delivery_target = Column(String, nullable=True)

    idempotency_key = Column(String, nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WebhookRoute(Base):
    __tablename__ = "webhook_routes"

    id = Column(Integer, primary_key=True)
    token = Column(String, index=True, nullable=False)
    route = Column(String, index=True, nullable=False)

    secret = Column(String, nullable=True)

    mode = Column(String, default="prod")  # dev | prod
    dev_target = Column(String, nullable=True)
    prod_target = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
