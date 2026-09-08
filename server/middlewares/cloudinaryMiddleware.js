import { v2 as cloudinary } from 'cloudinary';
import fs from "node:fs"
import dotenv from "dotenv";
dotenv.config();


// Configuration - use env vars, fallback to demo helper cloud only for base64 path
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dqdejbfnx'
cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});




const isDemoCreds = () => {
    const key = process.env.CLOUDINARY_API_KEY
    const secret = process.env.CLOUDINARY_API_SECRET
    return !key || !secret || key === 'demo' || secret === 'demo' || key.includes('your_')
}

const uploadToCloudinary = async (fileLink) => {
    // If demo/invalid creds, skip cloudinary entirely and use base64
    if (isDemoCreds()) {
        console.log("Cloudinary demo creds detected - using base64 fallback directly")
        if (!fs.existsSync(fileLink)) throw new Error(`File not found: ${fileLink}`)
        const fileData = fs.readFileSync(fileLink)
        const base64 = fileData.toString('base64')
        const ext = fileLink.split('.').pop().toLowerCase()
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
        return { secure_url: `data:${mime};base64,${base64}` }
    }

    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(
            fileLink, {
            resource_type: "auto"
        }
        )
        return uploadResult
    } catch (error) {
        console.log("Cloudinary upload failed:", error.message);
        // Fallback for transient failures: return base64 data URI so Replicate can still use it
        try {
            if (fs.existsSync(fileLink)) {
                const fileData = fs.readFileSync(fileLink)
                const base64 = fileData.toString('base64')
                // Guess mime from extension
                const ext = fileLink.split('.').pop().toLowerCase()
                const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
                console.log("Using base64 fallback for human_img")
                return { secure_url: `data:${mime};base64,${base64}` }
            }
        } catch (e) {
            console.log("Fallback also failed:", e.message)
        }
        // Don't delete here, let controller handle cleanup
        throw error
    }

}


export default uploadToCloudinary