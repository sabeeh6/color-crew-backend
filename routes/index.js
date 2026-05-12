import { Router } from "express";
import { authRoutes } from "./authRoutes.js";
import { sketchRoutes } from "./sketchRoutes.js";
import chatRoutes from "./chatRoutes.js";

export const routes = Router()

routes.use('/auth' , authRoutes)
routes.use('/sketches', sketchRoutes)
routes.use('/chat', chatRoutes)
