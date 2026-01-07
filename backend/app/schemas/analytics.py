from pydantic import BaseModel
from typing import List, Dict
from datetime import date

class KeywordStat(BaseModel):
    keyword: str
    count: int
    trend: str  # "up", "down", "stable"

class DailyStats(BaseModel):
    date: str
    count: int
    avg_rating: float

class RecentTrend(BaseModel):
    change: float
    direction: str

class AnalyticsResponse(BaseModel):
    total_reviews: int
    average_rating: float
    sentiment_distribution: Dict[str, int]
    rating_distribution: Dict[int, int]
    top_keywords: List[KeywordStat]
    recent_trend: RecentTrend
    reviews_over_time: List[DailyStats]
    positive_percentage: float
    negative_count: int
