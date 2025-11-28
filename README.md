# Real-time Pair Programming Web Application

This is a prototype for a real-time collaborative coding platform. It allows two or more users to join a room and edit code simultaneously with basic synchronization and mocked AI autocomplete suggestions.

## Tech Stack

### Backend
- **Language**: Python
- **Framework**: FastAPI
- **Database**: PostgreSQL (for room metadata)
- **Real-time Communication**: WebSockets
- **ORM**: SQLAlchemy

### Frontend
- **Framework**: React + TypeScript (Vite)
- **State Management**: Redux Toolkit
- **Editor**: Monaco Editor (via `@monaco-editor/react`)
- **Styling**: Basic CSS

## Project Structure

```
/backend
  /app
    /routers      # API and WebSocket endpoints
    /services     # Business logic (Room management)
    models.py     # Database models
    schemas.py    # Pydantic schemas
    database.py   # Database connection
    main.py       # App entry point
  requirements.txt
/frontend
  /src
    /app          # Redux store
    /features     # Feature-based components (Room, Editor)
    App.tsx       # Main component
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Database:
   - Ensure PostgreSQL is running.
   - Create a database named `pair_programming_db` (or update `DATABASE_URL` in `.env` or `database.py`).
   - The application will automatically create the necessary tables on startup.

5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## Usage

1. Open the frontend URL in your browser.
2. Click "Create New Room" to generate a unique room ID and join.
3. Copy the URL (e.g., `http://localhost:5173/room/<uuid>`) and open it in another tab or share it with a peer.
4. Start typing in the editor. Changes will sync in real-time.
5. Stop typing for ~600ms to trigger the mocked AI autocomplete. A suggestion will appear at the bottom right.

## Architecture & Design Choices

- **WebSockets**: Used for low-latency, real-time communication between clients.
- **In-Memory State**: Active code content is stored in memory on the server for simplicity and speed. Room metadata is persisted in Postgres.
- **Last-Write-Wins**: A simple synchronization strategy is used. The server broadcasts the latest state to all other clients. This is sufficient for a prototype but can lead to race conditions in high-latency scenarios.
- **Redux Toolkit**: Manages the application state (room ID, code content) on the frontend, providing a predictable state container.

## Limitations & Future Improvements

- **Synchronization**: The current "broadcast full content" approach is not bandwidth-efficient for large files and doesn't handle concurrent edits gracefully (race conditions).
  - *Improvement*: Implement Operational Transformation (OT) or CRDTs (Conflict-free Replicated Data Types) for robust collaborative editing.
- **AI Autocomplete**: Currently uses static rules.
  - *Improvement*: Integrate with a real LLM API (e.g., OpenAI, Anthropic) for intelligent code suggestions.
- **Persistence**: Code is lost if the server restarts.
  - *Improvement*: Periodically save code state to the database or Redis.
- **Authentication**: No user authentication.
  - *Improvement*: Add user accounts and auth (e.g., JWT, OAuth).
