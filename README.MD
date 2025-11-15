# YouTube Backend Clone

A RESTful API built with Node.js, Express and MongoDB for managing video content such as upload, fetch, likes/dislikes, comments and playlists — inspired by YouTube.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Run the application](#run-the-application)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Pagination, Filtering & Search](#pagination-filtering--search)
- [File Uploads](#file-uploads)
- [Project Structure](#project-structure)
  <!-- - [Future Improvements](#future-improvements) -->
  <!-- - [License](#license) -->
  <!-- - [Contact](#contact) -->

## Features

- User signup and login with secure authentication (JWT, access & refresh tokens)
- Password hashing with bcrypt
- CRUD operations for videos — create, read, update, delete
- Video metadata management: like/dislike, comments, subscriptions, history
- File upload handling (video, profile, thumbnail uploads) with Multer and cloud storage using cloudinary
- Pagination, filtering and full text search support
- Clean API response structure
- Well-defined MongoDB schemas for users, videos, comments, playlists, likes, subscriptions

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens) for authentication
- bcrypt for password hashing
- Multer for file uploads
- Cloudinary for storing video files
- Postman for API testing
- dotenv for environment configuration

## Getting Started

### Prerequisites

- Node.js (version 14 or above)
- MongoDB
- Cloudinary account for video uploads

### Installation

```bash
git clone https://github.com/Nabin-sth/yt-backend-API.git
cd yt-backend-API
npm install
```

### Configuration

Create a `.env` file in the root folder and provide the following environment variables:

```

PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
CORS_ORIGIN=<set_cors_origin>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
REFRESH_TOKEN_EXPIRY=<refresh_token_expiry>
ACCESS_TOKEN_SECRET=<your_access_token_secret>
ACCESS_TOKEN_EXPIRY=<access_token_expiry>
CLOUDINARY_URL=<cloudinary_url>

```

### Run the Application

```bash
npm run dev      # For development with nodemon
npm start        # For production
```

The server should start and listen on the configured `PORT`. You can test endpoints using Postman or Thunder Client.

## API Endpoints

### Authentication

- `POST /api/auth/signup` — register a new user
- `POST /api/auth/login` — login and receive JWT tokens

### Videos / Tasks (authenticated)

- `POST /api/videos` — create/upload a new video
- `GET /api/videos` — get videos (with pagination, filtering & search)
- `GET /api/videos/:id` — get single video by ID
- `PATCH /api/videos/:id` — update video (owner or admin)
- `DELETE /api/videos/:id` — delete video (owner or admin)

### Additional Features

- Endpoints for likes/dislikes
- Endpoints for comments
- Endpoints for subscriptions
- Endpoints for viewing history

<!--
## Database Schema

### User

```js
{
  name: String,
  email: String,
  password: String (hashed),
  role: { enum: ['user','admin'], default: 'user' }
}
```

### Video (Task)

```js
{
  title: String,
  description: String,
  status: { enum: ['todo','in_progress','done'], default: 'todo' },
  priority: { enum: ['low','medium','high'], default: 'medium' },
  dueDate: Date,
  owner: ObjectId (ref User),
  createdAt: Date,
  updatedAt: Date
}
```

*(Adapt these to match your actual models.)* -->

## Authentication & Authorization

- On signup, user registers with email and password (hashed with bcrypt)
- On login, server issues an access token (JWT) and optionally a refresh token
- Protected routes require the `Authorization: Bearer <token>` header
- Role-based access control:
  - Users can only access/modify their own videos
  - Admins can manage any content in the system

## Pagination, Filtering & Search

The `GET /api/videos` endpoint supports query parameters:

- `page` — page number
- `limit` — number of items per page
- `status` — filter by task status
- `priority` — filter by priority
- `search` — text search in title/description
- `sort` — e.g., `createdAt`, `-priority` (desc by priority)

Example:

```
GET /api/videos?page=2&limit=10&status=todo&search=assignment&sort=-priority
```

## File Uploads

Videos (or attachments) can be uploaded using Multer middleware.
If using Cloudinary, configure the Cloudinary API keys and upload videos to cloud storage, then save the resulting URL in the database.

## Project Structure

```
yt-backend-API/
├─ src/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ middleware/
│  ├─ utils/
│  ├─ config/
│  └─ server.js
├─ public/
├─ .env
├─ package.json
└─ README.md
```

## 📘 API Documentation

The complete API reference (all routes, request bodies, authentication flow, and sample responses) is available in the Postman public documentation:

👉 **API Docs:** [https://documenter.getpostman.com/view/25560341/2sB3WvMxsQ](https://documenter.getpostman.com/view/25560341/2sB3WvMxsQ)

<!-- This includes:

* Auth routes (Signup, Login)
* Task CRUD operations
* Protected routes usage
* Error responses
* Example payloads for each endpoint -->

<!-- Feel free to explore and test endpoints directly using Postman's built-in “Run in Postman” option.

---

If you want, I can also update your *entire* README with this section included and optimized. -->

<!-- ## Future Improvements

* Implement refresh-token workflow for improved security
* Use Redis for caching frequently accessed data
* Add unit and integration tests (Jest + Supertest)
* Use a message queue (e.g., RabbitMQ) for handling heavy tasks
* Add real-time features (video streaming, WebSockets)
* Dockerize the application for container-based deployment
* Add CI/CD pipeline for automated tests and deployment -->
<!--
## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

Created by **Nabin Sth**
GitHub: [https://github.com/Nabin-sth](https://github.com/Nabin-sth)
Email: [[your-email@example.com](mailto:your-email@example.com)]

Feel free to open issues or submit pull requests if you’d like to contribute.

```

---

Let me know if you’d like me to:
- Add a **Postman collection link** section
- Create **sample environment file (.env.example)**
- Add **deployment instructions** for Heroku/Vercel
- Format the README with badge icons (build, coverage, etc.)
::contentReference[oaicite:3]{index=3}
``` -->
