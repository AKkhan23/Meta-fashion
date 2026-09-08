import express from "express"

// Local Imports
import cartController from "../controllers/cartController.js"
import protect from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", protect.forAuthUsers, cartController.getCart)
router.post("/", protect.forAuthUsers, cartController.addToCart)
router.put("/", protect.forAuthUsers, cartController.updateCart)
router.post("/clear", protect.forAuthUsers, cartController.clearCart)
router.delete("/:productId", protect.forAuthUsers, cartController.removeCart)


export default router