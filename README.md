# Two-Dashboard AI Feedback System

A full-stack application for collecting customer feedback with AI-powered analysis. Features a **User Dashboard** for submitting reviews and an **Admin Dashboard** for viewing analytics and insights.

## Features

### User Dashboard
- **Star Rating** - 1-5 star rating system
- **Review Submission** - Text-based feedback form
- **AI Response** - Instant personalized acknowledgment powered by LLM

### Admin Dashboard
- **Real-time Analytics** - Auto-refreshing metrics (10s polling)
- **Sentiment Analysis** - Positive/Neutral/Negative distribution
- **Rating Distribution** - Breakdown by star rating
- **Top Keywords** - AI-extracted topic trends
- **Review Timeline** - Historical feedback trends
- **Detailed Review View** - AI summaries, keywords, and recommended actions

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TailwindCSS 4, Framer Motion |
| **Backend** | FastAPI, SQLAlchemy, Pydantic |
| **Database** | PostgreSQL 16 |
| **AI/LLM** | Groq API (Llama 3.1 8B) |
| **Containerization** | Docker, Docker Compose |

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/   # feedback, analytics routes
│   │   ├── core/               # config settings
│   │   ├── db/                 # database session
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   └── services/           # LLM service
│   ├── alembic/                # database migrations
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js pages (user + admin)
│   │   ├── components/         # UI components, charts
│   │   └── lib/                # API client
│   └── Dockerfile
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Groq API Key (for AI features)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dnyf-assignment-2
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - **User Dashboard**: http://localhost:3000
   - **Admin Dashboard**: http://localhost:3000/admin
   - **API Docs**: http://localhost:8000/backend/docs

### Local Development

#### Backend
```bash
cd backend
pip install -r requirements.txt  # or use uv/poetry
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
bun install
bun dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/backend/api/v1/feedback/` | Submit new feedback |
| `GET` | `/backend/api/v1/feedback/` | List all feedback |
| `DELETE` | `/backend/api/v1/feedback/{id}` | Delete feedback |
| `GET` | `/backend/api/v1/analytics/` | Get analytics data |
| `GET` | `/backend/health` | Health check |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@db:5432/feedback_db` |
| `GROQ_API_KEY` | Groq API key for LLM | Required |
| `BACKEND_CORS_ORIGINS` | Allowed CORS origins | `["http://localhost:3000"]` |
| `NEXT_PUBLIC_API_URL` | Frontend API URL (client-side) | `http://localhost:8000/backend/api/v1` |
| `API_URL` | Frontend API URL (server-side) | `http://backend:8000/api/v1` |

## AI Analysis Features

When feedback is submitted, the LLM analyzes it and provides:
- **AI Response** - Personalized acknowledgment to the user
- **Summary** - Concise 1-sentence summary
- **Sentiment** - Classification (positive/neutral/negative)
- **Keywords** - Extracted topic tags
- **Recommended Actions** - Actionable suggestions for the team
