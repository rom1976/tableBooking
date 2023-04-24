import React, {useState, useEffect, Fragment, useRef} from 'react'
import axios from 'axios';
import {FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCalendarXmark, faClipboard } from '@fortawesome/free-regular-svg-icons'
import { GiPartyPopper } from "react-icons/gi";
import { useSelector, useDispatch } from 'react-redux';
import {  Row, Col, Container, CardFooter  
   } from 'reactstrap'
import {RefreshCcw} from 'react-feather';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardBody, CardText , CardHeader, Badge} from 'reactstrap';
import Loading from './Loading';
import ErrorModal from './view/TableBooking/Modals/ErrorModal';
import BookingView from './view/TableBooking/BookingView';
import TableBookingComp from './view/TableBooking/TableBookingComp';
import { handlePageId, handleViewPage } from './redux/launch';

const View = (props) => {
  const dispatch = useDispatch()
  const launch = useSelector(state => state.launch)  
  const [paramData, setParamData] = useState(launch.paramData) 
  const [token, setToken] = useState(launch.token) 
  const [walkingStatusDetails, setWalkingStatusDetails] = useState('')  
  const [bookingId, setBookingId] = useState(props.BookingId) 
  const [checkInId, setCheckInId] = useState(props.checkInId || launch.paramData.remarks.split('|')[1])
    //launch.paramData.remarks.split('|')[1])
  const [bookingType] = useState(props.BookingType)
  const [view, setView] = useState(0)
 
  const [errorMessage, setErrorMessage] = useState('')
  const walkinRef = useRef(true)
  useEffect(() => {
       if (launch.paramData) {
            setToken(launch.token)
            setParamData(launch.paramData) 
          }
          
  }, [launch])

  useEffect(() => {
     if (props.BookingId) setBookingId(props.BookingId)
  }, [props.BookingId])

  useEffect(() => {
    if (props.checkInId) setCheckInId(props.checkInId)
 }, [props.checkInId])
 
  const viewTableBooking = () => {
    setView('table')
   // dispatch(handleViewPage(''))
   dispatch(handlePageId(1))
  } 

   const walkingBookingStatusHandler = () => {
     //curl --location --request GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetWalkInStatusDetails?
     //PropertyId=10000000131000000002&OutletCode=HAMR&CheckInId=d6140b0bf91244f9b58e01e76bbda440'
   if (walkinRef.current) axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetWalkInStatusDetails`, {
      params:{
        PropertyId: paramData.propertyId,   
        OutletCode:paramData.outletCode,
        CheckInId:checkInId || props.checkInId
      },
      headers: { Authorization: `Bearer ${token}`},  // get from session storage from TableBooking outletList
       "Content-Type": "application/json"
      }
   ).then((res) =>{
     
     if (res.data.errorCode === 0) setWalkingStatusDetails(res.data.response)
     if (res.data.errorCode === 1) setErrorMessage(res.data.message) 
   })
    walkinRef.current = false
   }
    
   useEffect(() => {    
    const walking = paramData.remarks && paramData.remarks.split('|')[0] === '2'
      if(token) {
               if (launch.paramData.remarks.split('|')[0] === '1' ) {
                      setView(1)
               } else if (launch.paramData.remarks == 'tbr-self-chkin') {
                    setView(3) 
                    walkingBookingStatusHandler() 
                 } else if (walking || bookingType)
                 { 
                   walkingBookingStatusHandler() 
                 } else if (props.BookingId) {
                        setView(1)
                 }  
             }
               
       console.log(props.BookingId)
   }, [launch.paramData, token, bookingId])
   
  const Wlcontent = () => {
    return (
      <Fragment>  
      <div className="d-flex justify-content-center mt-5"  style={{marginBottom:'0px', color:'black'}}>   
      <h2 style={{fontWeight:'900'}}>
         {walkingStatusDetails && walkingStatusDetails.walkInDetails.currentWaitlistNo}
         </h2> 
      </div>
      <div className="d-flex justify-content-center m-0 ">
        <span style={{marginBottom:'0px', color:'black'}}>
        <small> Your Current Wait List Number </small> 
        <span onClick = {() => {
           walkinRef.current = true
           walkingBookingStatusHandler() 
           }} style={{textDecoration:'none', color:'black', paddingLeft:'7px'}}> 
           {walkingStatusDetails && walkingStatusDetails.walkInDetails.showRefresh && <RefreshCcw size={15} strokeWidth='3px' className='rotate'/>}
         </span> 
       </span> 
      </div>  
      <div className="d-flex justify-content-center m-0 mt-5"> 
        
       </div> 
    
      </Fragment>
    )
  }

  const Confirmcontent = () => {
    return (
      <Fragment> 
      <div className="d-flex justify-content-center m-0 mt-5"> 
      <h2 style={{fontWeight:'900'}}>  {
        (walkingStatusDetails && walkingStatusDetails.walkInDetails.tableNos)
        }
        </h2> 
      </div>
      <div className="d-flex justify-content-center m-0">
       <small>Table Number</small>
      </div>   
      
      <div className="d-flex justify-content-center m-0 mt-5"> 
        {
            walkingStatusDetails && walkingStatusDetails.walkInDetails.showOrderNow &&
          <p style={{marginBottom:'0px', cursor:'pointer'}}  onClick = {() => window.open(walkingStatusDetails.walkInDetails.orderNowLink, '_self')}>
            <small>{walkingStatusDetails.walkInDetails.orderNowDisplayName}
            </small></p>}
       </div> 
      </Fragment>
    )
  }

  const CancelContent = () => {
    return (
      <Fragment>
      
        <div className="d-flex justify-content-center m-0 mt-5">
        <h4><Badge outline color='black'  >Cancelled</Badge> </h4> 
        </div> 
      <div className="d-flex justify-content-center m-0 mt-0 mb-5 pb-2">
      <small style={{fontSize:'10px'}}>[{walkingStatusDetails && walkingStatusDetails.walkInDetails.cancelReason}]</small>  
      </div>     
      <div className="d-flex justify-content-center m-0 mt-5"> 
        { // for spacing prupose , not rquired for cancelled to order
            //  walkingStatusDetails && walkingStatusDetails.walkInDetails.showOrderNow &&
            //<p style={{marginBottom:'0px'}}>
           // <small><Link to='' onClick = {() => window.open(walkingStatusDetails.walkInDetails.orderNowLink, '_self')}>{walkingStatusDetails.walkInDetails.orderNowDisplayName}</Link> 
           // </small></p>
            }
       </div> 
      </Fragment>
    )
  }

  const WalkingStatusComponent = () => {
    return (
      <Card style={{backgroundColor: 'white', height:'100vh'}} className='bx'> 
        <CardHeader className='text-white fixed-top mb-5' style={{border:'none', background:'#EAEAEA'}}>
          { 
           walkingStatusDetails.walkInDetails.outletImageUrl ?  <div className="d-flex justify-content-center m-0" style={{backgroundColor: '#EAEAEA', borderColor: '#333' , borderRadius:'7px 7px 0px 0px'}}>
           <CardImg variant="top" src={walkingStatusDetails.walkInDetails.outletImageUrl} style={{maxWidth:'200px', maxHeight:'70px', borderRadius:'10px'}}/>   
         </div> : <div className="d-flex justify-content-center m-0 ">
                  <div className="m-0 pt-1 px-2" style={{textAlign:'center', background:'white', borderRadius:'5px', boxShadow:'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'}}>
                    <h5 className="m-0"  style={{color:'grey'}}>{walkingStatusDetails && walkingStatusDetails.walkInDetails.outletName}  </h5>  
                   <h6  style={{color:'grey'}} className='mb-2 '>{walkingStatusDetails && walkingStatusDetails.walkInDetails.propertyName}</h6>
                 </div>     
            </div> 
          } 
      </CardHeader>
        <CardBody className="mt-5 pt-5" >
        <div className="d-flex justify-content-center m-0 mt-5 mb-1">
    <h4 style={{marginBottom:'0px'}}>Thank you {walkingStatusDetails && walkingStatusDetails.walkInDetails.guestName} </h4> 
      </div>  

      <div className="d-flex justify-content-center m-0 mb-4"> 
      { (walkingStatusDetails.walkInDetails.currentStatus === 2 ||  walkingStatusDetails.walkInDetails.currentStatus === 3) && 'Your table has been confirmed'}
      { (walkingStatusDetails.walkInDetails.currentStatus === 1 && 'Thanks for waiting, you will get your table soon')
      }
      { (walkingStatusDetails.walkInDetails.currentStatus === 4 && 'Your table has been cancelled')} 
      </div>
      <div className="d-flex justify-content-center m-0 mb-2"> 
      {  (walkingStatusDetails.walkInDetails.currentStatus === 2 ||  walkingStatusDetails.walkInDetails.currentStatus === 3) && <div className='animate__animated animate__shakeY' ><GiPartyPopper style={{fontSize:'70px', color:'black'}}/></div>}
       {    
        walkingStatusDetails.walkInDetails.currentStatus === 4 && <FontAwesomeIcon icon={faCalendarXmark} className="fa-solid fa-triangle-exclamation fa-fade" style={{color:'black', fontSize:'70px'}}/>
       }
       {
        walkingStatusDetails.walkInDetails.currentStatus === 1 && <FontAwesomeIcon icon={faClipboard} className="fa-solid fa-triangle-exclamation fa-fade" style={{color:'black', fontSize:'70px'}}/>
       }
      </div>
          <CardText className="mt-1"> 
          {
          walkingStatusDetails.walkInDetails.currentStatus === 1 && <Wlcontent />
          }  
           {
          (walkingStatusDetails.walkInDetails.currentStatus === 2 ||  walkingStatusDetails.walkInDetails.currentStatus === 3) && <Confirmcontent />
          }  
           {
          walkingStatusDetails.walkInDetails.currentStatus === 4 && <CancelContent />
          } 
             <div  className="d-flex justify-content-center mt-5"><small>Your walkin details</small></div>
               <div className="d-flex justify-content-center " style={{ borderTop: "1px solid black"}}>
          <div style={{width:'100px', borderRight: "1px solid black", marginTop:'5px', padding:'10px', textAlign:'center',  fontSize:'12px'}}
           className="px-3"
          >
            <small>
              {walkingStatusDetails && walkingStatusDetails.walkInDetails.checkInDate}
              <div>Date</div>
              </small> 
              </div> 
          <div style={{width:'100px', borderRight: "1px solid black", marginTop:'5px', padding:'10px', textAlign:'center',  fontSize:'12px'}}
          className="px-3"
          >
          <small>
             {walkingStatusDetails && walkingStatusDetails.walkInDetails.checkInTime} 
             <div>Time</div>
             </small></div>
          <div style={{width:'100px', marginTop:'5px', padding:'10px', textAlign:'center', fontSize:'12px'}}
           className="px-3" 
          >
            {walkingStatusDetails &&  <small> 
              {walkingStatusDetails.walkInDetails.noOfGuest} People
            <div style={{paddingRight:'5px'}}>Guests</div>
              </small>}</div> 
          </div> 
          </CardText>
            <Row className="d-flex justify-content-center border-top fixed-bottom" 
           style={{background:'#EAEAEA'}}>
           <div style={{width:'160px'}}>
              <small><em style={{fontSize:'11px', color:'#8D8D8D'}}>Powered by {' '}</em><Link to= "" 
              onClick={() => window.open('https://lucidpos.com/', '_blank')}
              style={{fontWeight:'normal', fontSize:'11px', color:'#8D8D8D'}}><strong>LUCID POS</strong></Link></small> 
            </div>
        </Row>
         </CardBody>
         </Card> 
        )
       } 
         if (view === 'table') {
                 return <TableBookingComp setViewPage ={props.setViewPage} isOpenBL={true}/>
              } else
               return ( 
        <Container fluid> 
            <Row >
         <Col> 
          {
           !view && !walkingStatusDetails && <Loading />
          }
          {
           view === 1 && <BookingView PropertyId ={props.PropertyId} BookingId={props.BookingId} OutletCode={props.OutletCode} viewTableBooking={viewTableBooking}/> 
          }  
          {walkingStatusDetails && <WalkingStatusComponent />} 
         </Col>
       </Row> 
        <ErrorModal errorMessage ={errorMessage}/>
       </Container> 
    )
}

export default View