import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

let isConnected = false

const ConnectDB = async () => {
    if (!isConnected) {
        try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log("Connected")
            isConnected = true
        } catch (error) {
            console.log(`Cant Connect To DB ${error}`)
        }
    }
    else {
        console.log("Connected")
    }
}

export default ConnectDB