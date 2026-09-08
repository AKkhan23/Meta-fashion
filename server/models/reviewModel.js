import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        default: 1,
        required: true
    },
    text: {
        type: String,
        required: [true, "Please Add Review"]
    },
    isVerifiedBuyer: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

const Review = mongoose.model("Review", reviewSchema)

export default Review