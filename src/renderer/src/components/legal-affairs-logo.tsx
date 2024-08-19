import React from 'react'
import LogoIcon from './icons/logo-icon'
export default function YemenLogo({ className = '', ...props }) {
  return (
    <div className="w-full h-full  ">
      <div className="w-full h-[100%] flex justify-center items-center">
        <div className="relative aspect-video ">
          <LogoIcon />
        </div>
      </div>
      <div className="w-full h-[50%]">
        <div className="font-bold text-white text-center">
          <h2 className="text-[40px]">مكتب الشؤون القانونية</h2>
          <h2 className="text-[24px]">محافظة حضرموت</h2>
        </div>
      </div>
    </div>
  )
}
