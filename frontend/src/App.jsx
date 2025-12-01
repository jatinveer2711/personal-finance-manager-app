import React from 'react'
import Signup from './pages/signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import {  Routes ,Route } from 'react-router-dom';

export default function App() {
  return (
    
      <Routes>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route path='/' element={<Dashboard></Dashboard>}></Route>
      </Routes>
    
  )
}
