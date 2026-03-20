OpsMind AI – Context-Aware Corporate Knowledge Brain

OpsMind AI is an AI-powered corporate knowledge assistant that enables employees to interact with company documents using natural language queries.
The system uses a Retrieval-Augmented Generation (RAG) pipeline to retrieve relevant information from internal documents and generate accurate, context-aware responses using Large Language Models (LLMs).

Instead of manually searching through PDFs, manuals, or reports, users can simply ask questions and receive AI-generated answers grounded in company knowledge.


Key Features
AI-Powered Document Q&A

Users can ask questions in natural language and receive answers generated from company documents.

Retrieval-Augmented Generation (RAG)

Combines document retrieval + LLM reasoning to produce reliable responses grounded in actual company knowledge.

PDF Document Ingestion

Users can upload PDFs which are automatically processed and indexed for semantic search.

Vector Embedding Storage

Documents are converted into vector embeddings and stored in MongoDB Atlas Vector Search.

Multi-Tenant Architecture

Each company’s data is isolated to ensure secure knowledge access across organizations.

Authentication & Role-Based Access

Secure login system using JWT authentication.

Real-Time Streaming Responses

Chat responses are streamed using Server-Sent Events (SSE) for a smooth AI chat experience.

System Architecture

The system follows a Retrieval-Augmented Generation (RAG) architecture.

User Query
↓
Embedding Generation
↓
Vector Similarity Search (MongoDB Atlas)
↓
Retrieve Relevant Document Chunks
↓
Combine Query + Context
↓
LLM Generates Response
↓
Response streamed to UI

Tech Stack
Frontend

React (Vite)

Tailwind CSS

Axios

Backend

Node.js

Express.js

LangChain.js

AI / Machine Learning

Retrieval-Augmented Generation (RAG)

LLM APIs (Gemini / Llama 3 via Groq)

Embedding Models

Database

MongoDB

MongoDB Atlas Vector Search

Authentication

JSON Web Tokens (JWT)

Other Tools

Server-Sent Events (SSE)

PDF processing libraries

Project Structure
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
│   │   ├── services
│   │   └── App.jsx
│
├── uploads
├── README.md
└── package.json
How the RAG Pipeline Works
Step 1 – Document Upload

Users upload PDFs containing company knowledge.

Step 2 – Text Extraction

The system extracts text from the uploaded document.

Step 3 – Chunking

Large documents are split into smaller text chunks.

Step 4 – Embedding Generation

Each chunk is converted into a vector embedding using an embedding model.

Step 5 – Vector Storage

Embeddings are stored in MongoDB Atlas Vector Database.

Step 6 – Query Processing

When a user asks a question:

Query is converted to an embedding

Vector similarity search retrieves relevant chunks

Step 7 – LLM Generation

Retrieved context + user query is sent to the LLM to generate a response.

Installation Guide
1 Clone the Repository
git clone https://github.com/yourusername/opsmind-ai.git
cd opsmind-ai
Backend Setup
cd backend
npm install

Create a .env file

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
GROQ_API_KEY=your_api_key

Start backend server

npm run dev
Frontend Setup
cd frontend
npm install
npm run dev

Application will run on

http://localhost:5173
Example Use Case

Employee uploads a Company Policy PDF

User asks:

What is the leave policy for employees?

System retrieves relevant document sections and generates an answer such as:

Employees are entitled to 20 annual leave days per year according to the company policy document.
