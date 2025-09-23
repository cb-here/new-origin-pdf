import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connection established")
    } catch(error){
        console.log("Connection Error: " + error.message)
    }
}