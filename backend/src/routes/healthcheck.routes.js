import { Router } from "express"
import { healthCheck } from "../controllers/healthcheck.controllers.js"

export const healthCheckRoutes = Router()

healthCheckRoutes.get("/", healthCheck)
