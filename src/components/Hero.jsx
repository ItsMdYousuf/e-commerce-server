import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return ( 
    <div className='flex flex-col justify-center items-center h-screen'>
        <h1 className='text-4xl font-semibold'>Welcome to E-Commerce Server side.</h1>
        <Link to="/dashboard" className='bg-sky-400 mt-10 px-5 py-2 rounded-lg shadow-xl text-white capitalize'>go to dashboard</Link>
  
    </div>
  )
}

export default Hero 