import express from "express"
import { getUserById, getUsers } from "../controllers/user.controllers.js"
import { adminOnly, verifyJWT } from "../middlewares/auth.middlewares.js"

export const userRoutes = express.Router()

userRoutes.get("/", verifyJWT, adminOnly, getUsers)
userRoutes.get("/:id", verifyJWT, getUserById)
