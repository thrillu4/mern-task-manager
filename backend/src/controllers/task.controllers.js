import { Task } from "../models/task.models.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

export const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    priority,
    dueDate,
    attachments,
    assignedTo,
    todoChecklist,
  } = req.body

  if (!Array.isArray(assignedTo)) {
    throw new ApiError(400, "Task must be assigned to user ID array")
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    assignedTo,
    createdBy: req.user._id,
    attachments,
    todoChecklist,
  })

  res
    .status(201)
    .json(new ApiResponse(201, { message: "Task created successfully", task }))
})

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "assignedTo",
    "name email profileImageUrl",
  )

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  res.status(200).json(new ApiResponse(200, task))
})

export const getTasks = asyncHandler(async (req, res) => {
  let tasks

  if (req.user.role === "admin") {
    tasks = await Task.find()
  } else {
    tasks = await Task.find({ assignedTo: req.user._id })
  }

  tasks = await Promise.all(
    tasks.map(async (task) => {
      const completedTasksCount = task.todoChecklist.filter(
        (t) => t.completed,
      ).length
      return { ...task.toObject(), completedTasksCount: completedTasksCount }
    }),
  )

  const allTasks = await Task.countDocuments(
    req.user.role === "admin" ? {} : { assignedTo: req.user._id },
  )

  const pendingTasks = await Task.countDocuments({
    status: "Pending",
    ...(req.user.role === "admin" ? {} : { assignedTo: req.user._id }),
  })

  const inProgressTasks = await Task.countDocuments({
    status: "In Progress",
    ...(req.user.role === "admin" ? {} : { assignedTo: req.user._id }),
  })

  const completedTasks = await Task.countDocuments({
    status: "Completed",
    ...(req.user.role === "admin" ? {} : { assignedTo: req.user._id }),
  })

  res.status(200).json(
    new ApiResponse(200, {
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    }),
  )
})

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  task.title = req.body.title || task.title
  task.description = req.body.description || task.description
  task.priority = req.body.priority || task.priority
  task.dueDate = req.body.dueDate || task.dueDate
  task.todoChecklist = req.body.todoChecklist || task.todoChecklist
  task.attachments = req.body.attachments || task.attachments

  if (req.body.assignedTo) {
    if (!Array.isArray(req.body.assignedTo)) {
      throw new ApiError(400, "Assigned to must be array with IDs")
    }
    task.assignedTo = req.body.assignedTo
  }

  const updatedTask = await task.save()

  res.status(200).json(
    new ApiResponse(200, {
      message: "Task updated successfully!",
      updatedTask,
    }),
  )
})

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    throw new ApiError(404, "Task with this ID not found")
  }

  await task.deleteOne()

  res
    .status(200)
    .json(new ApiResponse(200, { message: "Task deleted successfully!" }))
})

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  const assignedUser = task.assignedTo.some(
    (userId) => userId.toString() === req.user._id.toString(),
  )

  if (!assignedUser && req.user.role !== "admin") {
    throw new ApiError(403, "Access denied")
  }

  task.status = req.body.status || task.status

  if (task.status === "Completed") {
    task.todoChecklist.forEach((item) => (item.completed = true))
    task.progress = 100
  }

  await task.save()

  res.status(200).json(
    new ApiResponse(200, {
      message: "Task status updated successfully!",
      task,
    }),
  )
})

export const updateTaskCheckList = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    throw new ApiError(404, "Task not found")
  }

  const assignedUser = task.assignedTo.some(
    (userId) => userId.toString() === req.user._id.toString(),
  )

  if (!assignedUser && req.user.role !== "admin") {
    throw new ApiError(403, "Access denied")
  }

  task.todoChecklist = req.body.todoChecklist

  const completedTodoCounts = task.todoChecklist.filter(
    (item) => item.completed,
  ).length
  const totalTodos = task.todoChecklist.length

  task.progress =
    totalTodos > 0 ? Math.round((completedTodoCounts / totalTodos) * 100) : 0

  if (task.progress === 100) {
    task.status = "Completed"
  } else if (task.progress > 0) {
    task.status = "In Progress"
  } else {
    task.status = "Pending"
  }

  await task.save()
  const updatedTask = await Task.findById(req.params.id).populate(
    "assignedTo",
    "name email profileImageUrl",
  )

  res.status(200).json(
    new ApiResponse(200, {
      message: "Task checklist updated successfully!",
      updatedTask,
    }),
  )
})

export const getDashboardData = asyncHandler(async (req, res) => {
  const totalTasks = await Task.countDocuments()
  const pendingTasks = await Task.countDocuments({ status: "Pending" })
  const completedTasks = await Task.countDocuments({ status: "Completed" })
  const overdueTasks = await Task.countDocuments({
    status: { $ne: "Completed" },
    dueDate: { $lt: new Date() },
  })

  const taskStatuses = ["Pending", "In Progress", "Completed"]
  const taskDistributionRaw = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ])
  const taskDistribution = taskStatuses.reduce((acc, status) => {
    const formattedKey = status.replace(/\s+/g, "")
    acc[formattedKey] =
      taskDistributionRaw.find((item) => item._id === status)?.count || 0
    return acc
  }, {})
  taskDistribution["All"] = totalTasks

  const taskPriorities = ["Low", "Medium", "High"]
  const taskPriorityLevelsRaw = await Task.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ])
  const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
    acc[priority] =
      taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0
    return acc
  }, {})

  const recentTasks = await Task.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt")

  res.status(200).json(
    new ApiResponse(200, {
      statistics: { totalTasks, pendingTasks, completedTasks, overdueTasks },
      charts: { taskDistribution, taskPriorityLevels },
      recentTasks,
    }),
  )
})

export const getUserDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const totalTasks = await Task.countDocuments({ assignedTo: userId })
  const pendingTasks = await Task.countDocuments({
    assignedTo: userId,
    status: "Pending",
  })
  const completedTasks = await Task.countDocuments({
    assignedTo: userId,
    status: "Completed",
  })
  const overdueTasks = await Task.countDocuments({
    assignedTo: userId,
    status: { $ne: "Completed" },
    dueDate: { $lt: new Date() },
  })

  const taskStatuses = ["Pending", "In Progress", "Completed"]
  const taskDistributionRaw = await Task.aggregate([
    {
      $match: { assignedTo: userId },
    },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ])
  const taskDistribution = taskStatuses.reduce((acc, status) => {
    const formattedKey = status.replace(/\s+/g, "")
    acc[formattedKey] =
      taskDistributionRaw.find((item) => item._id === status)?.count || 0
    return acc
  }, {})
  taskDistribution["All"] = totalTasks

  const taskPriorities = ["Low", "Medium", "High"]
  const taskPriorityLevelsRaw = await Task.aggregate([
    {
      $match: { assignedTo: userId },
    },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ])
  const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
    acc[priority] =
      taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0
    return acc
  }, {})

  const recentTasks = await Task.find({ assignedTo: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt")

  res.status(200).json(
    new ApiResponse(200, {
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    }),
  )
})
