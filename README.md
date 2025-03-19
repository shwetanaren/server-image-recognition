# Server Image Recognition API

A simple Node.js/Express backend that provides user authentication and image recognition functionality using the Clarifai API, with PostgreSQL for persistence. This service is designed to be deployed easily (e.g., on Railway) and to serve as the backend for a front-end face-detection application.

---

## 🚀 Features

- **User authentication**: register, sign in, and profile lookup
- **Image recognition**: integrates with Clarifai to detect faces in images
- **PostgreSQL database**: secure password storage (bcrypt), transactional inserts

---

## 📦 Tech Stack

| Layer       | Technology                   |
|-------------|------------------------------|
| Backend     | Node.js, Express             |
| Database    | PostgreSQL (Knex.js ORM)     |
| Recognition | Clarifai API                 |
| Auth        | bcrypt                       |
| Deployment  | Railway (Nixpacks builder)   |

---

## 🛠️ Prerequisites

- Node.js v16+ and npm
- PostgreSQL (local for development)
- Clarifai API key (create a free account at https://clarifai.com)

---

## ⚙️ Environment Variables

| Key             | Description                                    |
|-----------------|------------------------------------------------|
| PORT            | Port for Express server (default: 3000)        |
| DATABASE_URL    | PostgreSQL connection string                   |
| CLARIFAI_API_KEY| Clarifai API key for image recognition         |

