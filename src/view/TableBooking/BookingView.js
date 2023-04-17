import { faCalendarXmark, faClipboard } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import React, { Fragment, useEffect, useRef, useState } from "react"
import { RefreshCcw } from "react-feather"
import { GiPartyPopper } from "react-icons/gi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Badge, Card, CardBody, CardHeader, CardImg, CardText, Row } from "reactstrap"
import { handlePageId } from "../../redux/launch"
import ErrorModal from "./Modals/ErrorModal"


const BookingView = (props) => {
     const launch = useSelector(state => state.launch) 
     const dispatch = useDispatch()
     const [propertyId, setPropertyId] = useState(props.PropertyId)
     const [token, setToken] = useState(launch.token)
     const [bookingStatusDetails, setBookingStatusDetails] = useState('')
     const [bookingStatusColor, setBookingStatusColor] = useState('#316cf4') 
     const [imageUrl, setImageUrl] = useState('') 
     const [errorMessage, setErrorMessage] = useState('')
     const [outletCode, setOutletCode] = useState(props.OutletCode)
     const [reservationId, setReservationId] = useState(props.BookingId)
     const bookingRef = useRef(true) 

     const tableBookingHandler = () => {  
        dispatch((handlePageId(1)))   
     }
      
     

     useEffect(() => {
           setToken(launch.token)
     },[launch.token ])

     useEffect(() => {
          setToken(launch.outletListData.token)
          console.log(launch.outletListData)
     }, [launch.outletListData])
 
     useEffect(() => {
      if (bookingStatusDetails) {
         
          setImageUrl(bookingStatusDetails.bookingDetails.outletImageUrl)
        setBookingStatusColor(() => {
          if (bookingStatusDetails.bookingDetails.currentStatus === 'Cancelled') return 'black'
          if (bookingStatusDetails.bookingDetails.currentStatus === 'Confirmed') return 'black'
          if (bookingStatusDetails.bookingDetails.currentStatus === "Checked-In") return 'black'
          if (bookingStatusDetails.bookingDetails.currentStatus === 'Waiting List') return 'black'
        })
       } 
   }, [bookingStatusDetails])

    const bookingStatusHandler = (prpId, ooutlId, reservId) => { 
        //  GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/
        //GetBookingStatusDetails?PropertyId=10000000131000000002&OutletCode=HAMR&ReservationId=d6140b0bf91244f9b58e01e76bbda440'
         console.log(bookingRef.current)
      bookingRef.current && axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetBookingStatusDetails`, { 
              params:{
                PropertyId: prpId,   
                OutletCode: ooutlId,
                ReservationId:reservId
              },
              headers: { Authorization: `Bearer ${token || launch.token}`},  // get from session storage from TableBooking outletList
               "Content-Type": "application/json"
              }
           ).then((res) =>{
        
         if (res.data.errorCode === 0) {  
            // bookingRef.current = false // to stop calling api 2 times
           setBookingStatusDetails(res.data.response) 
          
           }
           if (res.data.errorCode === 1) {  
               setErrorMessage(res.data.message)
                 setBookingStatusDetails(res.data.response) 
            }
       })
       bookingRef.current = false
       }

       useEffect(() => {
             if (launch.token) { 
                       //from view click from your bookings
                          if (props.PropertyId && props.OutletCode) {
                                    // refresh purpose
                                    setPropertyId(props.PropertyId)
                                    setOutletCode(props.OutletCode) 
                                    setReservationId(props.BookingId)
                                    bookingStatusHandler(props.PropertyId, props.OutletCode, props.BookingId) 
                           } else if (launch.outletDetails.outletDetails && launch.paramData.remarks.split('|')[1] ) {
                                // refresh purpose
                                 setPropertyId(launch.paramData.propertyId)
                                 setOutletCode(launch.paramData.outletCode)
                                 setReservationId(launch.paramData.remarks.split('|')[1])
                               // with remarks outlelevel call with reservation Id
                               const resId =  launch.paramData.remarks.split('|')[1]  
                              bookingStatusHandler(launch.paramData.propertyId, launch.paramData.outletCode, resId)
                          }  
                          console.log(props.PropertyId, props.OutletCode, token)
                      }
              
       }, [props.PropertyId, props.OutletCode, props.BookingId, launch.outletDetails.outletDetails, launch.token])

      

    return (
        <Fragment>
         {bookingStatusDetails.bookingDetails &&    
           <Card style={{ backgroundColor: 'white', borderColor: 'white' }} className='bx'> 
           <CardHeader className='text-white fixed-top mb-5' style={{border:'none', background:'#EAEAEA'}}>
            { imageUrl ? <div className="d-flex justify-content-center m-0" style={{backgroundColor: '#EAEAEA', borderColor: '#333' , borderRadius:'7px 7px 0px 0px'}}>
            <CardImg variant="top" src={imageUrl} style={{maxHeight:'70px', maxWidth:'200px', borderRadius:'10px'}}/>   
            </div> : <div className="d-flex justify-content-center m-0">
            <div className="m-0 pt-1 px-2" style={{textAlign:'center', background:'white', borderRadius:'5px', boxShadow:'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'}}>
            <h5 className="m-0"  style={{color:'grey'}}>{bookingStatusDetails && bookingStatusDetails.bookingDetails.outletName} </h5>  
            <h6   style={{color:'grey'}} className='mb-2 '>{bookingStatusDetails && bookingStatusDetails.bookingDetails.propertyName}</h6>
            </div>
            </div>
            }
            </CardHeader> 
            <CardBody className='mt-5 pt-5'>
            <div className="d-flex justify-content-center m-0 mt-5 mb-1"> 
               <h4>Thank you {bookingStatusDetails && bookingStatusDetails.bookingDetails.guestName}</h4>
              </div>
              <div className='mt-1'> 
              <div className="d-flex justify-content-center m-0 mb-4"> 
             Your reservation has been {bookingStatusDetails && bookingStatusDetails.bookingDetails.currentStatus.toLowerCase()} 
            </div>
              <div className="d-flex justify-content-center m-0 mt-5"> 
             {bookingStatusDetails.bookingDetails.currentStatus === 'Cancelled' && <FontAwesomeIcon icon={faCalendarXmark} className="fa-solid fa-triangle-exclamation fa-fade" style={{fontSize:'70px'}}  /> }
             { bookingStatusDetails.bookingDetails.currentStatus === 'Confirmed' && <div className='animate__animated animate__shakeY' ><GiPartyPopper style={{fontSize:'70px'}}/></div>}
             { bookingStatusDetails.bookingDetails.currentStatus === 'Checked-In' && <div className='animate__animated animate__shakeY' ><GiPartyPopper style={{fontSize:'70px'}}/></div>} 
             { bookingStatusDetails.bookingDetails.currentStatus === 'Waiting List' && <FontAwesomeIcon icon={faClipboard} className="fa-solid fa-triangle-exclamation fa-fade" style={{fontSize:'70px'}}/>} 
            </div> 
            <div className="d-flex justify-content-center m-0 mt-4 pb-0">
              <h2 style={{fontWeight:'900', marginBottom:'0px'}}> {bookingStatusDetails && bookingStatusDetails.bookingDetails.bookingId}
              </h2> 
            </div> 
            <div className="d-flex justify-content-center m-0 p-0">
            <small>Reservation Number</small> 
            </div>
           
            <div className="d-flex justify-content-center mt-5">
                 <small>Your reservation details</small>
            </div>
            <div className="d-flex justify-content-center " style={{ borderTop: "1px solid black"}}>
              <div style={{width:'100px  ', borderRight: "1px solid black", marginTop:'5px', padding:'10px', textAlign:'center',  fontSize:'12px'}}
               className="px-3"
              >
                <small>
                  {bookingStatusDetails && bookingStatusDetails.bookingDetails.reservationDate}
                  <div>Date</div>
                  </small> 
                  </div> 
              <div style={{width:'100px' , borderRight: "1px solid black", marginTop:'5px', padding:'10px', textAlign:'center',  fontSize:'12px'}}
              className="px-3"
              >
                <small>
                 {bookingStatusDetails && bookingStatusDetails.bookingDetails.reservationTime} 
                 <div>Time</div>
                 </small></div>
              <div style={{width:'100px ', marginTop:'5px', padding:'10px', textAlign:'center', fontSize:'12px'}}
               className="px-3" 
              >
                {bookingStatusDetails &&  <small> 
                  {bookingStatusDetails.bookingDetails.noOfGuest} People
                <div style={{paddingRight:'5px'}}>Guests</div>
                  </small>}</div> 
              </div>  
              <div className="d-flex justify-content-center m-0 mt-5">
            <h4><Badge color={"black" || bookingStatusColor}>{bookingStatusDetails && bookingStatusDetails.bookingDetails.currentStatus}</Badge> </h4> 
            </div> 
            <div className="d-flex justify-content-center m-0 mt-0">
            <small style={{fontSize:'10px'}}>
             {([(bookingStatusDetails && bookingStatusDetails.bookingDetails.currentStatus === 'Cancelled') && bookingStatusDetails.bookingDetails.cancelReason]) }
             {((bookingStatusDetails && bookingStatusDetails.bookingDetails.currentStatus === 'Waiting List') && ['Restaurant will update your booking status soon'])
              }
              </small>
             </div>      
              <div className="d-flex justify-content-center m-0">
             {bookingStatusDetails && bookingStatusDetails.bookingDetails.showRefresh && 
             <div onClick = {() => {
                  bookingRef.current = true
                  bookingStatusHandler(propertyId, outletCode, reservationId) 
              }} style={{textDecoration:'none', color:'black', paddingLeft:'7px', cursor:'pointer'}}> 
               <RefreshCcw size={15} strokeWidth='3px' className='rotate'/></div> }
              </div>  
              <div className="d-flex justify-content-center m-0"> 
              </div>  
              <div className="d-flex justify-content-center m-0 mt-4">
              <small style={{fontSize:'10px'}} className='mb-0'><span style={{paddingRight:'5px'}}>Booked On:</span>{bookingStatusDetails && bookingStatusDetails.bookingDetails.bookedOn} </small>
              </div>  
            
              <div className="d-flex justify-content-center m-0">
              <small style={{fontSize:'10px'}}><span style={{paddingRight:'5px'}}>Booking Source:</span> {bookingStatusDetails && bookingStatusDetails.bookingDetails.bookingSource}</small>
              </div> 
              <div className="d-flex justify-content-center m-0 mt-4">{
                bookingStatusDetails && bookingStatusDetails.bookingDetails.showTableBookingLink &&
              <div style={{marginBottom:'0px'}}>
                <small>
                    <p onClick = {props.viewTableBooking} style={{color:'blue', cursor:'pointer'}}>
                    Go To Table Booking
                    </p> 
                </small></div>}
              </div> 
              </div>
              <Row className="d-flex justify-content-center border-top fixed-bottom" 
              style={{background:'#EAEAEA'}}>
               <div style={{width:'160px'}}>
                  <small><em style={{fontSize:'11px', color:'#8D8D8D'}}>Powered by {' '} </em><Link to= "" 
                  onClick={() => window.open('https://lucidpos.com/', '_blank')}
                  style={{fontWeight:'normal', fontSize:'11px', color:'#8D8D8D'}}>
                  <strong>LUCID POS</strong></Link></small> 
                </div>
            </Row> 
            </CardBody>
         </Card>  
         }
              <ErrorModal errorMessage ={errorMessage}/>
         </Fragment>
        )
}

export default BookingView