"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { submitFeedback } from "@/lib/api";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function UserDashboard() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!review.trim()) {
      setError("Please write a review");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await submitFeedback(rating, review);
      setResponse(data);
      setRating(0);
      setReview("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-zinc-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            We Value Your Feedback
          </h1>
          <p className="text-muted-foreground">
            Help us improve your experience.
          </p>
        </div>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle>Submit Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex justify-center py-4 bg-secondary/30 rounded-lg">
                  <StarRating value={rating} onChange={setRating} disabled={isLoading} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Review</label>
                <Textarea
                  placeholder="Tell us about your experience..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  disabled={isLoading}
                  className="min-h-[120px] bg-background/50"
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass border-green-500/20 bg-green-500/5">
                <CardHeader className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <CardTitle className="text-green-500">Thank You!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg italic text-foreground/90">
                    "{response.ai_response}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
