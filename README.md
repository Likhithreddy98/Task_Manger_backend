# Task Manager — Scalable REST API with Auth & RBAC

A full-stack **Task Manager** application with secure JWT + Google OAuth authentication, role-based access control (User/Admin), and a modern React frontend.
 
## Seed Admin User 

```bash
npm run seed
```
Creates admin: `admin@taskmanager.com` / `admin123`


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
