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

---

### Project Structure
Backend/
├── src/
│ ├── Config/ # Environment configuration
│ ├── Controller/ # Request handlers
│ ├── Models/ # MongoDB schemas
│ ├── Services/ # Business logic
│ ├── Middlewares/ # Auth, validation, upload
│ ├── Routes/ # API endpoints
│ ├── Utils/ # Helpers & cleanup scripts
│ └── server.ts # Entry point



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

GET /api/v1/auth/me

text
Headers: Authorization: Bearer <token>\

