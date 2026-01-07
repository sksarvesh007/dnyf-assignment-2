"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { submitFeedback, checkHealth } from "@/lib/api";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, Server, Wifi, WifiOff } from "lucide-react";

type ServerStatus = "online" | "offline" | "checking" | "waking";

export default function UserDashboard() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");
  const [statusMessage, setStatusMessage] = useState("Checking server status...");

  const verifyServerHealth = useCallback(async (isWakeUp = false) => {
    if (isWakeUp) {
      setServerStatus("waking");
      setStatusMessage("Waking up the server, please wait...");
    } else {
      setServerStatus("checking");
    }

    const isAlive = await checkHealth();

    if (isAlive) {
      setServerStatus("online");
      setStatusMessage("Server is online and ready");
    } else {
      setServerStatus("offline");
      setStatusMessage("Server is asleep. Wake it up to submit feedback.");
    }
  }, []);

  useEffect(() => {
    verifyServerHealth();
  }, [verifyServerHealth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (serverStatus !== "online") {
      setError("Server is not online. Please wait or wake it up.");
      return;
    }
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

  const handleWakeUp = () => {
    verifyServerHealth(true);
    const interval = setInterval(async () => {
      const isAlive = await checkHealth();
      if (isAlive) {
        setServerStatus("online");
        setStatusMessage("Server is online and ready");
        clearInterval(interval);
      }
    }, 5000);

    setTimeout(() => clearInterval(interval), 60000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-zinc-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            DNYF's cafe
          </h1>
          <p className="text-muted-foreground">
            Share your dining experience with us.
          </p>
        </div>

        {/* Server Status Indicator */}
        <Card className={`border-white/5 bg-secondary/10 backdrop-blur-sm transition-all duration-500 overflow-hidden`}>
          <CardContent className="p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                {serverStatus === "online" && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${serverStatus === "online" ? "bg-green-500" :
                  serverStatus === "offline" ? "bg-red-500" :
                    "bg-yellow-500 animate-pulse"
                  }`}></span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  {serverStatus === "online" ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  Server Status
                </span>
                <span className="text-sm font-medium">{statusMessage}</span>
              </div>
            </div>
            {serverStatus === "offline" && (
              <Button size="sm" variant="outline" onClick={handleWakeUp} className="h-8 gap-1 border-primary/50 hover:bg-primary/10">
                <RefreshCw className="w-3 h-3" />
                Wake Up
              </Button>
            )}
            {serverStatus === "waking" && (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            )}
          </CardContent>
        </Card>

        <Card className={`glass border-white/10 transition-opacity duration-500 ${serverStatus !== "online" ? "opacity-50 pointer-events-none grayscale-[0.5]" : ""}`}>
          <CardHeader>
            <CardTitle className="text-xl">Submit Your Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Overall Rating</label>
                <div className="flex justify-center py-4 bg-secondary/30 rounded-lg">
                  <StarRating value={rating} onChange={setRating} disabled={isLoading || serverStatus !== "online"} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Detailed Review</label>
                <Textarea
                  placeholder="Tell us about the food, service, and atmosphere..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  disabled={isLoading || serverStatus !== "online"}
                  className="min-h-[100px] bg-background/50 resize-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading} disabled={serverStatus !== "online"}>
                {serverStatus === "online" ? "Submit Feedback" : "Wait for Server"}
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
              <Card className="glass border-green-500/20 bg-green-500/5 overflow-hidden">
                <div className="h-1 w-full bg-green-500/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-green-500"
                  />
                </div>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <CardTitle className="text-green-500 text-lg">Thank You!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic text-foreground/90 bg-secondary/20 p-3 rounded-lg border border-white/5">
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
