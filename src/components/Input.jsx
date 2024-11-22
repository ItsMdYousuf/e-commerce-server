import React from 'react';
import { GoSearch } from "react-icons/go";

const Input = (Children) => {
   const {className, type, onClick, onChange, placeholder} = Children
   return ( 
      <>
         <div className='relative  inline-block'>
            <input placeholder={placeholder} className={`${className} hover:border-blue-200 focus:border-blue-400  outline-none`} type={type} onClick={onClick} onChange={onChange} />
            <span  className='absolute top-2 left-2'><GoSearch /></span>
         </div>
   </>
   )
}

export default Input