from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.api.deps import get_db
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackList
from app.services.llm import llm_service

router = APIRouter()

@router.post("/", response_model=FeedbackResponse)
def create_feedback(
    *,
    db: Session = Depends(get_db),
    feedback_in: FeedbackCreate,
):
    ai_result = llm_service.analyze_feedback(feedback_in.rating, feedback_in.review_text)
    
    db_obj = Feedback(
        rating=feedback_in.rating,
        review_text=feedback_in.review_text,
        ai_response=ai_result.get("ai_response"),
        ai_summary=ai_result.get("ai_summary"),
        recommended_actions=ai_result.get("recommended_actions"),
        sentiment=ai_result.get("sentiment"),
        keywords=ai_result.get("keywords"),
    )
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    return db_obj

@router.get("/", response_model=List[FeedbackResponse])
def read_feedback(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    feedbacks = db.query(Feedback).order_by(Feedback.created_at.desc()).offset(skip).limit(limit).all()
    return feedbacks
