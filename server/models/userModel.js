import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Email"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Please Enter Phone"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"]
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    address: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        default: 5,
        required: true
    }
}, {
    timestamps: true
})


const User = mongoose.model("User", userSchema);

export default User

