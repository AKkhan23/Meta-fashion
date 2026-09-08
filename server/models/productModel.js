import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        originalPrice: {
            type: Number,
            required: true
        },
        salePrice: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        // Cropped garment-only image for 3D try-on (torso/chest crop, no face/background)
        // Sidebar thumbnails still use `image` (full photo); 3D texture uses `tryOnImage`/`tryOnTexture` if present
        tryOnImage: {
            type: String,
            default: ""
        },
        tryOnTexture: {
            type: String,
            default: ""
        },
        garmentShape: {
            type: String,
            enum: ["tshirt", "jacket", "hoodie", "dress", "shirt", "saree"],
            default: "tshirt"
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        },
        size: {
            type: String,
            enum: ["sm", "md", "lg", "xl", "2xl", "3xl"],
            required: true
        },
        model3d: {
            type: String,
            default: ""
        }
    }
    , {
        timestamps: true
    }
)


const Product = mongoose.model("Product", productSchema)


export default Product