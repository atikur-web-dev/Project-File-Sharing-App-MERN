# File Sharing App Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-File%20Upload-FF6C37?style=for-the-badge)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A production-ready RESTful API for secure file uploading, sharing, authentication, and file management built with **Node.js**, **TypeScript**, **Express.js**, and **MongoDB**.


---
## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Security:** Helmet, CORS, Rate Limiting, JWT
- **File Upload:** Multer
- **Email:** Resend API
- **Scheduled Tasks:** node-cron

##  Features

###  Authentication & Authorization
- User Registration & Login
- Email Verification (Resend API)
- JWT Authentication (Access + Refresh Tokens)
- Secure HTTP-Only Cookie-based Sessions
- User Profile Retrieval
- Logout & Session Management

###  File Management
- Single & Multiple File Upload (Max 5 Files)
- Secure UUID-based File Sharing
- Inline File Preview & Download
- File Metadata Retrieval
- Pagination, Search & Sorting
- Authorized File Deletion

###  Security & Infrastructure
- Rate Limiting
- Helmet & CORS Protection
- Zod Request Validation
- Environment Variable Validation
- Automatic Orphan File Cleanup (Cron Job)
- Global Error Handling

## Environment Variables
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
## Quick Start
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




### Complete API Endpoints
**Base URL:** `http://localhost:8000/api/v1`

## API Testing

All REST API endpoints can be tested using the included Postman Collection.

**Postman Collection:**

```text
postman/File-Sharing-App.postman_collection.json
```

### Steps
1. Import the Postman Collection into Postman.
2. Start the backend server.
3. Update the `base_url` if necessary (default: `http://localhost:8000/api/v1`).
4. Execute the requests to test the available endpoints.


### Authentication Endpoints (Test in PostMan)

| Method |        Full Endpoint         | Description        | Auth Required |
|--------|------------------------------|--------------------|---------------|
| POST   | `/api/v1/auth/register`      | Register new user  |      NO       |
| POST   | `/api/v1/auth/login`         | Login user         |      NO       |
| GET    | `/api/v1/auth/verify/:token` | Verify email       |      NO       |
| POST   | `/api/v1/auth/refresh`       | Refresh tokens     |      NO       |
| GET    | `/api/v1/auth/me`            | Get current user   |      YES      |
| POST   | `/api/v1/auth/logout`        | Logout user        |      YES      |


### File Management Endpoints (Test in PostMan)

| Method |       Full Endpoint            | Description              | Auth Required |
|--------|--------------------------------|--------------------------|---------------|
| POST   | `/api/v1/files`                | Upload files (max 5)     |     YES       |
| GET    | `/api/v1/files`                | Get all files (paginated)|    OPTIONAL   |
| GET    | `/api/v1/files/my`             | Get user's files         |      YES      |
| GET    | `/api/v1/files/download/:uuid` | Download file            |    OPTIONAL   |
| GET    | `/api/v1/files/view/:uuid`     | View file inline         |    OPTIONAL   |
| DELETE | `/api/v1/files/:uuid`          | Delete file              |      YES      |
| GET    | `/api/v1/files/:uuid`          | Get file metadata        |     OPTIONAL  |



### Example Request

**POST** `/api/v1/auth/register`

**Request Body**

```json
{
  "displayName": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Success Response (201 Created)

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "<generated_object_id>",
    "displayName": "John Doe",
    "email": "john@example.com",
    "emailVerification": null
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Email already registered",
  "errors": {
    "email": [
      "Email already exists"
    ]
  }
}
```


## Author

**Atikur Rahman**  
GitHub: [@atikur-web-dev](https://github.com/atikur-web-dev)