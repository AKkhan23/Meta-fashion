import multer from "multer"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Root uploads (project root) — works regardless of cwd (npm run dev from root vs server)
const uploadDir = path.resolve(__dirname, "../../uploads")
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
const serverUploadDir = path.resolve(__dirname, "../uploads")
if (!fs.existsSync(serverUploadDir)) fs.mkdirSync(serverUploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure dir exists at request time (handles deleted folder)
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop() || 'jpg'
        cb(null, `product-${crypto.randomUUID()}.${ext}`)
    }
})



const upload = multer({ storage: storage })


export default upload