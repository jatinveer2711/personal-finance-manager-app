import User from "../Models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"1d"
    })
}

//singup function

export const signUp = async(req,res)=>{
    try {
        const {firstName,lastName,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
           return res.status(400).json({message:"user already exists"})
        }
        const hashedPassword  = await bcrypt.hash(password,12);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
        })
         return res.status(201).json({user})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
};

//login function 

export const login = async(req,res)=>{
    try {
        const{email,password} = req.body;

        const existingUser = await User.findOne({email});

        if(!existingUser){
           return res.status(400).json({message:"user not found"})
        }

        const isMatched = await bcrypt.compare(password,existingUser.password);

        if(!isMatched){
          return  res.status(400).json({message:"invalid password"})
        };

       return res.status(200).json({message:"login successfully",

        token:generateToken(existingUser._id),
        _id:existingUser._id,
        name:`${existingUser.firstName} ${existingUser.lastName}`,
        email:existingUser.email})
        
    } catch (error) {
        console.log(error)
       return res.status(500).json({message:error.message})
    };
};


// logout function

export const logout = async(req,res)=>{
    try {
        res.status(200).json({message:"logout successfull"}
        )
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}