# 🚀 Task Manager — Scalable REST API with Auth & RBAC

A full-stack **Task Manager** application with secure JWT + Google OAuth authentication, role-based access control (User/Admin), and a modern React frontend.

## 📋 Features

### Backend
- ✅ User registration & login with **bcrypt** password hashing
- ✅ **JWT**-based authentication
- ✅ **Google OAuth 2.0** login (Passport.js)
- ✅ **Role-based access control** (User / Admin)
- ✅ Full **CRUD** for tasks with ownership checks
- ✅ **Admin user management** — view, promote/demote, delete users
- ✅ **API versioning** (`/api/v1/...`)
- ✅ **Joi** input validation on all endpoints
- ✅ Centralized error handling
- ✅ **Swagger UI** API documentation
- ✅ **Helmet** security headers + **Rate limiting**
- ✅ **MongoDB sanitization** — NoSQL injection prevention
- ✅ **XSS protection** — input sanitization
- ✅ **HPP** — HTTP parameter pollution protection
- ✅ **Winston** + **Morgan** logging

### Frontend
- ✅ Modern **React.js** SPA (Vite)
- ✅ Registration & login forms
- ✅ Google OAuth "Sign in with Google" button
- ✅ Protected dashboard with task management
- ✅ Create, edit, delete tasks with status filtering
- ✅ **Admin Panel** — manage users, change roles, delete users
- ✅ Real-time task statistics (accurate across pages)
- ✅ Dark theme with glassmorphism UI
- ✅ Toast notifications for all actions
- ✅ Responsive design (mobile-friendly)
- ✅ Relative timestamps ("2h ago")

---

## 🛠️ Tech Stack

| Layer    | Technology                             |
|----------|----------------------------------------|
| Backend  | Node.js, Express.js                   |
| Database | MongoDB (Mongoose)                     |
| Auth     | JWT, bcryptjs, Passport.js (Google)   |
| Frontend | React.js, Vite, React Router, Axios  |
| Docs     | Swagger UI (swagger-jsdoc)            |
| Security | Helmet, CORS, express-rate-limit, express-mongo-sanitize, xss-clean, hpp |
| Logging  | Winston, Morgan                        |

---

## 📁 Project Structure

```
Task_Manger_backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth endpoints
│   │   ├── taskController.js     # Task CRUD endpoints
│   │   └── userController.js     # Admin user management
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── roleCheck.js          # Role-based access
│   │   ├── errorHandler.js       # Centralized errors
│   │   └── validate.js           # Joi validation
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Task.js               # Task schema
│   ├── routes/v1/
│   │   ├── authRoutes.js         # Auth routes
│   │   ├── taskRoutes.js         # Task routes
│   │   ├── userRoutes.js         # User management routes
│   │   └── index.js              # Route aggregator
│   ├── services/
│   │   ├── authService.js        # Auth business logic
│   │   ├── taskService.js        # Task business logic
│   │   └── userService.js        # User management logic
│   ├── utils/
│   │   ├── ApiError.js           # Custom error class
│   │   ├── logger.js             # Winston logger
│   │   └── passport.js           # Google OAuth config
│   ├── validations/
│   │   ├── authValidation.js     # Auth Joi schemas
│   │   ├── taskValidation.js     # Task Joi schemas
│   │   └── userValidation.js     # User Joi schemas
│   └── app.js                    # Express app setup
├── client/                       # React frontend
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AuthCallback.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server.js                     # Entry point
├── seed.js                       # Admin seed script
├── package.json
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Atlas or local)
- [Google Cloud Console](https://console.cloud.google.com/) project for OAuth

### 1. Clone & Install

```bash
git clone <repository_url>
cd Task_Manger_backend

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
CLIENT_URL=http://localhost:5173
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Set application type to **Web application**
6. Add Authorized redirect URI: `http://localhost:5000/api/v1/auth/google/callback`
7. Copy the **Client ID** and **Client Secret** to your `.env`

### 4. Seed Admin User (Optional)

```bash
npm run seed
```
Creates admin: `admin@taskmanager.com` / `admin123`

### 5. Run the Application

```bash
# Terminal 1 — Start backend
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:5000/api-docs

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login with credentials | ❌ |
| GET | `/api/v1/auth/google` | Google OAuth login | ❌ |
| GET | `/api/v1/auth/google/callback` | Google callback | ❌ |
| GET | `/api/v1/auth/me` | Get current user | ✅ |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/tasks` | Get all tasks | ✅ |
| GET | `/api/v1/tasks/:id` | Get single task | ✅ |
| POST | `/api/v1/tasks` | Create task | ✅ |
| PUT | `/api/v1/tasks/:id` | Update task | ✅ |
| DELETE | `/api/v1/tasks/:id` | Delete task | ✅ |

### Users (Admin Only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users` | List all users | ✅ Admin |
| GET | `/api/v1/users/stats` | User & task statistics | ✅ Admin |
| GET | `/api/v1/users/:id` | Get single user | ✅ Admin |
| PUT | `/api/v1/users/:id/role` | Update user role | ✅ Admin |
| DELETE | `/api/v1/users/:id` | Delete user & their tasks | ✅ Admin |

### Health Check
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/health` | API health status | ❌ |

### Role Behavior
- **User** → Can manage only their own tasks
- **Admin** → Can view and manage all tasks + manage all users

---

## 🔐 Security Practices

- JWT tokens with configurable expiry
- bcrypt password hashing (10 salt rounds)
- Helmet HTTP security headers
- CORS restricted to frontend origin
- Global rate limiting (500 req/15min) + auth-specific (100 req/15min)
- Joi input validation & sanitization
- MongoDB injection prevention via `express-mongo-sanitize`
- XSS attack prevention via `xss-clean`
- HTTP parameter pollution protection via `hpp`
- Centralized error handling (no stack traces in production)

---

## 📊 Scalability Considerations

- **Modular architecture**: Controllers → Services → Models
- **API versioning**: `/api/v1/` for backward compatibility
- **Database indexing**: Compound indexes for performance
- **Separation of concerns**: Clean code structure
- **Logging**: Winston for production monitoring
- **Environment-based config**: Easy deployment to any environment
- **Microservices-ready**: Each module (auth, tasks, users) can be extracted independently
- **Caching-ready**: Service layer is a natural boundary for adding Redis cache
- **Load balancing**: Stateless JWT auth enables horizontal scaling

---

## 📝 License

ISC
