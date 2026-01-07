from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

class FeedbackBase(BaseModel):
    rating: int
    review_text: str

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackResponse(FeedbackBase):
    id: int
    ai_response: Optional[str] = None
    ai_summary: Optional[str] = None
    recommended_actions: Optional[List[str]] = None
    sentiment: Optional[str] = None
    keywords: Optional[List[str]] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class FeedbackList(BaseModel):
    items: List[FeedbackResponse]
    total: int

