import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { handleBooking } from "../redux/tableBooking"


const useBooking = () => {
    const dispatch = useDispatch()
    const tableBooking = useSelector(state => state.tableBooking)
    const launch = useSelector(state => state.launch)
    const token = launch.token
    const [modalTitle, setModalTitle] = useState('')
    const [modalErrorMessage, setModalErrorMessage] = useState('')
    const [otpReferenceId, setOtpReferenceId] = useState('')
    const [otpExpiryDuration, setOtpExpiryDuration] = useState(0)
    const [ContactNo, setContactNo] = useState('')
    const [loggedIn, setLoggedIn] = useState(tableBooking.loggedIn)

    useEffect(() => {  
   
         if (tableBooking.tableData) {
             const bkng = tableBooking.tableData   
             setContactNo(bkng.ContactNo) 
             } 
         if (tableBooking.loggedIn) {  
             setLoggedIn(tableBooking.loggedIn) 
         } 
           
}, [tableBooking.tableData, tableBooking.loggedIn])

const otpHandler = () => {
          
  // GET 'https://dev.lucidits.com/LUCIDAPI/V1/SendOTP?OTPFor=4&MobileNo=9738854149'
  if ((!loggedIn && ContactNo)) axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/SendOTP`,
  { 
   params:{
     OTPFor:4,
     MobileNo:ContactNo
   },
 headers: { Authorization: `Bearer ${token}`},
 "Content-Type": "application/json"
 } 
).then((response) => { 
 //setOTPRefernceData(response.data.response)
console.log(response.data.response)
 setOtpReferenceId(response.data.response.otpReferenceId)
 setOtpExpiryDuration(Number(response.data.response.otpExpiryDuration * 60000))
 
})     
}
    
    const contactHandler = (no) => {       
        //  if (ContactNo.length !== 10) {
               console.log(no)
          if (no.length !== 10 && ContactNo.length !== 10) {
           setModalErrorMessage('Kindly Enter Valid Mobile No')
          // modalErrorRef.current = 'Kindly Enter Valid Mobile No'
             // setModalError(!modalError)
        
             // setContactNo(contactNoRef.current)
          }else {
            console.log(modalTitle)
            if (modalTitle === 'Your Contact No' && !ContactNo) {
                        setContactNo(no) 
                        dispatch(handleBooking({...tableBooking.tableData, ContactNo:no}))
                        otpHandler() 
                      } 
                setModalErrorMessage('') 
                  otpHandler() 
                  setModalTitle('OTP') 
              
         }    
     }

    

       return {contactHandler, otpHandler, otpExpiryDuration, otpReferenceId, modalTitle, setModalTitle, modalErrorMessage}

}

export default useBooking