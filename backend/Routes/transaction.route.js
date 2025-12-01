import express from 'express';
import { getAllTransaction,deleteTransaction,updateTransaction,addTransaction, searchFilter } from '../controllers/Transaction.controller.js';
import {protect} from '../middleware/middleware.js'

const router = express.Router()

router.post('/addTransaction',protect,addTransaction);
router.get('/getAll',protect,getAllTransaction);
router.put('/update/:id',protect,updateTransaction);
router.delete('/delete/:id',protect,deleteTransaction);
router.get('/search',protect,searchFilter)
export default router;