import React from 'react';
import { CgProfile } from "react-icons/cg";
import { IoMdNotificationsOutline } from "react-icons/io";
import Input from '../Input';



const Header = () => {
  return (
    <header className='bg-white   px-3 py-2'>
      <div className='flex items-center'>
        {/* Search bar */}
        <div>
          <Input className="border-[1px] pl-8 rounded-md px-[5px] py-[3px]" />
        </div>
        
        {/* Header menus */}
        <div className="flex justify-end gap-5 w-full   ">
        {/* Notification */}
            <div className='relative mt-2'>
                <span className=''>
                  <IoMdNotificationsOutline className='text-xl' />
                </span>
                <span className='w-5 p-2 h-5 flex justify-center items-center text-white bg-red-600 rounded-full absolute -top-2 -right-2'>2</span>
            </div>
          
        {/* Avatar */}
            <div className='hover:bg-gray-100 select-none w-34 rounded-md px-3 py-2'>
            <div className=' flex  gap-3 items-center'>
              <CgProfile className='text-2xl' />
              <h2 className='text-sm font-bold'>Md Yousuf</h2>
            </div>
            </div>
        </div>
      
      </div>
       </header> 
  )
}

export default Header;