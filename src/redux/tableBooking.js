// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialBooking = () => {
  const item = window.localStorage.getItem('tableBooking')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

const initialLoggedIn = () => {
  const item = window.localStorage.getItem('loggedIn')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : false
}
const initialGuestList = () => {
  const item = window.localStorage.getItem('guestList')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : false
}
const initialProperty = () => {
  const item = window.localStorage.getItem('property')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : false
}
const initialOutlet = () => {
  const item = window.localStorage.getItem('outlet')
  //** Parse stored json or if none return initialValue
     console.log(JSON.parse(item))
  return item ? JSON.parse(item) : false
}

export const getGuestTotalBooking = createAsyncThunk('tableBooking/getGuestTotalBooking', async (obj) => {
  const res = axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetGuestTotalBooking`, {
                  params:{
                    ContactNo:obj.ContactNo
                  },
                  headers: { Authorization: `Bearer ${obj.token}`},
                   "Content-Type": "application/json"
                  }
                ).then((res) =>{
                  // return {outletDetails :response.data.response.outletDetails, errorCode: response.data.errorCode, message:response.data.message}
                 // console.log(res)
                   return {totalBooking:res.data.response.totalBooking, errorCode: res.data.errorCode, message:res.data.message}
                }) 
                return res
        })

export const getGuestListHandler = createAsyncThunk('tableBooking/getGuestListHandler', async (obj) => {
  const res =   axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetGuestTableBookingList`, {
    params:{
      CurrentPageNumber:1,
      NoOfRowsPerPage:10,
      ContactNo:obj.ContactNo
    },
    headers: { Authorization: `Bearer ${obj.outletList.token || obj.token}`},
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
  
  export const tableSlice = createSlice({
    name: 'tableBooking',
    initialState: {
      tableData: initialBooking(),
      loggedIn:initialLoggedIn(),
      guestList: initialGuestList(),
      guestTotalBooking:'',
      selectedProperty:initialProperty(),
      selectedOutlet:initialOutlet(),
    },
    reducers: {
      handleBooking: (state, action) => {
        state.tableData = action.payload 
        localStorage.setItem('tableBooking', JSON.stringify(action.payload)) 
      },
      handleBookingClear: state => {
        state.tableData = {} 
        // ** Remove user, accessToken & refreshToken from localStorage
        localStorage.removeItem('tableBooking')
      },
      handleLogin: (state, action) => {
         state.loggedIn = action.payload 
          // ** Remove user, accessToken & refreshToken from localStorage
         localStorage.setItem('loggedIn', JSON.stringify(action.payload)) 
      },
      handlePropertySelection: (state, action) => {
           state.selectedProperty = action.payload
           console.log(action.payload)
           localStorage.setItem('property', JSON.stringify(action.payload)) 
      },
      handleOutletSelection: (state, action) => {
        state.selectedOutlet = action.payload
        localStorage.setItem('outlet', JSON.stringify(action.payload)) 
        console.log(action.payload)
       }
     },
     extraReducers: builder => {
      builder
        .addCase(getGuestListHandler.fulfilled, (state, action) => {
          state.guestList = action.payload
          console.log(action.payload)  
          localStorage.setItem('guestList', JSON.stringify(action.payload))  
          // state.bookmarks = action.payload.bookmarks
        })
        .addCase(getGuestTotalBooking.fulfilled, (state, action) => {
          state.guestTotalBooking = action.payload
          console.log(action.payload)  
         // localStorage.setItem('guestList', JSON.stringify(action.payload))  
          // state.bookmarks = action.payload.bookmarks
        })
      }
   })

export const { handleBooking, handleBookingClear, handleLogin, handlePropertySelection, handleOutletSelection } = tableSlice.actions

export default tableSlice.reducer
