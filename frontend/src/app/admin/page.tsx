"use client";

import { useEffect, useState } from "react";
import { getFeedbackList, getAnalytics } from "@/lib/api";
import { LineChart } from "@/components/charts/LineChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { RefreshCw, TrendingUp, TrendingDown, Minus, Filter, MapPin, Search } from "lucide-react";

export default function AdminDashboard() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedReview, setSelectedReview] = useState<any>(null);

    const fetchData = async () => {
        try {
            const [feedbackData, analyticsData] = await Promise.all([
                getFeedbackList(),
                getAnalytics()
            ]);
            setFeedbacks(feedbackData);
            setAnalytics(analyticsData);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    // Filter feedbacks
    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesRating = filterRating ? f.rating === filterRating : true;
        const matchesSearch = searchQuery
            ? f.review_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.ai_summary && f.ai_summary.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;
        return matchesRating && matchesSearch;
    });

    // Transform analytics for charts
    const satisfactionData = analytics ? [
        { label: "Positive", value: analytics.sentiment_distribution.positive, color: "#22c55e" }, // green-500
        { label: "Neutral", value: analytics.sentiment_distribution.neutral, color: "#eab308" },  // yellow-500
        { label: "Negative", value: analytics.sentiment_distribution.negative, color: "#ef4444" }  // red-500
    ] : [];

    const trendData = analytics?.reviews_over_time?.map((d: any) => ({
        label: d.date,
        value: d.count
    })) || [];

    return (
        <div className="h-full flex flex-col p-6 gap-6 animate-in fade-in duration-500">
            {/* Header - Fixed Height */}
            <header className="flex-none flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground text-sm">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/50 border px-3 py-1.5 rounded-full backdrop-blur-md">
                    <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Updated {lastUpdated ? lastUpdated.toLocaleTimeString() : "..."}</span>
                </div>
            </header>

            {/* Metrics Row - Fixed Height */}
            <div className="flex-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Reviews"
                    value={analytics?.total_reviews || 0}
                    subValue="All time"
                    trend={analytics?.recent_trend.direction || "stable"}
                />
                <MetricCard
                    title="Average Rating"
                    value={analytics?.average_rating || 0.0}
                    subValue="Based on all time"
                    trend={analytics?.average_rating >= 4 ? "up" : analytics?.average_rating <= 3 ? "down" : "stable"}
                />
                <MetricCard
                    title="Positive Feedback"
                    value={`${analytics?.positive_percentage || 0}%`}
                    subValue="Sentiment Score"
                    trend="up"
                />
                <MetricCard
                    title="Needs Attention"
                    value={analytics?.negative_count || 0}
                    subValue="Negative Reviews"
                    trend={analytics?.negative_count > 0 ? "down" : "stable"}
                    inverseTrend
                />
            </div>

            {/* Main Content Grid - Flexible Height. 3 columns: Sentiment, Topics, Reviews */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1: Sentiment Analysis */}
                <div className="p-4 rounded-2xl border bg-card/40 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center">
                    <h3 className="font-medium text-xs text-muted-foreground mb-4 w-full text-left uppercase tracking-wider">Sentiment</h3>
                    <div className="relative flex-1 flex items-center justify-center w-full">
                        <div className="h-32 w-32">
                            <DonutChart data={satisfactionData} />
                        </div>
                    </div>
                    <div className="w-full mt-4 flex justify-between text-xs px-4">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Pos</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>Neu</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Neg</div>
                    </div>
                </div>

                {/* Column 2: Top Topics */}
                <div className="p-4 rounded-2xl border bg-card/40 backdrop-blur-sm shadow-sm flex flex-col overflow-hidden">
                    <div className="flex-none flex items-center justify-between mb-4">
                        <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Top Topics</h3>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-xs text-primary hover:underline"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto flex flex-wrap content-start gap-2 scrollbar-none">
                        {analytics?.top_keywords?.length > 0 ? (
                            analytics.top_keywords.map((kw: any, idx: number) => {
                                const isSelected = searchQuery === kw.keyword;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSearchQuery(isSelected ? "" : kw.keyword)}
                                        className={`
                                            px-3 py-1.5 rounded-full text-sm transition-all border
                                            ${isSelected
                                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                : "bg-secondary/30 border-transparent text-secondary-foreground hover:bg-secondary hover:text-foreground hover:border-border"
                                            }
                                        `}
                                    >
                                        {kw.keyword}
                                        <span className={`ml-2 text-xs opacity-60 ${isSelected ? "text-primary-foreground" : ""}`}>
                                            {kw.count}
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="text-sm text-muted-foreground">No topics extracted yet</div>
                        )}
                    </div>
                </div>

                {/* Column 3: Recent Reviews */}
                <div className="p-4 rounded-2xl border bg-card/40 backdrop-blur-sm shadow-sm flex flex-col overflow-hidden relative group">
                    {selectedReview ? (
                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                            <div className="flex-none flex items-center mb-4">
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="text-xs flex items-center text-muted-foreground hover:text-foreground transition-colors group/btn"
                                >
                                    <Minus className="w-3 h-3 mr-1 group-hover/btn:-translate-x-0.5 transition-transform" />
                                    Back to list
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-none pr-2">
                                <div className={`p-4 rounded-xl border mb-4 bg-card/50 ${selectedReview.sentiment === 'positive' ? 'bg-green-500/10 border-green-500/30' :
                                    selectedReview.sentiment === 'negative' ? 'bg-red-500/10 border-red-500/30' :
                                        'bg-yellow-500/10 border-yellow-500/30'
                                    }`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex text-yellow-500 text-sm">
                                            {Array.from({ length: selectedReview.rating }).map((_, i) => (
                                                <span key={i}>★</span>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{new Date(selectedReview.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground">{selectedReview.review_text}</p>

                                    {selectedReview.ai_summary && (
                                        <div className="mt-4 pt-4 border-t border-border/10">
                                            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">AI Summary</h4>
                                            <p className="text-xs text-muted-foreground italic">{selectedReview.ai_summary}</p>
                                        </div>
                                    )}

                                    {selectedReview.keywords && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {selectedReview.keywords.map((kw: string, i: number) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-background/50 border border-border/10">{kw}</span>
                                            ))}
                                        </div>
                                    )}

                                    {selectedReview.recommended_actions && selectedReview.recommended_actions.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground">Recommended Actions</h4>
                                            <ul className="space-y-1">
                                                {selectedReview.recommended_actions.map((action: string, idx: number) => (
                                                    <li key={idx} className="text-xs bg-secondary/50 px-2 py-1.5 rounded flex items-start gap-2">
                                                        <span className="text-primary">•</span> {action}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-none flex items-center justify-between mb-4">
                                <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Recent Feedback</h3>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={filterRating || ""}
                                        onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                                        className="bg-transparent text-xs border-none outline-none text-muted-foreground focus:text-foreground cursor-pointer"
                                    >
                                        <option value="">All</option>
                                        <option value="5">5★</option>
                                        <option value="4">4★</option>
                                        <option value="3">3★</option>
                                        <option value="2">2★</option>
                                        <option value="1">1★</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-1 scrollbar-none space-y-2">
                                {filteredFeedbacks.length > 0 ? filteredFeedbacks.slice(0, 10).map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedReview(item)}
                                        className={`
                                            p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]
                                            ${item.sentiment === 'positive' ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' :
                                                item.sentiment === 'negative' ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20' :
                                                    'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-1.5">
                                            <div className="flex text-yellow-500 text-[10px]">
                                                {Array.from({ length: item.rating }).map((_, i) => (
                                                    <span key={i}>★</span>
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="line-clamp-2 text-xs text-foreground/80">{item.review_text}</p>
                                    </div>
                                )) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground border border-dashed rounded-xl text-sm">
                                        No recent feedback
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Sub-component for metric cards
function MetricCard({ title, value, subValue, trend, inverseTrend }: any) {
    const isPositive = trend === "up";
    const isStable = trend === "stable";
    const isNegative = trend === "down";

    // Minimalistic color logic
    let trendColor = "text-muted-foreground";
    let trendIcon = null;

    if (isPositive) {
        trendColor = inverseTrend ? "text-red-500" : "text-green-500";
        trendIcon = inverseTrend ? <TrendingDown className="w-3 h-3 ml-1" /> : <TrendingUp className="w-3 h-3 ml-1" />;
    } else if (isNegative) {
        trendColor = inverseTrend ? "text-green-500" : "text-red-500";
        trendIcon = inverseTrend ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />;
    } else {
        trendIcon = <Minus className="w-3 h-3 ml-1" />;
    }

    return (
        <div className="p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            </div>
            <p className={`text-xs flex items-center mt-1 ${trendColor}`}>
                {subValue}
                {trendIcon}
            </p>
        </div>
    );
}
