import { Router } from "express"
import { healthCheck } from "../controllers/healthcheck.controller.js"

export const healthCheckRoute = Router()

healthCheckRoute.get("/", healthCheck)
