import mongoose from "mongoose"
const mongoURI=process.env.DB_URL;
export const connectDb=async()=>{
    await mongoose.connect(mongoURI);

    console.log("DB connetced")
}