import express from "express"
import colors from "colors"
import dotenv from "dotenv"
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from "./config/dbConfig.js"

// Local Imports
import errorHandler from "./middlewares/errorHandler.js"
import authRoutes from "./routes/authRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import couponRoutes from "./routes/coupanRoutes.js"
import virtualTryRoutes from "./routes/virtualTryRoutes.js"

// Load env from multiple possible locations (root and server folder)
dotenv.config()
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Try also loading from server directory explicitly
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, './.env') })


const app = express()
const PORT = process.env.PORT || 5000

// DB CONNECTION
connectDB()

// Body-Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS - allow Vercel frontend + local dev
const allowedOrigins = [process.env.Frontend_URL, "http://localhost:5173", "http://localhost:3000"].filter(Boolean)
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
    res.header("Access-Control-Allow-Origin", origin || "*")
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")
  if (req.method === "OPTIONS") return res.sendStatus(200)
  next()
})

// Warn if critical env missing
if (!process.env.MONGO_URI) {
  console.log("WARNING: MONGO_URI is not defined in .env - DB connection will fail. Create .env from .env.example".bgRed.white)
}
if (!process.env.JWT_SECRET) {
  console.log("WARNING: JWT_SECRET is not defined - auth will fail".yellow)
}

// Auth Routes
app.use("/api/auth", authRoutes)

// Order Routes
app.use("/api/order", orderRoutes)

// Admin Routes
app.use("/api/admin", adminRoutes)

// Product Routes
app.use("/api/products", productRoutes)

// Cart Routes
app.use("/api/cart", cartRoutes)

// Coupon Routes
app.use("/api/coupon", couponRoutes)


// Virtual Try
app.use("/api/virtual_try", virtualTryRoutes)



// 4. Correct Path Resolution for Nested Folders
// Since this file is in /server, we go UP one level to reach the root, then into /client/dist
const buildPath = path.resolve(__dirname, '../client/dist');

// 5. Static File Serving & SPA Routing
if (process.env.NODE_ENV === "production") {
    // Serve static files from the build directory
    app.use(express.static(buildPath));

    // Express v5 requires a named parameter for wildcards (/*splat)
    app.get('/*splat', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'), (err) => {
            if (err) {
                // If index.html is missing, this provides a clearer error
                res.status(500).send("Build file index.html not found. Ensure you ran 'npm run build' in the client folder.");
            }
        });
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running... (Development Mode)");
    });
}



// Error Handler
app.use(errorHandler)

app.listen(PORT, () => console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue))