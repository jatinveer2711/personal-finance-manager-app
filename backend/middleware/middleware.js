import jwt from 'jsonwebtoken';
// import User from '../Models/User.model.js';
import dotenv from 'dotenv';
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Access denied "})
    }
    const token =  authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"no token is provided"})
    }
    try {
       const decoded = jwt.verify(token,JWT_SECRET)
       req.user = {_id:decoded.id};
       next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({message:error.message})
        
    }
}