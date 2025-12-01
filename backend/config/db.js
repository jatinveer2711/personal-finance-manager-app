import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const MONGO = process.env.MONGO_URI

 const connectDB = async()=>{
    try{
       const conn = await mongoose.connect(MONGO)
       console.log('MongoDb connected sucessfully')
    }catch(error){
        console.log({message:error.message})
    }
}
export default connectDB