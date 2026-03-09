# Meeting Intelligence Hub

AI-powered platform for extracting insights from meeting transcripts.

Meeting Intelligence Hub helps teams transform long, messy meeting transcripts into **structured knowledge, actionable insights, and searchable conversations**.

Instead of manually reviewing large transcripts, the system automatically analyzes meeting discussions using AI.

---

# Demo

Watch the full project demonstration:

[https://drive.google.com/file/d/1FeF69flr2EKSyl52WCU4fv6dBzNg3W-n/view?usp=drive_link]

---

# Problem

Modern teams generate large amounts of meeting transcripts through recordings and note-taking tools.

Manually analyzing transcripts leads to several problems:

* Time-consuming review process
* Important decisions buried in long discussions
* Difficulty tracking action items
* Lack of searchable insights across meetings

Teams often lose critical information after meetings.

---

# Solution

Meeting Intelligence Hub solves this problem by automatically analyzing meeting transcripts and extracting useful insights.

Users can:

* Upload transcript files
* Automatically analyze discussions
* Identify key decisions and action items
* Perform sentiment analysis
* Ask questions through an AI chatbot

This allows teams to **quickly understand what happened in a meeting without reading the entire transcript**.

---

# Features

## Transcript Upload

Upload `.txt` or `.vtt` transcript files for analysis.

## AI Insight Extraction

Automatically extract:

* Decisions
* Action items
* Key discussion points

## Sentiment Analysis

Analyze emotional tone within meeting conversations.

## Chatbot Interface

Interact with transcripts using natural language queries.

Example queries:

* "What decisions were made in this meeting?"
* "What tasks were assigned to John?"
* "Why was the API launch delayed?"

## Meeting Dashboard

View and manage all meeting transcripts in one place.

---

# System Architecture

```
Frontend (React)
        |
        |
        v
Backend API (Django)
        |
        |
        v
AI Processing Layer (Groq API)
        |
        |
        v
Database (SQLite / PostgreSQL)
```

---

# Tech Stack

## Frontend

* React
* Tailwind CSS

## Backend

* Django
* Django REST Framework

## Programming Languages

* Python
* JavaScript

## Database

* SQLite (Development)
* PostgreSQL (Production)

## AI Integration

* Groq AI API

---

# Project Structure

```
meeting-intelligence/
│
├── frontend (React)
│   ├── components
│   ├── pages
│   └── services
│
├── backend (Django)
│   ├── meeting_hub
│   ├── transcripts
│   └── api
│
└── README.md
```

---

# Installation Guide

## 1 Clone the Repositories

### Backend

```bash
https://github.com/MINNAL-max/meeting-ai-hub.git
```

### Frontend

```bash
https://github.com/MINNAL-max/MEETING-AI-SERVER.git
```

---

# Backend Setup

### Navigate to backend

```bash
cd meeting-intelligence-server
```

### Create virtual environment

```bash
python -m venv venv
```

### Activate environment

Windows:

```bash
venv\Scripts\activate
```

Linux / Mac:

```bash
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file in the root directory.

```
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432

GROQ_API_KEY=
```

For development you can use SQLite.

---

# Run Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

# Start Backend Server

```bash
python manage.py runserver
```

Server runs at:

```
http://127.0.0.1:8000
```

---

# Frontend Setup

Navigate to frontend folder.

```bash
cd meeting-intelligence
```

Install dependencies.

```bash
npm install
```

Start development server.

```bash
npm run dev
```

---

# Running the Application

After both servers are running:

```
Frontend
http://localhost:5173
```

```
Backend
http://127.0.0.1:8000
```

---

# Example Workflow

1. Upload a meeting transcript
2. System processes the transcript
3. AI extracts insights
4. Dashboard displays decisions and action items
5. Users can ask questions via chatbot

---

# Future Improvements

* Real-time transcript processing
* Advanced AI summarization
* Meeting timeline visualization
* Speaker analytics
* Integration with Zoom / Google Meet
* Vector database for semantic search

---

# License

This project is intended for educational and demonstration purposes.
