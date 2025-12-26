import cors from "cors"
import express from "express"
import { authRoutes } from "../routes/auth.routes.js"
import { healthCheckRoutes } from "../routes/healthcheck.routes.js"
const app = express()

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
)

// routes
app.use("/api/v1/healthcheck", healthCheckRoutes)
app.use("/api/v1/auth", authRoutes)

export default app
