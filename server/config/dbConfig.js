import mongoose from "mongoose";
import colors from "colors";

const connectDB = async (retries = 3) => {

    // Support both MONGO_URI and MONGODB_URI (Karzone uses MONGODB_URI)
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!mongoUri) {
        console.log(`DB CONNECTION FAILED : MONGO_URI/MONGODB_URI not defined in .env`.bgRed.white)
        console.log(`Hint: Create .env from .env.example at project root AND server/.env`.yellow)
        return
    }

    // Mask password in logs
    const maskedUri = mongoUri.replace(/:\/\/.*@/, '://***:***@')
    console.log(`Attempting DB connection to ${maskedUri} ...`.cyan)

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const conn = await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000,
            })
            console.log(`DB CONNECTION SUCCESS : ${conn.connection.name} @ ${conn.connection.host}`.bgGreen.black)
            // Log connection events
            mongoose.connection.on('error', err => console.log(`DB runtime error: ${err.message}`.bgRed.white))
            mongoose.connection.on('disconnected', () => console.log(`DB disconnected`.yellow))
            return
        } catch (error) {
            console.log(`DB CONNECTION FAILED (attempt ${attempt}/${retries}) : ${error.message}`.bgRed.white)
            if (error.message.includes('whitelist') || error.message.includes('Atlas') || error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
                console.log(`Hint: Atlas IP whitelist - add 0.0.0.0/0 in Network Access, or add your current IP. Also check querySrv ECONNREFUSED => use non-SRV mongodb:// with replicaSet (already in .env)`.yellow)
            } else {
                console.log(`Hint: Check MONGO_URI in .env - for local use mongodb://127.0.0.1:27017/libasmitr (needs MongoDB running) or use Atlas URI`.yellow)
            }
            if (attempt < retries) {
                const delay = attempt * 2000
                console.log(`Retrying in ${delay}ms...`.yellow)
                await new Promise(r => setTimeout(r, delay))
            } else {
                console.log(`All DB connection attempts failed. Server will stay up but DB operations will fail.`.bgRed.white)
            }
        }
    }

}


export default connectDB