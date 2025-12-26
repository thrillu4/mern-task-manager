import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name, profileImageUrl, adminInviteToken } = req.body

  const userExist = await User.findOne({ email })

  if (userExist) {
    throw new ApiError(401, "User with this email already exist")
  }

  let role = "member"

  if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
    role = "admin"
  }

  const user = await User.create({
    email,
    name,
    password,
    profileImageUrl,
    role,
  })

  res.status(200).json(
    new ApiResponse(200, {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    }),
  )
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(401, "Invalid email or password")
  }

  const correctPassword = await bcrypt.compare(password, user.password)

  if (!correctPassword) {
    throw new ApiError(401, "Invalid email or password")
  }

  res.status(200).json(
    new ApiResponse(200, {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    }),
  )
})

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password")

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  res.status(200).json(new ApiResponse(200, user))
})

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body

  const user = await User.findById(req.user._id)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  user.name = name || user.name
  user.email = email || user.email
  user.password = password || user.password

  const updatedUser = await user.save()

  res.status(200).json(
    new ApiResponse(200, {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    }),
  )
})

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, { message: "No file uploaded!" })
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`

  res.status(200).json(new ApiResponse(200, { imageUrl: imageUrl }))
})
