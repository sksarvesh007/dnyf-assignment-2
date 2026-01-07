from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

sqlalchemy_database_uri = settings.DATABASE_URL
if sqlalchemy_database_uri and sqlalchemy_database_uri.startswith("postgres://"):
    sqlalchemy_database_uri = sqlalchemy_database_uri.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    sqlalchemy_database_uri,
    connect_args={"check_same_thread": False} if "sqlite" in sqlalchemy_database_uri else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
