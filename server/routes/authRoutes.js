import express from "express"
import authController from "../controllers/authController.js"
import protect from "../middlewares/authMiddleware.js"

const router = express.Router()

const { registerUser, loginUser, getMe } = authController

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/me", protect.forAuthUsers, getMe)

export default router