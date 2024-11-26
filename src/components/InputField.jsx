import React from 'react'

const InputField = ({type, name, value, className, placeholder, onClick, onChange}) => {
  
  return <input name={name} value={value} className={`${className} rounded-lg ring-1 w-auto hover:ring-blue-200 outline-none px-4 py-2 focus:ring-blue-500`} type={type} placeholder={placeholder} onClick={onClick} onChange={onChange} />
}

export default InputField