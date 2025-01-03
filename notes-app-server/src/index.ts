import express from "express";
import cors from "cors";
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initializeDatabase() {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log("Database initialized");
    } catch (err) {
        console.error("Error initializing database", err);
    } finally {
        client.release();
    }
}

app.get("/api/notes", async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM notes');
        const notes = result.rows;
        client.release();
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

initializeDatabase().then(() => {
    app.listen(5000, () => {
        console.log("server running on localhost:5000");
    });
});