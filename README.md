# 💡 DevHelp – Doubt Tracker App

A full-stack platform to help coding students post doubts and get instant help from mentors.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, React Router, Axios, React Toastify
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Cloudinary (for screenshot upload)
- **Authentication**: JWT-based login system
- **Role-Based Access**: Mentor vs Student
- **Deployment**: Vercel (Frontend) + Render (Backend)

---

## 🌐 Live Links

| App | URL |
|-----|-----|
| **Frontend** | [https://devhelp.vercel.app](https://devhelp.vercel.app) |
| **Backend** | [https://devhelp-api.onrender.com](https://devhelp-api.onrender.com) |

> ✅ Note: Backend may take 30 seconds to spin up (Render free tier)

---

## 🔐 Features & Functionality

### 🔁 CRUD

- **Students** can:
  - Post a new doubt (with optional screenshot)
  - View & delete their own doubts
- **Mentors** can:
  - View all student doubts
  - Post replies
  - Mark as resolved
  - View screenshots if provided

### 🧑‍🏫 Role-Based Access Control

- Protected routes using `PrivateRoute.jsx`
- Users are classified as:
  - `student`
  - `mentor`
- Redirects & dashboard routing based on role

### 🧪 Debugging Done

- Fixed issue where `/doubts/my` was matching `/:id` by reordering routes
- Context and refresh protection with localStorage
- Catching broken images, login redirects, token expiry
- Protected user state on refresh with persistence

### 🔒 Security

- JWT-based authentication (`Authorization: Bearer <token>`)
- Auth middlewares:
  - `protect` – for authenticated access
  - `verifyStudent` – only students
  - `verifyMentor` – only mentors
- MongoDB ObjectId safety handled (`req.user._id`)
- `dotenv` used to store secrets (`JWT_SECRET`, `MONGO_URI`, `CLOUDINARY_*`)
- Optional: Add [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) for brute-force protection

---

## 🧾 API Routes Summary

### Auth (`/api/auth`)

- `POST /login` → returns token and user info
- `POST /register` → register a user

### Doubts (`/api/doubts`)

- `GET /my` → student’s own doubts
- `POST /` → add new doubt
- `DELETE /:id` → delete own doubt
- `PATCH /resolve/:id` → mark as resolved
- `PATCH /reopen/:id` → reopen resolved
- `GET /:id` → get doubt details

### Comments (`/api/comment`)

- `GET /:doubtId` → fetch all comments
- `POST /:doubtId` → add reply (mentor only)

### Notifications (`/api/notifications`)

- `GET /my` → fetch notifications for logged-in user

---

## 📁 Folder Structure

```bash
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── api/axios.js
│   ├── App.jsx
│   └── main.jsx
