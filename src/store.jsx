import { configureStore } from '@reduxjs/toolkit'
import  clientSlice  from './redux/UserSlice'



export default configureStore({
  reducer: {
    clientLoginInfo: clientSlice,
  }
})