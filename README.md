# Youth Mental Wellness Platform

A full-stack web application designed to support young people in reflecting on their emotions, connecting with a supportive community, exploring music moods, booking wellness sessions, and chatting with an AI companion.

## Features

- User registration and login using JWT authentication
- Mood check-ins with mood, intensity, activities, notes, and journal type
- Personal profile dashboard with:
  - Latest mood entry
  - Mood check-in count
  - Session booking count
  - Music mood count
- Anonymous community forum with categories, search, filtering, comments, and reactions
- Expert/wellness session booking with date and time-slot selection
- AI wellness companion chat powered by Google Gemini
- Music Mood feature:
  - Users enter a song title, artist, and optional reflection
  - Gemini provides a supportive mood insight and song suggestions
  - Songs open in YouTube Music search for playback
  - Music mood history is saved in MongoDB
- Responsive user interface built with React, Tailwind CSS, shadcn/ui, Framer Motion, and Lucide icons

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack React Query
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- Google Gemini API

## Project Structure

    Youth-Mental-Wellness/
    ├── README.md
    ├── .gitignore
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── pages/
    │   │   ├── components/
    │   │   ├── api/
    │   │   └── ...
    │   ├── .env
    │   └── package.json
    │
    └── backend/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── .env
        ├── server.js
        └── package.json

## Prerequisites

Install the following before running the project:

- Node.js version 18 or later
- npm
- MongoDB Atlas account or local MongoDB database
- Google AI Studio API key for Gemini

## Environment Variables

Create a `.env` file inside the `backend` folder:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key

Create a `.env` file inside the `frontend` folder:

    VITE_API_BASE_URL=http://localhost:5000/api

For production, replace the frontend API URL with the deployed backend URL:

    VITE_API_BASE_URL=https://your-render-service.onrender.com/api

## Installation and Running Locally

### 1. Clone the repository

    git clone https://github.com/your-username/Youth-Mental-Wellness.git
    cd Youth-Mental-Wellness

### 2. Run the backend

    cd backend
    npm install
    npm run dev

The backend runs at:

    http://localhost:5000

### 3. Run the frontend

Open another terminal:

    cd frontend
    npm install
    npm run dev

The frontend usually runs at:

    http://localhost:5173

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT token |

### Mood Check-ins

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/moods` | Create a mood entry |
| GET | `/api/moods` | Get logged-in user's mood entries |

### Community

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/community/posts` | Get community posts |
| POST | `/api/community/posts` | Create a community post |
| POST | `/api/community/posts/:id/react` | Add or update a reaction |
| GET | `/api/community/posts/:id/comments` | Get post comments |
| POST | `/api/community/posts/:id/comments` | Add a comment |

### Expert Sessions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/experts` | Get available experts |
| POST | `/api/experts/bookings` | Create a booking |
| GET | `/api/experts/bookings/my` | Get logged-in user's bookings |

### AI Companion Chat

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send a message to the AI companion |

### Music Mood

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/music/analyze` | Analyze a song and save a music mood |
| GET | `/api/music/history` | Get logged-in user's music mood history |

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

For production deployment:

1. Deploy the `backend` folder as a Render Web Service.
2. Add `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` in Render environment variables.
3. Deploy the `frontend` folder on Vercel.
4. Add `VITE_API_BASE_URL` in Vercel environment variables with the Render backend URL followed by `/api`.

Example:

    VITE_API_BASE_URL=https://your-render-service.onrender.com/api

## Disclaimer

This platform supports emotional reflection and general wellness. It is not a substitute for professional mental-health care or emergency services.

If you are in immediate danger or need urgent support, contact local emergency services, a trusted person, or a qualified mental-health professional.



