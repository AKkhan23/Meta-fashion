import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { virtualTry } from "../controllers/virtualTryController.js"
import upload from "../middlewares/fileUploadMiddleware.js"


const router = express.Router()


router.post("/", protect.forAuthUsers, upload.single('person_url'), virtualTry)


export default router