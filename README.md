🚀 OpsMind AI
🧠 Context-Aware Corporate Knowledge Brain

✨ Overview

OpsMind AI is an intelligent corporate knowledge assistant that allows employees to interact with internal company documents using natural language.

Instead of manually searching through long PDFs, manuals, or policy documents, users can simply ask questions and receive context-aware answers powered by AI.

The system uses Retrieval-Augmented Generation (RAG) to retrieve relevant document information and generate accurate responses using Large Language Models (LLMs).

💡 Think of it as ChatGPT for your company's internal knowledge.

🎯 Problem Statement

Organizations store huge amounts of knowledge in documents such as:

📄 Policy Documents
📘 Technical Manuals
📊 Reports
📚 Knowledge Base Articles

Traditional keyword search often fails to capture context and meaning.

OpsMind AI solves this using semantic search + AI reasoning.

🌟 Key Features
🤖 AI-Powered Knowledge Chat

Ask questions about company documents and get instant answers.

🔎 Semantic Vector Search

Uses MongoDB Atlas Vector Search to retrieve contextually relevant information.

📄 PDF Document Ingestion

Upload documents which are automatically processed and indexed.

🧠 Retrieval-Augmented Generation (RAG)

Combines retrieval + LLM reasoning to generate accurate answers.

🔐 Secure Authentication

JWT-based login and role-based access control.

🏢 Multi-Tenant Architecture

Ensures company-level data isolation.

⚡ Real-Time Streaming

AI responses are streamed using Server-Sent Events (SSE) for smooth chat experience.

🏗 System Architecture
User Question
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
AI Generated Answer
      │
      ▼
Streaming Response to Chat UI
🛠 Tech Stack
💻 Frontend

⚛ React (Vite)
🎨 Tailwind CSS
🔗 Axios

⚙ Backend

🟢 Node.js
🚂 Express.js
🧠 LangChain.js

🤖 AI / LLM

🔹 Retrieval-Augmented Generation (RAG)
🔹 Gemini / Llama 3 APIs
🔹 Embedding Models

🗄 Database

🍃 MongoDB
🔍 MongoDB Atlas Vector Search

🔐 Authentication

🔑 JWT (JSON Web Tokens)

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
│   │   ├── services
│   │   └── App.jsx
│
├── uploads
├── README.md
└── package.json
🔄 RAG Pipeline Workflow
1️⃣ Document Upload

Users upload company PDFs.

2️⃣ Text Extraction

Text is extracted from the document.

3️⃣ Chunking

Large documents are split into smaller pieces.

4️⃣ Embedding Generation

Each chunk is converted into a vector embedding.

5️⃣ Vector Storage

Embeddings are stored in MongoDB Atlas Vector Database.

6️⃣ Query Processing

User query → converted into embedding.

7️⃣ Semantic Retrieval

Vector search retrieves the most relevant document chunks.

8️⃣ AI Response Generation

Context + query is sent to the LLM to generate an answer.

⚙ Installation
1️⃣ Clone the Repository
git clone https://github.com/yourusername/opsmind-ai.git
cd opsmind-ai
🖥 Backend Setup
cd backend
npm install

Create .env

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key
GROQ_API_KEY=your_api_key

Run backend

npm run dev
🌐 Frontend Setup
cd frontend
npm install
npm run dev

App runs on

http://localhost:5173🚀 Future Improvements

🔹 Hybrid Search (Vector + Keyword)
🔹 Conversation Memory
🔹 Advanced Analytics Dashboard
🔹 Multi-document summarization
🔹 Cloud Deployment with Docker

📚 Learning Outcomes

Through this project I gained hands-on experience in:

🧠 Retrieval-Augmented Generation
📊 Vector Databases
🤖 LLM Integration
⚙ Full Stack MERN Development
🔐 Authentication Systems
🏗 AI System Architecture
