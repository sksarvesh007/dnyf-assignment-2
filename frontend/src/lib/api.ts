// Use NEXT_PUBLIC_API_URL for production, fallback to direct backend for local dev
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/backend/api/v1';

export async function submitFeedback(rating: number, review_text: string) {
    const res = await fetch(`${API_BASE}/feedback/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, review_text }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to submit feedback');
    }
    return res.json();
}

export async function getFeedbackList() {
    const res = await fetch(`${API_BASE}/feedback/`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch feedback');
    }
    return res.json();
}

export async function deleteFeedback(id: number) {
    const res = await fetch(`${API_BASE}/feedback/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error('Failed to delete feedback');
    }
    return res.json();
}

export async function getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch analytics');
    }
    return res.json();
}
