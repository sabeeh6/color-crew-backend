import { Router } from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import {
    saveSketch,
    getUserSketches,
    getSketchById,
    deleteSketch,
    renameSketch
} from "../controllers/sketchController.js";

export const sketchRoutes = Router();

// Retrieve multiple sketches (paginated without full JSON)
sketchRoutes.get("/", verifyUser, getUserSketches);

// Retrieve single sketch with full JSON (Publicly accessible for collaboration links)
sketchRoutes.get("/:id", getSketchById);

// Create or update full sketch
sketchRoutes.post("/", verifyUser, saveSketch);

// Delete single sketch
sketchRoutes.delete("/:id", verifyUser, deleteSketch);

// Rename single sketch
sketchRoutes.patch("/:id/title", verifyUser, renameSketch);
