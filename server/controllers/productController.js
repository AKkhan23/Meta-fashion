import Product from "../models/productModel.js"
import mongoose from "mongoose"

const getProducts = async (req, res) => {
    // Fail fast if DB not connected - prevents hanging on querySrv timeout
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ message: "DB not connected. Check MONGO_URI and Atlas IP whitelist." })
    }
    let products = await Product.find()

    if (!products) {
        res.status(404)
        throw new Error("Products Not Found!")
    } else {
        res.status(200).json(products)
    }
}

const getProduct = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ message: "DB not connected. Check MONGO_URI and Atlas IP whitelist." })
    }
    let product = await Product.findById(req.params.pid)

    if (!product) {
        res.status(404)
        throw new Error("Product Not Found!")
    } else {
        res.status(200).json(product)
    }
}


const productController = { getProduct, getProducts }


export default productController