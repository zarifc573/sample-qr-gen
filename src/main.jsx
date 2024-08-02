import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Main from './pages/Main.jsx'
import User from './pages/User.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import { Provider } from 'react-redux';
import store from './store.jsx';
import './index.css'
import Verification from './pages/Verification.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
  },
  {
    path: "/sign-up",
    element: <SignUp/>,
  },
  {
    path: "/login",
    element: <SignIn/>,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword/>,
  },
  {
    path: "/profile",
    element: <User/>,
  },
  {
    path: "/verification",
    element: <Verification/>,
  },

 
  
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
</Provider>
  </React.StrictMode>,
)
