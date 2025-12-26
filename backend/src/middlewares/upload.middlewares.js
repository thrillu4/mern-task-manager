import multer from "multer"
import ApiError from "../utils/ApiError.js"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

function fileFilter(req, file, cb) {
  const allowedTypes = ["image/jpg", "image/jpeg", "image/png"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new ApiError(401, "Only .jpeg, .png or .jpg formats are allowed"), false)
  }
}

export const upload = multer({ storage, fileFilter })
