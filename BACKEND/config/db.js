import mongoose from "mongoose"
import dotenv from "dotenv"

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connected successfully");
    } catch(error) {
        console.log("Database connection error:", error)
    }
}

export default connectDb;