import express from 'express';
import { login, logout, signUp } from '../controllers/User.controller.js';
import { protect }  from '../middleware/middleware.js';
const router = express.Router();

//signup route 

router.post('/signup',signUp)
router.post('/login',login)
router.post('/logout',protect,logout)


export default router;