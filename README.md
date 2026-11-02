# 🚀 TechQuiz - Full-Stack MERN Assessment Platform

A modern, responsive, enterprise-grade **MERN Stack** (MongoDB, Express.js, React.js, Node.js) Examination & Quiz Management Platform designed for technical skill evaluations.

---

## 📁 Clean MERN Architecture & Folder Structure

```
Tech-Quiz/
│
├── api/                           # Vercel Serverless Function entry point
│   └── index.js                   # Express app serverless wrapper
│
├── client/                        # React Frontend (SPA)
│   ├── public/                    # Static assets & HTML template
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src/                       # Frontend source code
│       ├── apicalls/              # Authenticated Axios API client calls
│       │   ├── exams.js           # Exam CRUD & question operations
│       │   ├── index.js           # Interceptor attaching Bearer JWT
│       │   ├── reports.js         # Submission audits & Leaderboard
│       │   └── users.js           # Auth & profile management
│       ├── components/            # Reusable UI components & layouts
│       │   ├── CertificateModal.js# Printable verified PDF certificate
│       │   ├── index.js           # Barrel export
│       │   ├── Loader.js          # Spinner overlay
│       │   ├── PageTitle.js       # Standardized view header
│       │   ├── ProfileModal.js    # Candidate / Admin profile dialog
│       │   ├── ProtectedRoute.js  # Role-guarded layout & hover sidebar
│       │   ├── SvgIllustrations.js# Custom vector illustrations
│       │   └── TechIcons.js       # Category brand SVG icons
│       ├── pages/                 # View controllers by domain
│       │   ├── admin/             # Administrator Portal
│       │   │   ├── AdminReports/  # Global audit with CSV export
│       │   │   └── Exams/         # Add/Edit exam, bulk import, question bank
│       │   ├── common/            # Shared routes
│       │   │   ├── Home/          # Assessment tracks catalog
│       │   │   ├── Leaderboard/   # Top 3 podium, rankings & standings
│       │   │   ├── Login/         # Dual-role authentication
│       │   │   ├── Profile/       # User profile details
│       │   │   └── Register/      # Candidate registration
│       │   └── user/              # Candidate Exam Flow
│       │       ├── UserReports/   # Personal attempt history & certificates
│       │       └── WriteExam/     # Proctoring, timer, negative marking & review
│       ├── redux/                 # Global state management (Redux Toolkit)
│       │   ├── loaderSlice.js
│       │   ├── store.js
│       │   └── usersSlice.js
│       ├── stylesheets/           # Modular CSS3 styling
│       │   ├── alignments.css
│       │   ├── custom-components.css
│       │   ├── form-elements.css
│       │   ├── layout.css
│       │   ├── textelements.css
│       │   └── theme.css
│       ├── utils/                 # Helper utilities (CSV parsing/export)
│       │   ├── csvHelper.js
│       │   └── index.js
│       ├── App.js                 # React Router configuration
│       ├── index.js               # React root renderer
│       └── index.css              # Base styling
│
├── server/                        # Node.js / Express Backend
│   ├── config/                    # Database & memory fallback configurations
│   │   ├── dbConfig.js            # MongoDB Atlas connection handler
│   │   └── memoryStore.js         # High-availability in-memory store
│   ├── middlewares/               # Express request pipeline middlewares
│   │   └── authMiddleware.js      # JWT verification & role injection
│   ├── models/                    # Mongoose Data Schemas
│   │   ├── examModel.js           # Exam tracks with negative marking
│   │   ├── questionModel.js       # MCQs with explanations
│   │   ├── reportModel.js         # Candidate results & cheating audits
│   │   └── userModel.js           # Hashed credentials & admin flags
│   ├── routes/                    # REST API route controllers
│   │   ├── examsRoute.js          # Exam & question endpoints
│   │   ├── reportsRoute.js        # Audit reports & competitive leaderboard
│   │   └── usersRoute.js          # Authentication & profile endpoints
│   ├── server.js                  # Express bootstrap, CORS & route mounting
│   ├── .env                       # Local environment variables (gitignored)
│   └── .env.example               # Environment variables template
│
├── .env                           # Root environment config (gitignored)
├── .env.example                   # Root environment template
├── .gitignore                     # Monorepo gitignore
├── package.json                   # Root scripts (start, server, client, dev, build)
├── vercel.json                    # Vercel deployment orchestration
└── README.md                      # Documentation & architecture guide
```

---

## ✨ Features & Capabilities

### 👤 Candidate Portal
- **Interactive Quiz Catalog:** Clean technical assessment cards with duration, question count, and passing threshold.
- **Competitive Leaderboard (Top 3 Podium):** Global & exam-specific rankings with 🥇 Gold, 🥈 Silver, 🥉 Bronze badges, live search, and personal standing banner.
- **Anti-Cheating Proctoring:** Fullscreen mode enforcement, 3-strike tab-switch/window-blur tracker with auto-termination, right-click, cut, copy, paste, and devtools shortcut prevention.
- **Negative Marking & Concept Breakdown:** Optional negative mark penalty calculation with post-exam "Concept & Solution Breakdown" cards.
- **Downloadable Verified PDF Certificate:** Official certificate with verification ID, candidate name, score, and print-to-PDF formatting.
- **Performance History & CSV Export:** Download comprehensive test history to CSV with accuracy analytics.

### 🛡️ Administrator Dashboard
- **Exam & Question Management:** Create, configure, update, and delete quizzes with custom duration, passing criteria, and negative marking rules.
- **Bulk CSV / Excel Question Import:** Upload 50+ questions with choices and explanations in 1 click.
- **CSV Reports Export:** Download all candidate submissions in clean spreadsheet format.
- **Global Submissions Audit:** Real-time audit with candidate name and exam filters.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Redux Toolkit, Ant Design v4, Custom SVGs |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js, CORS |
| **Database** | MongoDB Atlas (Cloud) / Mongoose ODM |
| **Deployment** | Vercel Serverless Functions (`@vercel/node` + `@vercel/static-build`) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `.env` contains:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/techquiz?retryWrites=true&w=majority
```

### 3. Install Dependencies
```bash
# Install root & backend dependencies
npm install

# Install frontend dependencies
npm install --prefix client
```

### 4. Run Development Servers
```bash
# Run both client (port 3000) and backend server (port 5000)
npm run dev
```

- **Frontend Client:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
