// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
// const initialUser = () => {
//  const item = window.localStorage.getItem('userData')
//  //** Parse stored json or if none return initialValue
//  return item ? JSON.parse(item) : {}
// }

      export const sendOTP = createAsyncThunk('modals/sendOTP', async (obj) => {
        const res = await axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/SendOTP`,
        { 
         params:{
           OTPFor:4,
           MobileNo:obj.ContactNo || obj.contactNoRef
         },
         headers: { Authorization: `Bearer ${obj.token}`},
         "Content-Type": "application/json"
       } 
      ).then((response) => { 
       //setOTPRefernceData(response.data.response)
       console.log(response.data.response)
     //  setOtpReferenceId(response.data.response.otpReferenceId)
     //  setOtpExpiryDuration(Number(response.data.response.otpExpiryDuration * 60000))
          return response.data.response
      })   
          
      return res 
      })
 
export const modalSlice = createSlice({
  name: 'modals',
  initialState: {
    modalTitle: '',
    otpData:''
  },
  reducers: {
    handleModalTitle: (state, action) => {
      state.modalTitle = action.payload 
      console.log(action.payload)
   //   localStorage.setItem('userData', JSON.stringify(action.payload)) 
    }
  },
    extraReducers: builder => {
      builder
        .addCase(sendOTP.fulfilled, (state, action) => {
          state.otpData = action.payload
          console.log(action.payload)   
         // state.bookmarks = action.payload.bookmarks
        })
      }
      
   })

export const { handleModalTitle } = modalSlice.actions

export default modalSlice.reducer
