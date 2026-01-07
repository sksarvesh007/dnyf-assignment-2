import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Star, Bot, Lightbulb, MessageSquare } from "lucide-react";

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
}

interface FeedbackItem {
    id: number;
    rating: number;
    review_text: string;
    ai_summary?: string;
    recommended_actions?: string[];
    sentiment?: string;
    created_at: string;
}

export function FeedbackCard({ item }: { item: FeedbackItem }) {
    const sentimentClass = item.sentiment === 'positive' ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-500/50 shadow-[0_0_15px_-3px_rgba(34,197,94,0.15)]' :
        item.sentiment === 'negative' ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.15)]' :
            'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-500/50 shadow-[0_0_15px_-3px_rgba(234,179,8,0.15)]';

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        // Ensure UTC interpretation if timezone info is missing (common with some DB drivers)
        const isTimezoneAware = dateString.endsWith("Z") || dateString.includes("+");
        const date = isTimezoneAware ? new Date(dateString) : new Date(dateString + "Z");

        return date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    return (
        <Card className={`glass transition-all duration-300 ${sentimentClass}`}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-2">
                    <Badge className={item.rating >= 4 ? "bg-green-500/20 text-green-400" : item.rating >= 3 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}>
                        <div className="flex items-center gap-1">
                            {item.rating} <Star className="w-3 h-3 fill-current" />
                        </div>
                    </Badge>
                    <span className="text-sm text-muted-foreground">{formatDate(item.created_at)}</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <p className="text-sm font-medium leading-none mb-2 text-muted-foreground">Review</p>
                    <p className="text-lg leading-relaxed">{item.review_text}</p>
                </div>

                {item.ai_summary && (
                    <div className="bg-purple-500/10 p-4 rounded-lg space-y-2 border border-purple-500/20">
                        <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
                            <Bot className="w-4 h-4" /> AI Summary
                        </div>
                        <p className="text-base text-purple-200 italic leading-relaxed">{item.ai_summary}</p>
                    </div>
                )}

                {item.recommended_actions && item.recommended_actions.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Lightbulb className="w-4 h-4" /> Recommended Actions
                        </div>
                        <ul className="space-y-2">
                            {item.recommended_actions.map((action, idx) => (
                                <li key={idx} className="text-base bg-secondary/50 px-3 py-2 rounded flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span> {action}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
