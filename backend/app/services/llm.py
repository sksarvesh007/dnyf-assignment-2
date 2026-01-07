import json
from openai import OpenAI
from app.core.config import settings

class LLMService:
    def __init__(self):        
        if settings.GROQ_API_KEY:
            self.client = OpenAI(
                api_key=settings.GROQ_API_KEY,
                base_url="https://api.groq.com/openai/v1"
            )
            self.model = "llama-3.1-8b-instant"

    def analyze_feedback(self, rating: int, review_text: str):
        if not self.client:
            sentiment = "positive" if rating >= 4 else "negative" if rating <= 2 else "neutral"
            return {
                "ai_response": "Thank you for your feedback!",
                "ai_summary": "No AI summary available.",
                "recommended_actions": ["Check API Keys"],
                "sentiment": sentiment,
                "keywords": []
            }

        prompt = f"""
        You are a customer service AI manager. Analyze the following customer feedback.
        
        Rating: {rating}/5
        Review: "{review_text}"
        
        Provide a JSON response with the following keys:
        - "ai_response": A polite, empathetic response to the user (1-2 sentences).
        - "ai_summary": A concise 1-sentence summary of the review.
        - "recommended_actions": A list of 1-3 concrete action strings the team should take.
        - "sentiment": Classify the overall sentiment as exactly one of: "positive", "negative", or "neutral".
        - "keywords": Extract 3-5 relevant topic keywords from the review (e.g., "pricing", "customer support", "product quality", "delivery", "user experience").
        
        Ensure the response is valid JSON. Do not include markdown formatting like ```json.
        """

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that outputs strict JSON."},
                    {"role": "user", "content": prompt}
                ],
                model=self.model,
                response_format={"type": "json_object"},
            )
            
            content = chat_completion.choices[0].message.content
            result = json.loads(content)
            
            actions = result.get("recommended_actions", [])
            if actions and isinstance(actions[0], dict):
                actions = [a.get("action", str(a)) for a in actions]
            result["recommended_actions"] = actions
            
            valid_sentiments = ["positive", "negative", "neutral"]
            if result.get("sentiment") not in valid_sentiments:
                result["sentiment"] = "positive" if rating >= 4 else "negative" if rating <= 2 else "neutral"
            
            if not isinstance(result.get("keywords"), list):
                result["keywords"] = []
            
            return result
        except Exception as e:
            print(f"LLM Error: {e}")
            sentiment = "positive" if rating >= 4 else "negative" if rating <= 2 else "neutral"
            return {
                "ai_response": "Thank you for your feedback! We're processing it.",
                "ai_summary": "Error generating summary.",
                "recommended_actions": ["Investigate LLM Service Error"],
                "sentiment": sentiment,
                "keywords": []
            }

llm_service = LLMService()

