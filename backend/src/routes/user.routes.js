import express from "express"
import { adminOnly, verifyJWT } from "../middlewares/auth.middlewares"
import {
  deleteUser,
  getUserById,
  getUsers,
} from "../controllers/user.controllers"

export const userRoutes = express.Router()

userRoutes.get("/", verifyJWT, adminOnly, getUsers)
userRoutes.get("/:id", verifyJWT, getUserById)
userRoutes.get("/:id", verifyJWT, adminOnly, deleteUser)
