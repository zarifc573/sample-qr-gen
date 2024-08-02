
import { useState, useEffect } from 'react';
import { GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch } from 'react-redux';
import { setClientLoginInfo } from '../redux/UserSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorEmail, setErrEmail] = useState('');
  const [errorPassword, setErrPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [incorrect, setIncorrect] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const clientLoginInfo = localStorage.getItem('clientLoginInfo');
      if (clientLoginInfo) {
        dispatch(setClientLoginInfo(JSON.parse(clientLoginInfo)));
      }
    }
  }, [dispatch]);

  const googleProvider = new GoogleAuthProvider();
  const microsoftProvider = new OAuthProvider('microsoft.com');

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail('');
    setIncorrect('');
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword('');
    setIncorrect('');
  };

  const signUpBtn = async () => {
    if (!email) {
      setErrEmail('The email address must include @');
    } else {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setErrEmail('You have entered an invalid email address!');
      }
    }

    if (!password) {
      setErrPassword('Enter your password');
    }

    if (email && password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          if (user.emailVerified) {
            dispatch(setClientLoginInfo(user));
            localStorage.setItem('clientLoginInfo', JSON.stringify(user));
            alert('Login successfully done!');

            setTimeout(() => {
              navigate('/profile');
              setEmail('');
              setPassword('');
            }, 1000);
          } else {
            setVerifyMessage('Please verify your email before logging in.');
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === 'auth/invalid-credential') {
            setIncorrect('Incorrect email or password');
            setForgotPassword('Forgot password');
          } else {
            setIncorrect('An error occurred. Please try again.');
            setForgotPassword('Forgot password');
          }
        });
    }
  };

  const googleClick = async () => {
    await signInWithPopup(auth, googleProvider)
      .then(() => {
        navigate('/profile');
        console.log('Google sign-in successful');
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  };

  const microsoftClick = async () => {
    await signInWithPopup(auth, microsoftProvider)
      .then(() => {
        navigate('/profile');
        console.log('Microsoft sign-in successful');
      })
      .catch((error) => {
        console.error(error);
        alert(error.message);
      });
  };

  const clickForgot = () => {
    navigate('/forgotPassword');
  };

  return (
    <div className='flex justify-center'>
      <div className='flex flex-col items-center w-full max-w-md px-4 py-6 bg-white shadow-md rounded-lg mt-10 md:mt-20'>
        <h1 className='font-sans font-bold text-[#11175D] text-[18px] lg:text-[35px] text-center'>Login to your account!</h1>
        <div className='flex flex-col items-center justify-center gap-5 mt-6 w-full'>
          <div className="flex items-center justify-center py-[22px] border-[1px] border-[#03014C]-[0.3] w-full max-w-sm rounded-[8.34px] cursor-pointer" onClick={googleClick}>
            <FcGoogle className='w-[20px] h-[20px]' />
            <p className='ml-[10px]'>Login with Google</p>
          </div>
          <div className="flex items-center justify-center py-[22px] border-[1px] border-[#03014C]-[0.3] w-full max-w-sm rounded-[8.34px] cursor-pointer mt-[10px]" onClick={microsoftClick}>
            <FcGoogle className='w-[20px] h-[20px]' />
            <p className='ml-[10px]'>Login with Microsoft</p>
          </div>
        </div>

        {verifyMessage && (
          <p className="leading-[20px] mt-[20px] text-center bg-[#ffdce0] py-[10px] border-red-200 border-[1px] text-[18px] font-nunito font-semibold text-red-400 w-full max-w-sm">{verifyMessage}</p>
        )}

        {incorrect && (
          <p className="leading-[20px] mt-[20px] text-center bg-[#ffdce0] py-[10px] border-red-200 border-[1px] text-[18px] font-nunito font-semibold text-red-400 w-full max-w-sm">{incorrect}</p>
        )}

        <div className="mt-[62px] relative w-full max-w-sm">
          <input
            placeholder='Youraddress@email.com'
            type="email"
            onChange={handleEmail}
            className=' py-[20px]  border-b-[2px] outline-0 text-[#11175D] border-[#11175D] border-opacity-[0.3] placeholder:text-[#03014C] placeholder:font-semibold placeholder:text-opacity-[0.4] placeholder:text-[20px] w-full'
          />
          {errorEmail && <p className='leading-[20px] font-nunito font-semibold text-red-500'>{errorEmail}</p>}
          <p className='bg-white absolute top-[-10px] left-[0]'><span className='text-[#11175D] font-nunito text-[14px] font-semibold tracking-[1px] opacity-[0.7]'>Email Address</span></p>
        </div>

        <div className="mt-[54px] relative w-full max-w-sm">
          <input
            placeholder='Enter your password'
            type={showPassword ? 'text' : 'password'}
            onChange={handlePassword}
            className='py-[20px] pr-[65px] border-b-[2px] outline-0 text-[#11175D] border-[#11175D] border-opacity-[0.3] placeholder:text-[#03014C] placeholder:font-semibold placeholder:text-[20px] placeholder:text-opacity-[0.4] w-full'
          />
          {errorPassword && <p className='leading-[20px] font-nunito font-semibold text-red-500'>{errorPassword}</p>}
          <p className='bg-white absolute top-[-10px] left-[0]'><span className='text-[#11175D] font-nunito text-[14px] font-semibold tracking-[1px] opacity-[0.7]'>Password</span></p>
          {showPassword ? (
            <AiFillEye onClick={() => { setShowPassword(!showPassword) }} className='absolute top-[17px] text-[#B3B3C9] select-none right-[30px] cursor-pointer text-[26px]' />
          ) : (
            <AiFillEyeInvisible onClick={() => { setShowPassword(!showPassword) }} className='absolute top-[17px] text-[#B3B3C9] select-none cursor-pointer right-[30px] text-[26px]' />
          )}
          {forgotPassword && <p onClick={clickForgot} className='mt-[35px] text-red-400 font-sans text-[16px] font-normal cursor-pointer'>{forgotPassword}</p>}
        </div>
        <div className="select-none mt-[52px] w-full max-w-sm pb-[50px]">
          <div onClick={signUpBtn} className='text-center bg-gray-800 py-[20px] bg-primary text-cyan-400 rounded-[8.5px] border-[1px] border-primary hover:border-[1px] hover:bg-black hover:text-primary cursor-pointer duration-500'>
            <p className='font-semibold text-[20px] font-nunito select-none'>Login to Continue</p>
          </div>
          <p className='text-left mt-[35px] text-[#03014C] font-sans text-[13px] font-normal'>Don’t have an account? <span className='text-[#EA6C00] text-[13px] font-sans font-bold cursor-pointer'><Link to='/sign-up'>Sign up</Link></span></p>
        </div>
      </div>
    </div>
  );
}
