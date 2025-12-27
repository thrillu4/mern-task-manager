import { Task } from "../models/task.models.js"
import { User } from "../models/user.models.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "member" }).select("-password")

  const usersWithTaskCounts = await Promise.all(
    users.map(async (user) => {
      const pendingTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "Pending",
      })
      const inProgressTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "In Progress",
      })
      const completedTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "Completed",
      })

      return {
        ...user.toObject(),
        pendingTasks,
        inProgressTasks,
        completedTasks,
      }
    }),
  )

  res.status(200).json(new ApiResponse(200, usersWithTaskCounts))
})

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password")
  if (!user) {
    throw new ApiError(404, { message: "User not found" })
  }
  res.status(200).json(new ApiResponse(200, user))
})
