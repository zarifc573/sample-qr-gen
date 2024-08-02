"use client"
import React, { useState } from 'react'
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from 'react-router-dom';

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const [errorEmail,setErrEmail]=useState('')
    const [errorEmail2,setErrEmail2]=useState('')

    const handleEmail = (e) => {
    
        setEmail(e.target.value)
        setErrEmail('')
        setErrEmail2('')
      }

    const resetClick = () => {
sendPasswordResetEmail(auth, email)
    .then(() => {
        console.log('password');
      setErrEmail('')
      setErrEmail2('')
      setEmail('')
      alert('Please check your mail!')
  })
  .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);
  });
      if (!email) {
        setErrEmail('Please fill out this field')
        
      }
      else {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
          setErrEmail2('You have entered an invalid email address!')
         
        }
      }
    
}

    
  return (
      <div className='bg-gray-600 h-screen pt-10'>
           
              <div className='text-center '>
              <h3 className="text-center text-[#03014C] font-sans text-[36px] font-semibold">Forgot password?</h3>
              <div className="">
          {/* <p className="">{errorEmail}</p> */}
          {
            errorEmail &&
            <p className="leading-[20px] mt-[30px] text-center bg-[#ffdce0] py-[10px] border-red-200 border-[1px] text-[18px] font-nunito font-semibold text-red-400 w-[410px] mx-auto mb-[-30px]">{errorEmail}</p>
          }
          {
            errorEmail2 &&
            <p className="leading-[20px] mt-[30px] text-center bg-[#ffdce0] py-[10px] border-red-200 border-[1px] text-[18px] font-nunito font-semibold text-red-400 w-[410px] mx-auto mb-[-30px]">{errorEmail2}</p>
          }
        <input onChange={handleEmail} value={email} type="text" className="mt-[50px] py-[16px] pl-[20px] pr-[200px] outline-none bg-[#fff3dc57] placeholder:text-black" placeholder='Enter your email' />
        </div>
        <div className="flex items-center justify-center gap-x-[10px] mt-[20px]">
        <button onClick={resetClick} className="text-center py-[16px] bg-primary text-white rounded-[8.5px] border-[1px] border-primary hover:border-[1px] hover:border-primary px-[30px] hover:bg-black hover:text-primary cursor-pointer duration-300">
          <p className='font-semibold text-[20px] font-nunito'>Reset password</p>
        </button>
        <div className="">
          <p className='font-semibold text-primary text-opacity-[0.7] text-[20px] text-white font-nunito cursor-pointer border-[1px] border-primary px-[30px] py-[16px] rounded hover:bg-black hover:text-primary  duration-300'><Link to='/login'>Back to log in</Link></p>
        </div>
        </div>
       </div>
      

    </div>
  )
}

export default ForgotPassword