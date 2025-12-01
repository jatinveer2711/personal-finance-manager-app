import mongoose from "mongoose";
const userSchema  = new  mongoose.Schema({
    
        firstName: {
            type:String,
            required:[true,"please enter your first namme"]
        },
        lastName: {
            type:String,
        required:[true,"please enter your lastname"] 
    },


        email:{
            type:String,
            required:[true,"please enter your email"]
        },
        password:{
            type:String,
            required:[true,"please enter your password"],
        },

   
    },
    {timestamps:true}
)
export default mongoose.model("User",userSchema)