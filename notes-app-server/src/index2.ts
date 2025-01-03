import express, { RequestHandler } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const getNotes: RequestHandler = async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
};

const createNote: RequestHandler = async (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content) {
        res.status(400).send("title and content fields required");
        return;
    }

    try {
        const note = await prisma.note.create({
            data: { title, content },
        });
        res.json(note);
    } catch (error) {
        next(error);
    }
};

app.get("/notes", getNotes);
app.post("/api/notes", createNote);

// Add this at the end of the file
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});