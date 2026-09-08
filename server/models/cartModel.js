import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // One cart per user
        index: true   // Faster queries
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            qty: {
                type: Number,
                required: true,
                min: [1, "Quantity cannot be less than 1"],
                default: 1
            },
            _id: false // Prevents MongoDB from creating _id for subdocuments
        }
    ]
}, {
    timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema)

export default Cart


