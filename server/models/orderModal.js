import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    ],
    totalBillAmount: {
        type: Number,
        required: true
    },
    isDiscounted: {
        type: Boolean,
        required: true,
    },
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
    },
    status: {
        type: String,
        enum: ["placed", "dispatched", "cancelled", "delivered"],
        default: "placed",
        required: true
    },
    shippingAddress: {
        type: String,
        required: [true, "Please Enter Shipping Address"]
    }

}, {
    timestamps: true
})


const Order = mongoose.model("Order", orderSchema)

export default Order