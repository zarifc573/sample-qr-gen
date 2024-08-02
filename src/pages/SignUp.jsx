"use client"
import React, { useState } from 'react'
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";
import { auth,db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';


export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [errorEmail,setErrEmail]=useState('')
  const [fullName, setFullName] = useState('')
  const [errorFullName,setErrFullName]=useState('')
  const [password, setPassword] = useState('')
  const [errorPassword,setErrPassword]=useState('')
  const [showPassword,setShowPassword]=useState('')
  // const [registerSuccess,setRegisterSuccess]=useState('')

  const handleEmail = (e) => {
    
    setEmail(e.target.value)
    setErrEmail('')
  }
  const handleFullName = (e) => {
    
    setFullName(e.target.value)
    setErrFullName('')
  }
  const handlePassword = (e) => {
    
    setPassword(e.target.value)
    setErrPassword('')
  }

  
  const signUpBtn = async () => {
    if (!email) {
      setErrEmail('The email address must include @');
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setErrEmail('You have entered an invalid email address!');
    } else {
      setErrEmail('');
    }
  
    if (!fullName) {
      setErrFullName('Enter your name please');
    } else {
      setErrFullName('');
    }
  
    if (!password) {
      setErrPassword('Enter your password');
    } else {
      setErrPassword('');
    }
  
    if (email && fullName && password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await updateProfile(user, {
            displayName: fullName,
          });
          return await sendEmailVerification(user);
        })
        .then(() => {
          console.log('Verification email sent.');
          setEmail('');
          setFullName('');
          setPassword('');
          alert('Verify your email please!')
          setTimeout(() => {
            navigate('/verification');
          }, 1000);
        })
        .catch((error) => {
          const errorCode = error.code;
          let errorMessage = 'An error occurred.';
          switch (errorCode) {
            case 'auth/email-already-in-use':
              errorMessage = 'The email address is already in use.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'The email address is not valid.';
              break;
            case 'auth/weak-password':
              errorMessage = 'The password is too weak.';
              break;
            default:
              errorMessage = error.message;
              break;
          }
          setErrEmail(errorCode.includes('auth/email-already-in-use') ? errorMessage : '');
          setErrFullName(errorCode.includes('auth/invalid-email') ? errorMessage : '');
          setErrPassword(errorCode.includes('auth/weak-password') ? errorMessage : '');
          console.error('Error signing up:', errorMessage);
        });
    }
  };

  const handleSignUp = async (e) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signed up successfully");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className='flex justify-center pb-[100px]'>
    <div className=' flex'>
            <div className='mr-[69px] mt-[140px]'>
            <h1 className='font-nunito font-bold text-[#11175D] text-[35px]'>Get started with easily register</h1>
                <p className='text-[#808080] font-nunito text-[20px] font-normal mt-[26px]'>Free register <span className='opacity-[0.5]'>and</span> you can enjoy it</p>
    
                <div className="mt-[54px] relative">
          <input type="text" value={fullName} onChange={handleFullName
          } className='py-[20px] pl-[30px] pr-[65px] border-[2px] outline-0 text-[#11175D] border-[#11175D] border-opacity-[0.3] rounded-[8.6px]' />

          {
            errorFullName &&
            <p className='leading-[20px] mt-[10px] font-nunito font-semibold text-red-500'>{errorFullName}
            </p>
            
          }

            <p className='bg-white px-[16px] absolute top-[-10px] left-[20px]'><span className='text-[#11175D] font-nunito text-[14px] font-semibold tracking-[1px] opacity-[0.7]'>Full name
          </span></p>
            </div>
                <div className="mt-[62px] relative">
          <input type="email" value={email} onChange={handleEmail} className='py-[20px] pl-[30px] pr-[65px] border-[2px] outline-0 text-[#11175D] border-[#11175D] border-opacity-[0.3] rounded-[8.6px]' />
          {
            errorEmail &&
            <p className='leading-[20px] mt-[10px] font-nunito font-semibold text-red-500'>{errorEmail}
            </p>
            
          }
            <p className='bg-white px-[16px] absolute top-[-10px] left-[20px]'><span className='text-[#11175D] font-nunito text-[14px] font-semibold tracking-[1px] opacity-[0.7]'>Email Address
          </span></p>
          
            </div>
               
                <div className="mt-[54px] relative">
                <input type={showPassword? 'text':'password'} value={password} onChange={handlePassword
          } className='py-[20px] pl-[30px] pr-[65px] border-[2px] outline-0 text-[#11175D] border-[#11175D] border-opacity-[0.3] rounded-[8.6px]' />
          
          {
            errorPassword &&
            <p className='leading-[20px] mt-[10px] font-nunito font-semibold text-red-500'>{errorPassword}
            </p>
            
          }

            <p className='bg-white px-[16px] absolute top-[-10px] left-[20px]'><span className='text-[#11175D] font-nunito text-[14px] font-semibold tracking-[1px] opacity-[0.7]'>Password
          </span></p>
          {showPassword ? <AiOutlineEye onClick={()=>{setShowPassword(!showPassword)}} className='absolute text-[26px] top-[23px] right-[35px] opacity-[0.6] cursor-pointer select-none'></AiOutlineEye>: <AiOutlineEyeInvisible onClick={()=>{setShowPassword(!showPassword)}} className='absolute text-[26px] top-[23px] right-[35px] opacity-[0.6] cursor-pointer select-none'></AiOutlineEyeInvisible>}
          
                </div>
                <div className=" mt-[52px]">
                <div onClick={signUpBtn} className='text-center bg-gray-800 py-[20px] bg-primary text-cyan-400 rounded-[8.5px] border-[1px] border-primary hover:border-[1px]  hover:bg-black hover:text-primary cursor-pointer duration-500'>
                  <p className='font-semibold text-[20px] font-nunito select-none'>Sign up</p>
                </div>
                
                    <p className='text-center mt-[35px] text-[#03014C] font-sans text-[13px] font-normal'>Already  have an account ? <span className='text-[#EA6C00] text-[13px] font-sans font-bold cursor-pointer'><Link href='/login'>Sign In</Link></span></p>
                    </div>
            </div>
    </div>
     
  </div>
  );
}
