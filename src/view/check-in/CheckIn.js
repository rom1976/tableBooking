import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import {Link} from "react-router-dom";
 // reactstrap
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row } from "reactstrap"

//custome hooks
// import useLaunch from "../../core/utils/useLaunch"
 
import { handlePageId, handleViewPage } from "../../redux/launch";
// import useWalkin from "../../Hooks/useWalkin";
 import View from "../../View";
 import Loading from "../Loading";
import { getMobileCountryCode, getTitleList } from "../../redux/options";
// import WalkinStatus from "../walkIn/WalkinStatus";

const CheckIn = (props) => { 
     const dispatch = useDispatch() 
     const launch = useSelector(state => state.launch)
     const optionsData = useSelector(state => state.options)
     const [token, setToken] = useState(launch.token)
     //const [walkinData, setWalkingData] = useState(sessionStorage.getItem('walkinData') ? JSON.parse(sessionStorage.getItem('walkinData')) : '') 
     const [title, setTitle] = useState('Mr.')
    
     const [optionsTitle, setOptionsTitle] = useState([])
     const [mobileNo, setMobileNo] = useState('')
     const [name, setName] = useState('')
     const [pax, setPax] = useState(0)
    
     const [imageUrl, setImageurl] = useState()
     const [outletCode, setOutletCode] = useState('')
     const [outletName, setOutletName] = useState('')
     const [propertyName, setPropertyName] = useState('') 
     const [saving, setSaving]= useState(false)
     const [checkInId, setCheckInId] = useState(sessionStorage.getItem('checkinId') ? JSON.stringify(sessionStorage.getItem('checkinId')):'')
   //  const useWalkinData = useWalkin(checkInId, tokenData.token)
   //  const [refreshW, setRefreshW] = useState(false)

     const titleRef = useRef(true)

           useEffect(() => {
              if (launch.outletDetails.outletDetails) {
                   const otDetails = launch.outletDetails.outletDetails
                setImageurl(otDetails.imageUrl)
                console.log(otDetails)
              }

              if (launch.token && titleRef.current) {
                setToken(launch.token) 
                dispatch(getTitleList(launch.token))
                dispatch(getMobileCountryCode(launch.token))
                titleRef.current = false
              }

           }, [launch.outletDetails.outletDetails])
     
     const subMitHandler = (e) => {
        e.preventDefault() 
           // const url = 'https://dev.lucidits.com/lucidapi/V1/LUCIDPOS/SaveOutletCheckIn' 
           axios.post(`${process.env.REACT_APP_BASE_API_URL}lucidapi/V1/LUCIDPOS/SaveOutletCheckIn`,
             {
                "OutletCode":outletCode,
                "NoOfPax": pax,
                "NoOfTables": 1,
                "AssignedTables":[], 
                "GuestTitle": title,
                "GuestName": name,
                "GuestMobileNo": mobileNo,
                "GuestEmailId": "",
                "Status": 2,
                "IsSelfCheckIn":true,
               
               "SystemDetails":
               {
               "ApplicationName":"",
               "ApplicationVersion":"1.0",
               "BrowserName":"",
               "BrowserVersion":"",
               "DeviceId":"",
               "DeviceType":"Tab",
               "IP":"",
               "Mac":"",
               "OPS":"",
               "Source":"TabletPOS",
               "SystemName":"Yuvaraj",
               "SystemTimeZoneId":1
               }    
            },{
             headers: { Authorization: `Bearer ${token}`},
             "Content-Type": "application/json"
           }
        ).then((res) => { 
           setSaving(false) 
           if (res.data.errorCode === 0) {
               setCheckInId(res.data.response.checkInId)
               dispatch(handleViewPage(<View checkInId = {res.data.response.checkInId}  PropertyId={ launch.paramData.PropertyId}/>))
               dispatch(handlePageId(2))  
            }
           if (res.data.errorCode === 1) {
                 const error = res.data
                 alert(error.message) 
             }
        }) 
       } 
       
       useEffect(() => {
            
              const paramData = launch.paramData 
                setOutletName(paramData.outletName)
                setPropertyName(paramData.propertyName)
                setOutletCode(paramData.outletCode)      
       
       }, [launch.paramData])
     
          useEffect(() => {
           const favicon = document.getElementById("favicon");
           if (imageUrl) favicon.href = imageUrl
          }, [imageUrl])
 
       useEffect(() => {
        if(optionsData.optionsTitle.length > 0) setOptionsTitle(optionsData.optionsTitle)

          console.log(optionsData.optionsTitle && optionsData.optionsTitle)
        }, [optionsData.optionsTitle])
 
   //     useEffect(() => {
   //       setWalkingData(sessionStorage.getItem('walkinData') ? JSON.parse(sessionStorage.getItem('walkinData')) : useWalkinData) 
   //       setRefreshW(false)
   //       console.log(JSON.parse(sessionStorage.getItem('walkinData')))
   //       console.log(walkinData)
   //     }, [sessionStorage.getItem('walkinData')])
        // for props down purpose

       //  const walkingBookingStatusHandler = () => {
       //    useWalkinData.walkingStatusDetails()
       //    }
           
            if (checkInId) {
              // return <WalkinStatus walkingStatusDetails={walkinData} walkingBookingStatusHandler={walkingBookingStatusHandler} refreshW = {refreshW}/>  
                return <View BookingId={checkInId} />
            } else  
            return (   
            <Card style={{backgroundColor:'white', border:'none'}}>
             <CardHeader 
            className='text-dark mb-1' 
            style={{border:'none', background:'#EAEAEA', height:'85%'}}>   
         
            <div style={{float:'left', display:'flex', width:'85%'}} className='pt-0'>
             {(imageUrl && <img src= {imageUrl} className=" rounded float-start img-fluid" alt="..." 
               style={{maxHeight:'70px', maxWidth:'200px'}}
              /> )
              }
              <div style={{display:'flex', flexDirection:'column', paddingTop:'15px'}}>
             <span className="ps-2">{outletName} 
               
             </span> <span className="ps-2">{propertyName} </span>
            </div> 
            {
             // Right Side Logout
            }
            </div>  
            </CardHeader>
            <CardBody className="d-flex justify-content-center pt-5"  style={{backgroundColor:'white', border:'none'}}>
                 <div style={{width:'50%', height:'450px'}}>
                 <Form>
                <FormGroup row>
                <Label
                    for="mobile"
                    sm={2}
                  >
                    Mobile No *
                  </Label>
                   <Col sm={2}>
                   <Input
                      id="code"
                      name="code"
                      placeholder="+91"
                      type="text" 
                      disabled
                    />        
                   </Col>
                   <Col sm={7}> 
                    <Input
                      id="mobileNo"
                      name="mobileNo"
                      placeholder="Mobile No"
                      type="tel"
                      onChange={(e) => setMobileNo(e.target.value)}
                    />
                    </Col>
                    </FormGroup>
                    <FormGroup row>
                   <Label
                    for="name"
                    sm={2}
                  >
                    Name *
                  </Label>
                   <Col sm={2}>
                   <Input
                      id="title"
                      name="title"
                     defaultValue={'Mr.'}
                      type="select"
                      onChange={(e) => setTitle(e.target.value)}
                      > 
                         {optionsTitle && optionsTitle.map((itm, id) => { 
                          return (
                            <option key={id}>
                              {itm.label}
                            </option>
                          )
                         })}
                        </Input>
                   </Col>
                   <Col sm={7}> 
                    <Input
                      id="name"
                      name="name"
                      placeholder="Name"
                      onChange={(e) => setName(e.target.value)}
                     />
                    </Col>
                    </FormGroup>
                    <FormGroup row>
                  <Label
                    for="Pax"
                    sm={2}
                   >
                    Pax *
                  </Label>
                   <Col sm={2}>
                   <Input
                      id="pax"
                      name="pax" 
                      type="number"
                      onChange={(e) => setPax(e.target.value)}
                      min={1}
                    />
                   </Col> 
                    </FormGroup>
                  </Form>
                  <div className="d-flex justify-content-center">
                  <Button 
                  disabled = {name.trim().length === 1 && !mobileNo}
                  style={{backgroundColor:'black'}}
                   onClick={(e) => {
                     if (mobileNo.length >= 10) {
                               if (name.length > 2) {
                                          if (pax > 0) {
                                               subMitHandler(e)
                                               setSaving(true) 
                                             } else {
                                                alert('Please Enter No. of Pax')
                                              }
                                       } else {
                                     alert('Please Enter Your Name')
                                     }
                        } else {
                        alert('Please Enter Valid Mobile No')
                      }
                      }}
                   >Submit</Button>
                  </div> 
                 { saving && <Loading /> }
                 </div>  
            </CardBody>
            <CardFooter style={{backgroundColor:'white', borderTop:'none'}}>
            <Row className="d-flex justify-content-center border-top fixed-bottom" 
           style={{background:'#EAEAEA'}}>
           <div style={{width:'160px'}}>
              <small><em style={{fontSize:'11px', color:'#8D8D8D'}}>Powered by {' '}</em><Link to= "" 
              onClick={() => window.open('https://lucidpos.com/', '_blank')}
              style={{fontWeight:'normal', fontSize:'11px', color:'#8D8D8D'}}><strong>LUCID POS</strong></Link></small> 
            </div>
        </Row>
            </CardFooter>
         </Card>  
       )
  }

  export default CheckIn