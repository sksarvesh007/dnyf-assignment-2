from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import Counter
from datetime import datetime, timedelta

from app.api.deps import get_db
from app.models.feedback import Feedback
from app.schemas.analytics import AnalyticsResponse, KeywordStat, DailyStats

router = APIRouter()

@router.get("/", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    feedbacks = db.query(Feedback).all()
    
    #fallback
    if not feedbacks:
        return AnalyticsResponse(
            total_reviews=0,
            average_rating=0.0,
            sentiment_distribution={"positive": 0, "negative": 0, "neutral": 0},
            rating_distribution={1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
            top_keywords=[],
            recent_trend={"change": 0.0, "direction": "stable"},
            reviews_over_time=[],
            positive_percentage=0.0,
            negative_count=0
        )
    
    total_reviews = len(feedbacks)
    
    average_rating = sum(f.rating for f in feedbacks) / total_reviews
    
    sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
    for f in feedbacks:
        sentiment = f.sentiment or ("positive" if f.rating >= 4 else "negative" if f.rating <= 2 else "neutral")
        sentiment_counts[sentiment] = sentiment_counts.get(sentiment, 0) + 1
    
    rating_counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for f in feedbacks:
        rating_counts[f.rating] = rating_counts.get(f.rating, 0) + 1
    
    all_keywords = []
    for f in feedbacks:
        if f.keywords:
            all_keywords.extend(f.keywords)
    keyword_counter = Counter(all_keywords)
    top_keywords = [
        KeywordStat(keyword=kw, count=count, trend="stable")
        for kw, count in keyword_counter.most_common(10)
    ]
    
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)
    
    recent_feedbacks = [f for f in feedbacks if f.created_at and f.created_at >= week_ago]
    previous_feedbacks = [f for f in feedbacks if f.created_at and two_weeks_ago <= f.created_at < week_ago]
    
    recent_avg = sum(f.rating for f in recent_feedbacks) / len(recent_feedbacks) if recent_feedbacks else 0
    previous_avg = sum(f.rating for f in previous_feedbacks) / len(previous_feedbacks) if previous_feedbacks else 0
    
    change = recent_avg - previous_avg
    direction = "up" if change > 0.1 else "down" if change < -0.1 else "stable"
    
    reviews_over_time = []
    for i in range(13, -1, -1):
        day = now - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        
        day_feedbacks = [f for f in feedbacks if f.created_at and day_start <= f.created_at < day_end]
        count = len(day_feedbacks)
        avg = sum(f.rating for f in day_feedbacks) / count if count > 0 else 0
        
        reviews_over_time.append(DailyStats(
            date=day_start.strftime("%b %d"),
            count=count,
            avg_rating=round(avg, 1)
        ))
    
    positive_count = sentiment_counts.get("positive", 0)
    negative_count = sentiment_counts.get("negative", 0)
    positive_percentage = (positive_count / total_reviews * 100) if total_reviews > 0 else 0
    
    return AnalyticsResponse(
        total_reviews=total_reviews,
        average_rating=round(average_rating, 2),
        sentiment_distribution=sentiment_counts,
        rating_distribution=rating_counts,
        top_keywords=top_keywords,
        recent_trend={"change": round(change, 2), "direction": direction},
        reviews_over_time=reviews_over_time,
        positive_percentage=round(positive_percentage, 1),
        negative_count=negative_count
    )
