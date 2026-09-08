import express from "express"

// Local Imports
import coupanController from "../controllers/coupanController.js"
import protect from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/", protect.forAuthUsers, coupanController.applyCoupon)


export default router