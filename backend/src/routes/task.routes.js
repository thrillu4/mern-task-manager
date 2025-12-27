import express from "express"
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskCheckList,
  updateTaskStatus,
} from "../controllers/task.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

export const taskRoutes = express.Router()

taskRoutes.get("/", verifyJWT, getTasks)
taskRoutes.get("/:id", verifyJWT, getTaskById)
taskRoutes.post("/", verifyJWT, createTask)
taskRoutes.put("/:id", verifyJWT, updateTask)
taskRoutes.delete("/:id", verifyJWT, deleteTask)
taskRoutes.put("/:id/status", verifyJWT, updateTaskStatus)
taskRoutes.put("/:id/todo", verifyJWT, updateTaskCheckList)
