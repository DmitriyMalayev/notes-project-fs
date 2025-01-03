import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();


const app = express();

app.use(express.json());
app.use(cors());

app.get("/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
});

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send("title and content fields required");
    }

    try {
        const note = await prisma.note.create({
            data: { title, content },
        });
        res.json(note);
    } catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});