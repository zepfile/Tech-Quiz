# 🚀 TechQuiz - Full-Stack MERN Assessment Platform

A modern, responsive, and secure **MERN Stack** (MongoDB, Express.js, React.js, Node.js) Examination & Quiz Management Platform designed for technical skill evaluations.

---

## ✨ Features

### 👤 Candidate Portal
- **Interactive Quiz Catalog:** Browse technical tracks across JavaScript, React.js, Node.js, MongoDB, and Full-Stack MERN with authentic SVG badges.
- **Timed MCQ Assessments:** Auto-starting countdown timer (`MM:SS`) with active question navigation palette.
- **Anti-Cheat Verification:** Correct answers are evaluated strictly on the backend to prevent client-side inspection tampering.
- **Instant Result Analytics:** Score percentages, pass/fail evaluation, victory trophy / retake target illustrations, and complete question reviews.
- **Performance History:** Comprehensive candidate audit dashboard displaying past test scores, dates, and accuracy metrics.

### 🛡️ Administrator Dashboard
- **Exam Management:** Create, configure, update, and delete technical quizzes with custom duration and passing criteria.
- **Question Bank Engine:** Add, edit, and organize multiple-choice questions with 4 options (A, B, C, D) and designated correct answers.
- **Global Submissions Audit:** Filter and search candidate exam attempts by candidate name and quiz title.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Ant Design, Custom SVGs, CSS3 Modules |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js |
| **Database** | MongoDB Atlas (Cloud) / Mongoose ODM |
| **Security** | Hashed credentials, JWT Auth Middleware, Git-ignored environment variables |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your MongoDB connection string and JWT secret:
```env
PORT=5000
JWT_SECRET=your_secret_jwt_key
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/techquiz?retryWrites=true&w=majority
```

### 3. Install Dependencies
```bash
# Install root & backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 4. Run Application
Run both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 🔑 Default Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@quiz.com` | `admin123` | Full access to Exam Management, Questions & Global Reports |
| **Candidate** | `user@quiz.com` | `user123` | Quizzes attempt, Timer, Live score & accuracy, Personal history |

*(New accounts can also be created via the Register screen)*

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
