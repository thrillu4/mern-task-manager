import { Router } from "express"
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controllers/auth.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

export const authRoutes = Router()

authRoutes.post("/register", registerUser)
authRoutes.post("/login", loginUser)
authRoutes.get("/profile", verifyJWT, getUserProfile)
authRoutes.put("/profile", verifyJWT, updateUserProfile)
