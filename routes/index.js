import { Router } from "express";
import { authRoutes } from "./authRoutes.js";
import { sketchRoutes } from "./sketchRoutes.js";

export const routes = Router()

routes.use('/auth' , authRoutes)
routes.use('/sketches', sketchRoutes)
