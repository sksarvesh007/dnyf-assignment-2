from datetime import datetime, timezone
from sqlalchemy import Text, Integer, JSON, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    review_text: Mapped[str] = mapped_column(Text, nullable=False)
    
    ai_response: Mapped[str] = mapped_column(Text, nullable=True)
    ai_summary: Mapped[str] = mapped_column(Text, nullable=True)
    recommended_actions: Mapped[list[str]] = mapped_column(JSON, nullable=True) # Stored as JSON list
    sentiment: Mapped[str] = mapped_column(String(20), nullable=True)  # "positive", "negative", "neutral"
    keywords: Mapped[list[str]] = mapped_column(JSON, nullable=True)   # Extracted topic keywords
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

