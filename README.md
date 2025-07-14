# Logging Middleware


A full stack URL shortener application with a modern UI, efficient backend, and support for temporary short URLs. Built using **React**, **Node.js**, **Express**, and **MongoDB**. Deployed on **Vercel**.

---

## 🚀 Live Demo

- **Frontend:** [https://your-frontend.vercel.app](https://logging-middleware-taupe.vercel.app/)
- **Backend:** [https://your-backend.vercel.app](https://logging-middleware-u2qi.vercel.app/)

---

## 🧩 Features

### 🔧 Backend (Node.js, Express, MongoDB)

- ✅ **Shorten URLs** – Accepts a long URL and returns a unique, shortened URL.
- 🔁 **Redirect** – Redirects users from the short URL to the original long URL.
- ⏳ **URL Expiry** – Short URLs are valid for **30 minutes** by default.
- 📄 **List All URLs** – API endpoint to fetch all stored shortened URLs.
- ⚠️ **Robust Error Handling** – Handles validation, duplication, and server errors centrally.
- 🔐 **Environment Configuration** – `.env` used for secrets like MongoDB URI.
- 🌐 **CORS Enabled** – Supports cross-origin requests for frontend-backend interaction.

### 🎨 Frontend (React)

- ✨ **Modern UI** – Clean, responsive interface with **light/dark theme** toggle.
- 📝 **URL Shortening Form** – Submit long URLs to get shortened versions instantly.
- 🔗 **Short URL Display** – Instantly displays the shortened URL with clickable redirection.
- 📊 **URL List Table** – Displays all shortened URLs in a structured table view.
- ⚙️ **Client-side Error Handling** – Displays appropriate errors for invalid URLs or server issues.
- 👨‍💻 **Footer Section** – Includes your name and GitHub profile with branding.

---

## 🖼️ Database & Architecture Overview

### MongoDB Cluster Screenshot

![MongoDB Cluster]("C:\Users\amanp\Pictures\Screenshots\Screenshot 2025-07-14 121415.png")



## 📦 Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Frontend    | React, Tailwind CSS  |
| Backend     | Node.js, Express     |
| Database    | MongoDB Atlas        |
| Deployment  | Vercel (Frontend & Backend) |

---

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/urlshortener.git
cd urlshortener
