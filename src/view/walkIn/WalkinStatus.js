import { Card, CardBody, CardHeader, CardImg, CardText, Row } from "reactstrap"

import { GiPartyPopper } from "react-icons/gi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCalendarXmark, faClipboard } from '@fortawesome/free-regular-svg-icons'
import { Link } from "react-router-dom";
import 'animate.css'
import WLContent from "./WLContent";
import ConfirmContent from "./ConfirmContent";
import CancelContent from "./CancelContent";
import React, { useEffect, useState } from "react";

const WalkinStatus = (props) => { 
   const [walkingStatusDetails, setWalkingStatusDetails] = useState(sessionStorage.getItem('walkinData') ? JSON.parse(sessionStorage.getItem('walkinData')) : '')

  useEffect(() => {
    setWalkingStatusDetails(JSON.parse(sessionStorage.getItem('walkinData')))
    
  }, [sessionStorage.getItem('walkinData')])

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
              {  (walkingStatusDetails.walkInDetails.currentStatus === 2 || walkingStatusDetails.walkInDetails.currentStatus === 3) && 'Your table has been confirmed'}
              { (walkingStatusDetails.walkInDetails.currentStatus === 1 && 'Thanks for waiting, you will get your table soon')
              }
              { (walkingStatusDetails.walkInDetails.currentStatus === 4 && 'Your table has been cancelled')} 
              </div>
              <div className="d-flex justify-content-center m-0 mb-2"> 
              {  (walkingStatusDetails.walkInDetails.currentStatus === 2 || walkingStatusDetails.walkInDetails.currentStatus === 3) && <div className='animate__animated animate__shakeY' ><GiPartyPopper style={{fontSize:'70px', color:'black'}}/></div>}
               {    
               walkingStatusDetails.walkInDetails.currentStatus === 4 && <FontAwesomeIcon icon={faCalendarXmark} className="fa-solid fa-triangle-exclamation fa-fade" style={{color:'black', fontSize:'70px'}}/>
               }
               {
               walkingStatusDetails.walkInDetails.currentStatus === 1 && <FontAwesomeIcon icon={faClipboard} className="fa-solid fa-triangle-exclamation fa-fade" style={{color:'black', fontSize:'70px'}}/>
               }
              </div>
                  <CardText className="mt-1"> 
                  {
                 walkingStatusDetails.walkInDetails.currentStatus === 1 && <WLContent walkingStatusDetails = {walkingStatusDetails} walkingBookingStatusHandler = {props.walkingBookingStatusHandler} refreshW={props.refreshW}/>
                  }  
                   {
                  (walkingStatusDetails.walkInDetails.currentStatus === 2 || walkingStatusDetails.walkInDetails.currentStatus === 3) && <ConfirmContent walkingStatusDetails = {walkingStatusDetails} /> 
                  }  
                   {
                 walkingStatusDetails.walkInDetails.currentStatus === 4 && <CancelContent walkingStatusDetails = {walkingStatusDetails}/>
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
                   <div style={{width:'150px'}}>
                      <small><em style={{fontSize:'11px', color:'#8D8D8D'}}>Powered by {' '}</em><Link to= "" 
                      onClick={() => window.open('https://lucidpos.com/', '_blank')}
                      style={{fontWeight:'normal', fontSize:'11px', color:'#8D8D8D'}}><strong>LUCID POS</strong></Link></small> 
                    </div>
                </Row>
                 </CardBody>
                 </Card> 
             
    )
}

export default WalkinStatus