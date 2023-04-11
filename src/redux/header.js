// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
 
const initialUser = () => {
  const item = window.localStorage.getItem('userData')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}
const initialHeader = () => {
    const item = window.localStorage.getItem('headerData')
    //** Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : {}
  }


export const authSlice = createSlice({
  name: 'header',
  initialState: {
    userData: initialUser(),
    headerData:initialHeader()
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload 
      localStorage.setItem('userData', JSON.stringify(action.payload))  
    },
    handleLogout: state => {
      state.userData = {}
     
      localStorage.removeItem('userData')
      
    },
    headerUpdate: (state, action) => {
       state.headerData = action.payload
       localStorage.setItem('headerData', JSON.stringify(action.payload))  
    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer
