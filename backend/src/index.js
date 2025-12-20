import dotenv from "dotenv"
import app from "./app/app.js"
import { connectDB } from "./config/db.js"

dotenv.config()
const PORT = process.env.PORT || 3000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`💃 Server is running at port: ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("🩻 MongoDB connection error!", error)
    process.exit(1)
  })
