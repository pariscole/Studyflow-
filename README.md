# 📚 StudyFlow

> **An AI-powered academic success platform that centralizes course management, assignment tracking, study planning, exam preparation, analytics, and AI-assisted learning.**

---

## 🚀 Overview

StudyFlow is a full-stack web application that helps college students manage their academic life in one place. Instead of switching between multiple applications like Canvas, Google Calendar, Notes, and AI tools, StudyFlow provides a centralized platform for organizing courses, tracking assignments, planning study sessions, preparing for exams, and improving productivity.

This project demonstrates full-stack development, modular system design, REST API integration, and AI-assisted learning using Google Gemini.

---

## ✨ Features

- 📊 Interactive Dashboard
- 📚 Course Management
- ✅ Assignment Tracker
- 📅 Study Planner
- 🎓 Exam Center
- ⏱️ Pomodoro Focus Timer
- 🤖 AI Study Assistant (Google Gemini)
- 📈 Productivity Analytics
- 💾 JSON Backup & Restore
- 🌙 Responsive Dark Mode

---

## 🏗️ System Architecture

StudyFlow follows a modular architecture where each feature works independently while sharing application state.

```text
User Interaction
       │
       ▼
React Components
       │
       ▼
React State (Hooks)
       │
       ├────────► LocalStorage
       │
       └────────► Express Backend
                       │
                       ├──► System Telemetry
                       └──► Google Gemini API
```

This design keeps the interface responsive while securely handling AI requests through the backend.

---

## 🛠️ Tech Stack

### Frontend
- React 18
- JavaScript (ES6+)
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js

### AI
- Google Gemini API

### Storage
- Browser LocalStorage
- JSON Backup & Restore

---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/pariscole/StudyFlow2.git
cd StudyFlow2
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root.

```env
GEMINI_API_KEY=YOUR_API_KEY
```

### Run the application

```bash
npm run dev
```

---

## 📂 Project Structure

```text
StudyFlow/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── server/
├── public/
├── package.json
└── README.md
```

---

## 🔮 Future Improvements

- Canvas LMS integration
- Google Calendar synchronization
- User authentication
- Cloud database support
- Multi-device synchronization
- Mobile application

---

## 💡 Why I Built This

Students often manage coursework across several disconnected tools. StudyFlow brings academic planning, assignment tracking, AI-powered study assistance, and productivity tools together into one platform.

Building this project strengthened my experience with full-stack development, modular architecture, API integration, and designing systems that solve real-world problems.

---

## 📄 License

This project is licensed under the MIT License.
