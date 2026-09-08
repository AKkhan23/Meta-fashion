import express from "express"
import reviewController from "../controllers/reviewController.js"
import protect from "../middlewares/authMiddleware.js"


const router = express.Router()

router.get("/", reviewController.getReviews)
router.get("/:rid", reviewController.getReview)
router.post("/", protect.forAuthUsers, reviewController.addReview)



export default router