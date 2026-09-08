import express from "express"
import authController from "../controllers/authController.js"

const router = express.Router()

const { registerUser, loginUser } = authController

router.post("/register", registerUser)
router.post("/login", loginUser)

export default router