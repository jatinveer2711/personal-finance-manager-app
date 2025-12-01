import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
// import React from 'react'


export default function Signup() {
    const navigate = useNavigate()
    const [formdata,setFormdata] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        });
    const [error,setError] = useState("");
    const handlechange = (e) =>{
        setFormdata({...formdata,[e.target.name]:e.target.value})
    };
    const handleSumbit = async(e)=>{
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post("http://localhost:5000/api/auth/signup",formdata,{
                
            });
            if(res.status===201){
                alert("signup successfull")
                navigate('/login')
            };
        } catch (error) {
            setError(error.response?.data?.message)
        };
    };
    
  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-300">
        <form onSubmit={handleSumbit} className="bg-white p-6 space-y-4 rounded-2xl w-80 ">
            <h1 className="text-center text-2xl font-bold">Signup</h1>

            <input type="text" 
            name="firstName" 
            placeholder="Please enter your first name"
             value={formdata.firstName} 
             className="w-full p-2 border rounded hover:border-blue-400"
             onChange={handlechange}>

             </input>

            <input type="text"
            className="w-full p-2 border rounded hover:border-blue-400"
             value={formdata.lastName}
             onChange={handlechange}
             name="lastName"
             placeholder="Enter your lastName"
             ></input>

             <input type="email"
             value={formdata.email}
             placeholder="Email"
             name="email"
             onChange={handlechange}
             className="w-full p-2 border rounded hover:border-blue-400"></input>

             <input type="password"
             placeholder="Password"
             name="password"
             value={formdata.password}
             onChange={handlechange}
             className="w-full p-2 border rounded hover:border-blue-400"></input>
             
             <button type="sumbit" className="w-full p-2 border hover:bg-blue-700 rounded bg-blue-500 text-white">Signup</button>
             {error && <p className="text-red-500 text-sm">{error}</p>}
             <p className="mt-3 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
        </form>
      
    </div>
  )
}
