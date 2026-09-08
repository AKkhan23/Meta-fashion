import mongoose from "mongoose";

const coupanSchema = new mongoose.Schema({

    coupanCode: {
        type: String,
        unique: true,
        required: [true, "Please Type Coupan"]
    },
    coupanDiscount: {
        type: Number,
        required: [true, "Please Enter % of Coupan"]
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }

}, {
    timestamps: true
})


const Coupan = mongoose.model("Coupan", coupanSchema)

export default Coupan