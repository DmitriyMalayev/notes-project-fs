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
        res.status(400).send("title and content fields required");
        return
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


app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);

    if (!title || !content) {
        res.status(400).send("title and content fields required");
        return
    }

    if (!id || isNaN(id)) {
        res.status(400).send("ID must be a valid number");
        return
    }

    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content },
        });
        res.json(updatedNote);
    } catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        res.status(400).send("ID field required");
        return
    }

    try {
        await prisma.note.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});