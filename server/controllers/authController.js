import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Local Import
import User from "../models/userModel.js"

const registerUser = async (req, res) => {

    // Check If all fields are filled
    const { name, email, phone, password, address } = req.body

    if (!name || !email || !phone || !password || !address) {
        res.status(409)
        throw new Error('Please Fill All Details!')
    }

    // Check if user exist 

    let emailExist = await User.findOne({ email })
    let phoneExist = await User.findOne({ phone })

    if (emailExist || phoneExist) {
        res.status(409)
        throw new Error('User Already Exist!')
    }

    // Check Phone
    if (phone.length !== 10) {
        res.status(409)
        throw new Error('Please Add Valid Phone Number!')
    }


    // Hash Password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt)


    // Create User 
    const user = await User.create({
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
        address: address
    })

    if (!user) {
        res.status(400)
        throw new Error("User Not Created!")
    } else {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin,
            credits: user.credits,
            token: generateToken(user._id)
        })
    }
}

const loginUser = async (req, res) => {
    // Check If all fields are filled
    const { email, password } = req.body

    if (!email || !password) {
        res.status(409)
        throw new Error('Please Fill All Details!')
    }

    // Check if user exist
    let user = await User.findOne({ email })

    // Check Credentials
    if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin,
            credits: user.credits,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid Credentials")
    }

}


// Token Generator
const generateToken = (id) => {
    let token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    return token
}


const authController = {
    registerUser,
    loginUser
}

export default authController