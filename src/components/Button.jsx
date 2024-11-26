import React from 'react'

const Button = ({children, className}) => {
   return <button className={`${className} px-5 py-2 text-white capitalize font-semibold bg-green-500 hover:bg-white hover:text-black transition-all duration-150`}>{children}</button>
}

export default Button