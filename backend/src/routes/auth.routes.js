import { Router } from "express"
import { loginUser, registerUser } from "../controllers/auth.controllers.js"

export const authRoutes = Router()

authRoutes.post("/register", registerUser)
authRoutes.post("/login", loginUser)
