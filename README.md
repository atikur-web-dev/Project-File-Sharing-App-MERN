# File Sharing APP

A production-ready file sharing and distribution backend built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**.


### Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Security:** Helmet, CORS, Rate Limiting, JWT
- **File Upload:** Multer
- **Email:** Resend API
- **Scheduled Tasks:** node-cron

### Environment Variables
Create a `.env` file by copying `.env.example`:
```bash
cp .env.example .env

PORT=8000
APP_URL=http://localhost
NODE_ENV=development
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
ACCESS_TOKEN_SECRET_KEY=your_access_secret
ACCESS_TOKEN_EXPIRE=1d
REFRESH_TOKEN_SECRET_KEY=your_refresh_secret
REFRESH_TOKEN_EXPIRE=30d

RESEND_API_KEY=re_xxxxxxxxxxxxxx
```

## Project Structure
```
Backend/
├── src/
│   ├── Config/          # Environment & mail configs
│   ├── Controller/      # Auth & file controllers
│   ├── DataBase/        # MongoDB connection
│   ├── Middlewares/     # Auth, upload, rate limit, error handler
│   ├── Models/          # User & File schemas
│   ├── Routes/          # Auth & File routes
│   ├── Services/        # Business logic (register, login, upload, etc.)
│   ├── Types/           # TypeScript interfaces
│   ├── Utils/           # Helpers, validation, cleanup cron
│   ├── Validators/      # Zod validation rules
│   ├── App.ts           # Express app setup
│   └── server.ts        # Server entry point
├── .env.example
├── package.json
└── tsconfig.json
```


### Quick Start
### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```
**Server runs on:** `http://localhost:8000`

###  Frontend Setup
```bash
cd Frontend
npm install
cp .env.example .env
npm run dev

App runs on http://localhost:5173
```

### Complete API Endpoints
**Base URL:** `http://localhost:8000/api/v1`



### Authentication Endpoints (Test in PostMan)
-----------------------------------------------------------------------------
| Method |        Full Endpoint         | Description        | Auth Required |
|--------|------------------------------|--------------------|---------------|
| POST   | `/api/v1/auth/register`      | Register new user  |      NO       |
| POST   | `/api/v1/auth/login`         | Login user         |      NO       |
| GET    | `/api/v1/auth/verify/:token` | Verify email       |      NO       |
| POST   | `/api/v1/auth/refresh`       | Refresh tokens     |      NO       |
| GET    | `/api/v1/auth/me`            | Get current user   |      YES      |
| POST   | `/api/v1/auth/logout`        | Logout user        |      YES      |
-----------------------------------------------------------------------------

### File Management Endpoints (Test in PostMan)
--------------------------------------------------------------------------------------
| Method |       Full Endpoint            | Description              | Auth Required |
|--------|--------------------------------|--------------------------|---------------|
| POST   | `/api/v1/files`                | Upload files (max 5)     |     YES       |
| GET    | `/api/v1/files`                | Get all files (paginated)|    OPTIONAL   |
| GET    | `/api/v1/files/my`             | Get user's files         |      YES      |
| GET    | `/api/v1/files/download/:uuid` | Download file            |    OPTIONAL   |
| GET    | `/api/v1/files/view/:uuid`     | View file inline         |    OPTIONAL   |
| DELETE | `/api/v1/files/:uuid`          | Delete file              |      YES      |
| GET    | `/api/v1/files/:uuid`          | Get file metadata        |     OPTIONAL  |
-------------------------------------------------------------------------------------


#### Example Requests

**POST /api/v1/auth/register**
```json
{
  "displayName": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}



