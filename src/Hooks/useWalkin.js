import { useEffect, useState } from "react"

import axios from "axios"

const useWalkin = (chInId, tken) => { 
     const [walkingStatusDetails, setWalkingStatusDetails] = useState([])
     const [checkInId, setCheckInId] = useState(chInId)
     const [token, setToken] = useState(tken)
     const launch = JSON.parse(sessionStorage.getItem('paramData'))

     const walkingBookingStatusHandler = () => {
        console.log(checkInId, token)
        //curl --location --request GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetWalkInStatusDetails?
        //PropertyId=10000000131000000002&OutletCode=HAMR&CheckInId=d6140b0bf91244f9b58e01e76bbda440'
     if (token && checkInId) axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetWalkInStatusDetails`, {
         params:{
           PropertyId: launch.propertyId,   
           OutletCode:launch.outletCode,
           CheckInId:checkInId
         },
         headers: { Authorization: `Bearer ${token}`},  // get from session storage from TableBooking outletList
          "Content-Type": "application/json"
         }
      ).then((res) =>{ 
        console.log(res)
        if (res.data.errorCode === 0) {
            setWalkingStatusDetails(res.data.response)
            const resData = res.data.response
            sessionStorage.setItem('walkinData', JSON.stringify(resData))
        } 
        
      })
       
    }
    useEffect(() => {
      if (token && checkInId) walkingBookingStatusHandler() 
    }, [token, checkInId])

    useEffect(() => {
     if (sessionStorage.getItem('checkinId') && sessionStorage.getItem('tokenData')) {
        setCheckInId(JSON.parse(sessionStorage.getItem('checkinId')))
        setToken((JSON.parse(sessionStorage.getItem('tokenData')).token))
     }

    }, [sessionStorage.getItem('checkinId'), sessionStorage.getItem('tokenData')])

    return {walkingStatusDetails, walkingBookingStatusHandler}
  }

   export default useWalkin