
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setClientLoginInfo, clearClientLoginInfo } from '../redux/UserSlice';
import { auth } from '../../firebase';
import FormComponent from '../components/ScannerAndForm';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector(state => state.clientLoginInfo.clientInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          dispatch(setClientLoginInfo(user));
          localStorage.setItem('clientLoginInfo', JSON.stringify(user));
        } else {
          navigate('/verification');
        }
      } else {
        dispatch(clearClientLoginInfo());
        localStorage.removeItem('clientLoginInfo');
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="">
        <div className="">
          Main
          <FormComponent/>
          </div>
      </div>
    </div>
  );
};

export default User;
