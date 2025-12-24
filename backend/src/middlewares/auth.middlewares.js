import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import ApiError from "../utils/ApiError.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization
  if (token && token.startsWith("Bearer")) {
    try {
      token = token.replace("Bearer ", "")
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decode.id).select("-password")

      if (!user) {
        throw new ApiError(404, "User not found")
      }

      req.user = user
      next()
    } catch (error) {
      throw new ApiError(401, "Token failed", error)
    }
  } else {
    throw new ApiError(401, "Unauthorized request")
  }
})
