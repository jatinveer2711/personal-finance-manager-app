import express from 'express'
import {  getWeeklyTransactions}  from "../controllers/weekly.controller.js";
import {protect} from '../middleware/middleware.js'
const router = express.Router()

router.get('/getWeekly',protect,getWeeklyTransactions)
export default router;