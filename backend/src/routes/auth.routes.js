import { Router } from "express"
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
  uploadImage,
} from "../controllers/auth.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/upload.middlewares.js"

export const authRoutes = Router()

authRoutes.post("/register", registerUser)
authRoutes.post("/login", loginUser)
authRoutes.get("/profile", verifyJWT, getUserProfile)
authRoutes.put("/profile", verifyJWT, updateUserProfile)

authRoutes.post("/upload-image", upload.single("image"), uploadImage)
