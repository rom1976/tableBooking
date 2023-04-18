// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
const initialUser = () => {
  const item = window.sessionStorage.getItem('userData')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser()
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload 
      sessionStorage.setItem('userData', JSON.stringify(action.payload)) 
    },
    handleLogout: state => {
      state.userData = {} 
      // ** Remove user, accessToken & refreshToken from sessionStorage
      sessionStorage.removeItem('userData')
    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer
