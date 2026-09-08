import fs from "node:fs"
import Replicate from "replicate";
import User from "../models/userModel.js";
import uploadToCloudinary from "../middlewares/cloudinaryMiddleware.js";


const getReplicate = () => {
    const token = process.env.REPLICATE_API_TOKEN
    if (!token) throw new Error("REPLICATE_API_TOKEN is not set in .env")
    return new Replicate({ auth: token })
}


export const virtualTry = async (req, res, next) => {

    try {
        const { cloth_url, garment_des } = req.body

        if (!req.file) {
            res.status(400)
            throw new Error("Please upload a person photo (person_url)")
        }

        if (!cloth_url || !garment_des) {
            res.status(400)
            throw new Error("Please Enter All Details! (cloth_url, garment_des required)")
        }

        //   Upload To Cloudinary (or base64 fallback if Cloudinary demo creds)
        let imagePath
        try {
            imagePath = await uploadToCloudinary(req.file.path)
        } finally {
            // Always cleanup temp file
            try {
                if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
            } catch (e) {
                console.log("Cleanup unlink failed:", e.message)
            }
        }

        if (!imagePath || !imagePath.secure_url) {
            res.status(500)
            throw new Error("Image upload failed - check Cloudinary credentials or use base64 fallback")
        }


        // Check if user have credits
        let user = await User.findById(req.user._id)

        if (!user) {
            res.status(401)
            throw new Error("User not found")
        }

        if (user.credits <= 0 || user.credits == null) {
            res.status(403)
            throw new Error("Not Enough Credits - please contact admin")
        }

        const input = {
            garm_img: cloth_url,
            human_img: imagePath.secure_url,
            garment_des: garment_des
        };


        const replicate = getReplicate()
        const output = await replicate.run(
            "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
            { input }
        );

        // Normalize output - replicate SDK v1 returns string, FileOutput, Blob, or array
        let outputUrl = null
        if (typeof output === 'string') outputUrl = output
        else if (Array.isArray(output) && output.length > 0) {
            const first = output[0]
            outputUrl = typeof first === 'string' ? first : (first?.url?.() || first?.url || String(first))
        }
        else if (output && typeof output.url === 'function') outputUrl = output.url()
        else if (output?.url) outputUrl = output.url
        else outputUrl = String(output)

        if (!outputUrl || outputUrl === '[object Object]') {
            throw new Error(`Replicate returned unexpected output: ${JSON.stringify(output).slice(0, 500)}`)
        }

        // Subtract Credits atomically and return new value
        const updatedUser = await User.findByIdAndUpdate(user._id, { $inc: { credits: -1 } }, { new: true })


        res.json({
            success: true,
            credits: updatedUser.credits,
            output_url: outputUrl
        })

    } catch (error) {
        // Preserve real error message instead of generic one
        console.error("VirtualTry error:", error.message)
        // If status not already set, default to 500
        if (!res.statusCode || res.statusCode < 400) res.status(500)
        // Pass to errorHandler with original message + hint
        return next(new Error(error.message || "Currently Virtual Try Is Not Available"))
    }


}


