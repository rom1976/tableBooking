import React, { useEffect, useState , Fragment } from "react"
import { useSelector } from "react-redux"
 
import useBooking from "../../Hooks/useBooking";
import BookingDetailsList from "./BookingDetailsList";
 
  
 const BookingDetails = (props) => {
     const x = useBooking()
     const tableBooking = useSelector(state => state.tableBooking) 
     const launch = useSelector(state => state.launch)  
     const [loggedIn, setLoggedIn] = useState(tableBooking.loggedIn)  
     const [modalError, setModalError] = useState(false) 
     const [token, setToken] = useState(launch.outletListData)
         useEffect(() => {
              setLoggedIn(tableBooking.loggedIn)
         }, [tableBooking.loggedIn])

         useEffect(() => {
              if (launch.outletListData.outletList) {
                setToken(launch.outletListData.token)
              }
         }, [launch.outletListData])
         

              return (  
                     <Fragment>  
                         <BookingDetailsList  
                           outletList={launch.outletList} 
                           setModalError={setModalError}
                           modalError={modalError}
                           loggedIn={loggedIn}  
                           token ={token || launch.token}
                         />  
                     </Fragment> 
                 ) 
      }

  // inside FooterADD 
export default BookingDetails