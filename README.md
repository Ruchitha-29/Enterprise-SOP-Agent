🧠 OpsMind AI
Context-Aware Corporate Knowledge Brain
<p align="center">








</p> <p align="center"> AI-powered enterprise knowledge assistant that enables employees to query internal documents using natural language. </p>
✨ Overview

OpsMind AI is an AI-driven knowledge retrieval system that allows organizations to interact with internal documentation using natural language queries.

Instead of manually searching through PDFs, reports, and manuals, users can simply ask questions and receive accurate, context-aware responses generated using Retrieval-Augmented Generation (RAG).

The system combines vector search, document retrieval, and large language models to provide reliable answers grounded in company knowledge.

🚀 Key Features

• AI Knowledge Chat – Ask questions about internal company documents

• RAG Pipeline – Combines document retrieval with LLM reasoning

• Semantic Vector Search – Fast similarity search using MongoDB Atlas

• PDF Document Ingestion – Automatic text extraction and indexing

• Multi-Tenant Architecture – Secure company-level data isolation

• JWT Authentication – Secure login and role-based access

• Streaming Responses – Real-time AI responses using SSE

🏗 Architecture
User Query
   │
   ▼
Query Embedding Generation
   │
   ▼
Vector Similarity Search
(MongoDB Atlas Vector DB)
   │
   ▼
Relevant Document Chunks Retrieved
   │
   ▼
Context + Query → LLM
   │
   ▼
Generated AI Response
   │
   ▼
Streamed to Chat Interface
🛠 Tech Stack
Frontend

React (Vite)

Tailwind CSS

Axios

Backend

Node.js

Express.js

LangChain.js

AI / ML

Retrieval-Augmented Generation (RAG)

LLM APIs (Gemini / Llama 3)

Embedding Models

Database

MongoDB

MongoDB Atlas Vector Search

Authentication

JSON Web Tokens (JWT)

📂 Project Structure
OpsMind-AI
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── middleware
│   ├── models
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── services
│
├── uploads
└── README.md
⚙ Installation
1️⃣ Clone Repository

git clone https://github.com/yourusername/opsmind-ai.git

cd opsmind-ai

2️⃣ Backend Setup

cd backend

npm install

Create .env

PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret

GEMINI_API_KEY=your_api_key

GROQ_API_KEY=your_api_key

Run backend

npm run dev
3️⃣ Frontend Setup

cd frontend

npm install

npm run dev


🔄 RAG Workflow

Upload company documents (PDFs)

Extract text and split into smaller chunks

Generate vector embeddings for each chunk

Store embeddings in MongoDB Atlas Vector Database

Convert user query to embedding

Retrieve relevant document chunks via vector search

Provide retrieved context to LLM

LLM generates a context-aware response

📈 Future Improvements

Hybrid Search (Vector + Keyword)

Conversation Memory

Advanced Admin Dashboard

Multi-document summarization

Cloud deployment
