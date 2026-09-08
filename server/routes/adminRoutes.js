import express from "express"

// local imports
import adminControllers from "../controllers/adminController.js"
import protect from "../middlewares/authMiddleware.js"
import upload from "../middlewares/fileUploadMiddleware.js"

const router = express.Router()

// For Users
router.get("/users", protect.forAdmin, adminControllers.getAllUsers)
router.put("/users/:uid", protect.forAdmin, adminControllers.updateUser)

// For Products
router.post("/product/add", protect.forAdmin, upload.single("image"), adminControllers.addProduct)
router.put("/product/:pid", protect.forAdmin, adminControllers.updateProduct)

// For Order
router.get("/orders", protect.forAdmin, adminControllers.getAllOrders)
router.put("/order/:oid", protect.forAdmin, adminControllers.updateOrder)

// For Reviews
router.get("/reviews", protect.forAdmin, adminControllers.getAllReviews)

// For Coupon
router.get("/coupon", protect.forAdmin, adminControllers.getCoupons)
router.post("/coupon/add", protect.forAdmin, adminControllers.createCoupon)

export default router