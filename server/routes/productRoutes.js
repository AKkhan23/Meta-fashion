import express from "express"

// Local Imports
import productController from "../controllers/productController.js"
import reviewRoute from "./reviewRoutes.js"

const router = express.Router({ mergeParams: true })

// Add Product Id
const addProductId = (req, res, next) => {
    req.product = req.params.pid
    next()
}



router.get("/", productController.getProducts)
router.get("/:pid", addProductId, productController.getProduct)




router.use("/:pid/review", addProductId, reviewRoute)


export default router