# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "postgresql+psycopg2://hooktrace:hooktrace@localhost:5432/hooktrace"

# engine = create_engine(DATABASE_URL)

# SessionLocal = sessionmaker(bind=engine)

# Base = declarative_base()








from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv(
"DATABASE_URL",
"postgresql+psycopg2://hooktrace@db:5432/hooktrace"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
autocommit=False,
autoflush=False,
bind=engine
)

Base = declarative_base()