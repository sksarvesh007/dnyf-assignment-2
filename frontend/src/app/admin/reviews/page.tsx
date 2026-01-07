"use client";

import { useEffect, useState } from "react";
import { getFeedbackList, deleteFeedback } from "@/lib/api";
import { FeedbackCard } from "@/components/FeedbackCard";
import { Search, Filter, RefreshCw } from "lucide-react";

export default function AllReviewsPage() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRating, setFilterRating] = useState<number | null>(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const data = await getFeedbackList();
                setFeedbacks(data);
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteFeedback(id);
            setFeedbacks(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error("Failed to delete review", error);
            alert("Failed to delete review. Please try again.");
        }
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesRating = filterRating ? f.rating === filterRating : true;
        const matchesSearch = searchQuery
            ? f.review_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.ai_summary && f.ai_summary.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;
        return matchesRating && matchesSearch;
    });

    return (
        <div className="h-full flex flex-col p-6 gap-6 animate-in fade-in duration-500">
            <header className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">All Reviews</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage and view all customer feedback in one place.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/50 border px-3 py-1.5 rounded-full">
                    <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                    <span>{feedbacks.length} Total</span>
                </div>
            </header>

            {/* Filters */}
            <div className="flex-none flex flex-col md:flex-row items-center justify-between gap-4 bg-card/40 backdrop-blur-sm p-4 rounded-xl border shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 text-sm bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                        <select
                            value={filterRating || ""}
                            onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                            className="bg-background/50 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-48 cursor-pointer"
                        >
                            <option value="">All Ratings</option>
                            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                            <option value="3">⭐⭐⭐ (3 Stars)</option>
                            <option value="2">⭐⭐ (2 Stars)</option>
                            <option value="1">⭐ (1 Star)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reviews Grid - Scrollable Area */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-2 scrollbar-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                    {filteredFeedbacks.length > 0 ? (
                        filteredFeedbacks.map((item) => (
                            <FeedbackCard key={item.id} item={item} onDelete={handleDelete} />
                        ))
                    ) : (
                        !isLoading && (
                            <div className="col-span-full text-center py-20 text-muted-foreground bg-card/50 rounded-xl border border-dashed text-sm">
                                <p>No reviews matching your filters.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
