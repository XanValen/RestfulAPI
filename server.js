import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec, redocHtml } from "./swagger.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_KEY");
  return createClient(url, key);
}

const SECRET_KEY = process.env.SECRET_KEY || "your-super-secret-key";

function requireAuth(req, res, next) {
  const auth = req.headers["authorization"] || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token !== SECRET_KEY) {
    return res.status(401).json({ detail: "Invalid or missing token" });
  }
  next();
}

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/redoc", (_req, res) => res.send(redocHtml));
app.get("/openapi.json", (_req, res) => res.json(swaggerSpec));


app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Books API is running 📚" });
});

app.get("/books", requireAuth, async (_req, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from("books").select("*").order("id");
    if (error) throw error;
    res.json({ count: data.length, books: data });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get("/books/:id", requireAuth, async (req, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("books")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error || !data) return res.status(404).json({ detail: `Book id=${req.params.id} not found` });
    res.json(data);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.post("/books", requireAuth, async (req, res) => {
  try {
    const { title, author, genre, published_year, isbn } = req.body;
    if (!title || !author) {
      return res.status(400).json({ detail: "title and author are required" });
    }
    const sb = getSupabase();
    const { data, error } = await sb
      .from("books")
      .insert([{ title, author, genre, published_year, isbn }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ message: "Book created successfully", book: data });
  } catch (err) {
    res.status(400).json({ detail: err.message });
  }
});

app.put("/books/:id", requireAuth, async (req, res) => {
  try {
    const sb = getSupabase();
    const { data: existing } = await sb
      .from("books")
      .select("id")
      .eq("id", req.params.id)
      .single();
    if (!existing) return res.status(404).json({ detail: `Book id=${req.params.id} not found` });

    const updates = {};
    for (const field of ["title", "author", "genre", "published_year", "isbn"]) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ detail: "No fields provided to update" });
    }

    const { data, error } = await sb
      .from("books")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ message: "Book updated successfully", book: data });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.delete("/books/:id", requireAuth, async (req, res) => {
  try {
    const sb = getSupabase();
    const { data: existing } = await sb
      .from("books")
      .select("id")
      .eq("id", req.params.id)
      .single();
    if (!existing) return res.status(404).json({ detail: `Book id=${req.params.id} not found` });

    const { error } = await sb.from("books").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: `Book id=${req.params.id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get("/books/search/genre/:genre", requireAuth, async (req, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("books")
      .select("*")
      .ilike("genre", `%${req.params.genre}%`);
    if (error) throw error;
    res.json({ count: data.length, books: data });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Books API running on http://localhost:${PORT}`);
  console.log(`   Swagger UI → http://localhost:${PORT}/docs`);
  console.log(`   ReDoc      → http://localhost:${PORT}/redoc`);
});
