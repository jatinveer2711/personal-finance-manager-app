import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";





export default function Login() {

    const [formdata,setFormdata] = useState({
    email:"",
    password:"",
});
const navigate = useNavigate()
const [error,setError] = useState("");
const handlechange=(e)=>{
    setFormdata({...formdata,[e.target.name]:e.target.value})
}

const handleSumbit = async(e)=>{
    e.preventDefault();
    setError("");
    try {
        const res  = await axios.post('http://localhost:5000/api/auth/login',formdata)
        localStorage.setItem("token",res.data.token);
        alert("Login successful");
        navigate('/');
       
    } catch (error) {
        setError(error.response?.data?.message || "login failed")
    }
}
  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-300">
        <form onSubmit={handleSumbit} className="bg-white p-6 space-y-4 rounded-2xl w-80 ">
            <h1 className="text-center text-2xl font-bold">Login</h1>

           

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
             
             <button type="sumbit" className="w-full p-2 border hover:bg-blue-700 rounded bg-blue-500 text-white">Login</button>

             {error && <p className="text-red-500 text-sm">{error}</p>}
             <p className="mt-3 text-center text-sm text-gray-600">
          Create a new account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Signup
          </a>
        </p>
        </form>
      
    </div>
  )
}
