# 📚 Books REST API — Express.js + Supabase

A RESTful API built with **Node.js / Express** and **Supabase** (PostgreSQL).  
This is the JavaScript equivalent of the FastAPI/Python version.

---

## 🗂 Project Structure

```
books-api/
├── server.js         # Express app (all routes + Swagger comments)
├── swagger.js        # OpenAPI spec + ReDoc HTML
├── setup.sql         # Supabase table + seed data
├── package.json      # Node dependencies
├── .env.example      # Environment variable template
└── README.md
```

---

## 🗄 Database: `books` Table

Run `setup.sql` in the **Supabase SQL Editor** to create the table and seed 10 books.

| Column         | Type      | Notes                      |
|----------------|-----------|----------------------------|
| id             | bigint    | Auto-generated PK          |
| title          | text      | Required                   |
| author         | text      | Required                   |
| genre          | text      | Optional                   |
| published_year | integer   | Optional                   |
| isbn           | text      | Optional                   |
| inserted_at    | timestamp | Auto-set on insert         |
| updated_at     | timestamp | Auto-updated on row change |

---

## 🚀 Step 1 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → create a free project.
2. Open the **SQL Editor** → paste and run `setup.sql`.
3. From **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public** key → `SUPABASE_KEY`

---

## 💻 Step 2 — Run Locally

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/books-api.git
cd books-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Supabase credentials

# Start the server (with auto-reload)
npm run dev
```

Visit:
- Swagger UI → http://localhost:8001/docs
- ReDoc      → http://localhost:8001/redoc
- Health     → http://localhost:8001/health

---

## ☁️ Step 3 — Deploy to Render

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service** → connect your repo.
3. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node version:** 20 (set in environment)
4. Add **Environment Variables** in Render dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SECRET_KEY` = `your-super-secret-key`
5. Click **Deploy** → visit `YOUR-APP.onrender.com/docs`

---

## 🔐 Authentication

All `/books` endpoints require a Bearer token.

In Swagger UI → click **Authorize** → enter:
```
Bearer your-super-secret-key
```

In curl:
```bash
curl -H "Authorization: Bearer your-super-secret-key" \
     https://YOUR-APP.onrender.com/books
```

---

## 📡 API Endpoints

| Method | Endpoint                      | Auth | Description         |
|--------|-------------------------------|------|---------------------|
| GET    | `/health`                     | ❌   | Health check        |
| GET    | `/books`                      | ✅   | Get all books       |
| GET    | `/books/:id`                  | ✅   | Get book by ID      |
| POST   | `/books`                      | ✅   | Create a book       |
| PUT    | `/books/:id`                  | ✅   | Update a book       |
| DELETE | `/books/:id`                  | ✅   | Delete a book       |
| GET    | `/books/search/genre/:genre`  | ✅   | Search by genre     |

---

## 🧪 curl Examples

```bash
BASE=https://YOUR-APP.onrender.com
TOKEN="Authorization: Bearer your-super-secret-key"

# Get all books
curl -H "$TOKEN" $BASE/books

# Create a book
curl -X POST $BASE/books \
  -H "$TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Dune","author":"Frank Herbert","genre":"Sci-Fi","published_year":1965}'

# Update a book
curl -X PUT $BASE/books/1 \
  -H "$TOKEN" -H "Content-Type: application/json" \
  -d '{"genre":"Classic Fiction"}'

# Delete a book
curl -X DELETE $BASE/books/1 -H "$TOKEN"

# Search by genre
curl -H "$TOKEN" $BASE/books/search/genre/Fantasy
```

---

## Python vs JavaScript — What's Different?

| Feature | Python (FastAPI) | JavaScript (Express) |
|---------|-----------------|---------------------|
| Framework | FastAPI | Express.js |
| Docs generation | Auto from type hints | JSDoc comments → swagger-jsdoc |
| Validation | Pydantic models | Manual checks in route handlers |
| Run command | `uvicorn myserver:app` | `node server.js` |
| Package file | `requirements.txt` | `package.json` |
| Install command | `pip install -r requirements.txt` | `npm install` |
| Supabase client | `supabase-py` | `@supabase/supabase-js` |
