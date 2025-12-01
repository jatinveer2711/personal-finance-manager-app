import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './Routes/user.route.js';
import transactionRoute from './Routes/transaction.route.js';  
import weeklyReport from './Routes/weekly.route.js';
connectDB()
dotenv.config();


const app = express();
const port  = process.env.PORT || 4002
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("api is running")
})

app.use('/api/auth',userRoutes)
app.use('/api/auth',transactionRoute)
app.use('/api/auth',weeklyReport)

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})