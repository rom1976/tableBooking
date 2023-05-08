import React, { useState, useEffect, useRef, useCallback } from "react"
import { useMediaQuery } from 'react-responsive'; 
import { useSelector, useDispatch } from "react-redux"
import Layout from "../../core/Layout/Layout"
import {Button, CardBody, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap'
import moment from "moment";
import Loading from "../../Loading";
import axios from "axios";

 
import { getGuestListHandler, getGuestTotalBooking, handleBooking, handleLogin, handlePropertySelection } from "../../redux/tableBooking";
import { handleModalTitle, sendOTP } from "../../redux/modals";
import ModalsComponent from "./Modals/ModalsComponent";
import { getPropertyList } from "../../redux/propertyData";
import { getOutletList } from "../../redux/launch";
import Header from "../../core/Layout/Header";
//import { faL } from "@fortawesome/free-solid-svg-icons";

const TableBookingComp = (props) => {
  const dispatch = useDispatch()
  const launch = useSelector(state => state.launch)
  const propertyData = useSelector(state => state.propertyList.propertyData)
  const [outletDetails, setOutletDetails] = useState(launch.outletDetails)
 
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const tableBooking = useSelector(state => state.tableBooking)   
  const [token, setToken] = useState(launch.token)
  const [propertyName, setPropertyName] = useState('')
  const [outletName, setOutletName] = useState('')
  const [propertyId, setPropertyId] = useState(tableBooking.selectedProperty.propertyId)
  const [outletCode, setOutletCode] = useState('')
  const [NoOfGuest, setNoOfGuest] = useState(1)
  const [maxPax, setMaxPax] = useState(10)
  const [BookingTime, setBookingTime] = useState('')
  const [timeColor, setTimeColor] = useState('')
  const [selectedTitle, setSelectedTitle] = useState([{value: 1, label: 'Mr.'}])
  const [optionsTitle, setOptionsTitle] = useState([])
  const [FirstName, setFirstName] = useState('') 
  const [LastName, setLastName] = useState('') 
  const [selectedTelephoneCode, setSelectedTelephoneCode] = useState([{value: 1, label: '91'}])
  const [optionsTelephoneCode, setOptionsTelephoneCode] = useState([])
  const [ContactNo, setContactNo] = useState('')   
   
  const [EmailId, setEmailId]  = useState('')    
  const [Instruction, setInstruction] = useState('')
  const [loggedIn, setLoggedIn] = useState(tableBooking.loggedIn)
  const [bookingHandlerToggle, setBookingHandlerToggle] = useState(false) 
  const [saveToggle, setSaveToggle] = useState(false)
 // const [outletList, setOutletList] = useState(launch.outletListData)
 const titleRef = useRef(true)
 const mobileCodeRef = useRef(true)
 const propertyRef = useRef(true)
const outletDetailsRef = useRef(true)
const outletListRef = useRef(true)
const timeSlotRef = useRef(false)
const [diffNo, setDiffNo] = useState(false) 
          const d = new Date()
          const [bookingDate, setBookingDate] = useState(d.toISOString().split('T')[0])
         
          const [timeSlotList, setTimeSlotList] = useState('')
  
              useEffect(() => {
                       if (tableBooking) setLoggedIn(tableBooking.loggedIn)
 
                        if (tableBooking.selectedProperty) {
                             const sel = tableBooking.selectedProperty
                             setPropertyName(sel.propertyName)
                             setPropertyId(sel.propertyId)
                            // timeSlotRef.current = true
                            //tried this way for only property changed but outlet remain the same
                        }
                      
           }, [tableBooking.selectedProperty])

           useEffect(() => {
            const sel = tableBooking.selectedOutlet
             // setBookingDate(d.toISOString().split('T')[0]) 
                  if (sel.outletCode) {     
                          timeSlotRef.current = true  
                          setOutletName(sel.outletName) 
                    //   if (sel.outletCode !== outletCode)  {
                           setOutletCode(sel.outletCode)   
                        //  console.log('different outlet or not ',  timeSlotRef.current, sel.outletCode === outletCode)
                       //  } 
                 }   
           }, [tableBooking.selectedOutlet.outletCode])

         //   useEffect(() => {
         //     if (outletCode){
         //      //   timeSlotRef.current = !timeSlotRef.current
         //    //    if (!timeSlotList || timeSlotList === '' || !timeSlotRef.current)  
         //       timeSlotRef.current = true
         //       console.log(timeSlotRef.current)
         //     } 
         //     
         //   }, [outletCode, timeSlotList])

            useEffect(() => {
               if (bookingDate){
                   timeSlotRef.current = true
                   console.log(timeSlotRef.current)
                 } 
            }, [bookingDate])
 
          useEffect(() => {
             if (launch.token) {
              setToken(launch.token)  
             }

              if (launch.paramData.organizationId && launch.token && propertyRef.current) {
                   dispatch(getPropertyList(launch.token))
                   propertyRef.current = false
              }

         //    if((!tableBooking.selectedProperty.propertyId && launch.paramData.outletCode === 'NONE' || !launch.paramData.outletCode || !outletCode || outletCode === 'NONE') && launch.token){
         //     
         //       if (launch.paramData.propertyId && tableBooking.selectedProperty.propertyId === '') {
         //            dispatch(getOutletList({propertyId:launch.paramData.propertyId, token:launch.token})) 
         //            outletListRef.current = false
         //          }
         //     }
         //       // whenever page refresh happening outlet was not called, since outletcodes cane be similar, propertyId change can be used
         //     if (tableBooking.selectedProperty.propertyId && launch.token){
         //       dispatch(getOutletList({propertyId:tableBooking.selectedProperty.propertyId, token:launch.token})) 
         //       outletListRef.current = false    
         //    console.log(tableBooking.selectedProperty.propertyId)
            //  }
          
            }, [launch.token, launch.paramData, launch.paramData.propertyId, tableBooking.selectedProperty.propertyId])
            
          useEffect(() => {
            
            if (launch.outletDetails.outletDetails) {
              setOutletDetails(launch.outletDetails)
              launch.outletDetails.outletDetails.maximumPax && setMaxPax(Number(launch.outletDetails.outletDetails.maximumPax))
             }  
            
          }, [launch.outletDetails.outletDetails])

 
          useEffect(() => {  
            const bkng = tableBooking.tableData 
                // setNoOfGuest(bkng.NoOfGuest)
             //    setBookingTime(bkng.BookingTime)
               // setSelectedTitle(bkng.selectedTitle)
               if (bkng) {
                if(bkng.FirstName) setFirstName(bkng.FirstName)

                if(bkng.LastName)  setLastName(bkng.LastName)

               if (bkng.selectedTelephoneCode)   setSelectedTelephoneCode(bkng.selectedTelephoneCode) 

               if(bkng.ContactNo) setContactNo(bkng.ContactNo)

               if(bkng.EmailId) setEmailId(bkng.EmailId)
               
               if(bkng.Instruction) setInstruction(bkng.Instruction)   
               } 
             }, [tableBooking.tableData])

             useEffect(() => {
                  if (tableBooking.timeSlotList) setTimeSlotList(tableBooking.timeSlotList)
             },[tableBooking.timeSlotList])

               useEffect(() => {
                setLoggedIn(tableBooking.loggedIn) 
                
                if (!tableBooking.loggedIn && !bookingHandlerToggle && !diffNo) {
                    setFirstName('')
                    setLastName('')
                    setContactNo('')
                  }
               }, [tableBooking.loggedIn, bookingHandlerToggle])

         useEffect(() => {
           if (BookingTime && FirstName && ContactNo && tableBooking.loggedIn && saveToggle) setBookingHandlerToggle(true)
 
         },[tableBooking.loggedIn])

            const timeSlotListHandler = () => {
              axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetTimeSlotList`, {
                params:{
                  outletCode:tableBooking.selectedOutlet.outletCode || launch.paramData.outletCode,
                  BookingDate:bookingDate
                },
                headers: { Authorization: `Bearer ${launch.outletListData.token}`},
                  "Content-Type": "application/json"
                }
                ).then((response) => {   
                  
                if (response.data.errorCode === 1) {
                  dispatch(handleModalTitle(response.data.message))
                } 
                setTimeSlotList(response.data.response)
               
                }).catch(error => console.log(error)) 

                timeSlotRef.current = false 
            }

         useEffect(() => {
          
           if (tableBooking.isOpenBL && launch.outletListData.token && timeSlotRef.current) {
                 timeSlotRef.current = false 
              // caling time, back from view page 
                setTimeout(() =>  timeSlotListHandler(), 1000)   
               
                }
              
         },[tableBooking.isOpenBL, launch.outletListData.token])
 
           useEffect(() => {
           //  console.log(tableBooking.loggedIn, bookingHandlerToggle, BookingTime, bookingDate, BookingTime, launch.outletListData.token)

            if ((tableBooking.loggedIn && bookingHandlerToggle && BookingTime && bookingDate && BookingTime && launch.outletListData.token)){
              axios.post(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}ValidateTableBooking`, 
              {
                OutletCode:outletCode,
                "BookingDate":bookingDate, // "04-Aug-2022",
                "BookingTime":moment(BookingTime, ["h:mm A"]).format("HH:mm"), // "16:00",
                NoOfGuest, // 10,
                GuestDetails:{
                    GuestTitleId:selectedTitle[0].value,
                    GuestTitle: selectedTitle[0].label, //: "Mr.",
                    FirstName, //: "Yuvi",
                    LastName, //": "A",
                    ContactNoCountryCode: selectedTelephoneCode[0].label, // ": "91",
                    ContactNo, //": "9738854149",
                    EmailId //": "yuvi@lucidits.com"
                },
                Instruction,
             }, {
             headers: { Authorization: `Bearer ${launch.outletListData.token}`}}
           ).then(response => {
           
            if (response.data.errorCode === 1) {
                dispatch(handleModalTitle(response.data.message))
             // setModalTitle(response.data.message)
               setBookingHandlerToggle(false)
            }
        
            if (response.data.errorCode === 0) {
               axios.post(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}SaveTableBooking`, 
                 {
                   OutletCode:outletCode,
                   "BookingDate":bookingDate, // "04-Aug-2022",
                   "BookingTime":moment(BookingTime, ["h:mm A"]).format("HH:mm"), // "16:00",
                    NoOfGuest, // 10,
                    GuestDetails:{
                       GuestTitleId:selectedTitle[0].value,
                       GuestTitle:selectedTitle[0].label, //: "Mr.",
                       FirstName, //: "Yuvi",
                       LastName, //": "A",
                       ContactNoCountryCode:selectedTelephoneCode[0].label, // ": "91",
                       ContactNo, //": "9738854149",
                       EmailId //": "yuvi@lucidits.com"
                   },
                   Instruction,
                   }, {
                     headers: { Authorization: `Bearer ${launch.outletListData.token}`}}
                     ).then(res => {
                   if (res.data.errorCode === 0) { 
                   setSaveToggle(false)
                   // setModalTitle('')
                     dispatch(handleModalTitle('Your Booking Success'))
                     setDiffNo(false)
                    //setModalSave(!modalSave)
                     setBookingHandlerToggle(false)  
                      setBookingDate(d.toISOString().split('T')[0])
                      setBookingTime('')
                      setNoOfGuest(1)
               }
         
            })
            }
           })
            }  
        
          //  return () => setBookingHandlerToggle(false)  

        }, [tableBooking.loggedIn, bookingHandlerToggle, launch.outletListData.token]) 
  
        useEffect(() => {
          //  const tokenOption = launch.outletListData.token
          //  if (tokenOption && tableBooking.selectedOutlet.outletCode && bookingDate ) timeSlotRef.current = true

              console.log(launch.outletListData.token, tableBooking.selectedOutlet.outletCode, bookingDate, timeSlotRef.current)
            // GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetTimeSlotList?OutletCode=TERC&BookingDate=04-Aug-2022'
              if (launch.outletListData.token && tableBooking.selectedOutlet.outletCode && bookingDate && timeSlotRef.current && !tableBooking.isOpenBL) {  
                   timeSlotListHandler()
                 
                }
                 if (launch.outletListData.errorCode === 1) {
                   dispatch(handleModalTitle(launch.outletListData.message))
                 }   
            }, [tableBooking.selectedOutlet.outletCode, bookingDate, launch.outletListData.token])


                       //'https://dev.lucidits.com/LUCIDAPI/V1/GetTitleList'    
                       const getTitleList  = () => {
                        if (titleRef.current) axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/GetTitleList`,
                           { 
                           headers: { Authorization: `Bearer ${launch.token}`},
                           "Content-Type": "application/json"
                           } 
                          ).then((response) => { 
                          
                          const list = response.data.response
                          setOptionsTitle(() => list.titleList.map(title => ({value:title.titleId, label : title.titleName})))
                         // console.log(response.data.response)
                          }).catch(error => console.log(error))
                          titleRef.current = false
                        }
           
                  useEffect(() => {  
                   //GET 'https://dev.lucidits.com/LUCIDAPI/V1/GetMobileCountryCode'
                         if (token) { 
                                     getTitleList()
                                     //toggleRef.current = false
                                    //  getPropertyHandler()  
                               if (mobileCodeRef.current)  axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/GetMobileCountryCode`,
                                    { 
                                  headers: { Authorization: `Bearer ${token}`},
                                  "Content-Type": "application/json"
                                  } 
                                 ).then((response) => { 
                                 // setMobileCountryCodeData(response.data.response)
                                    const list = response.data.response
                                  setOptionsTelephoneCode(() => list.mobileCountryCodeList.map(code => ({value:code.countryCode, label : code.telephoneCode})))
                               
                                 }).catch(error => console.log(error)) 
         
                                 mobileCodeRef.current = false
                             }
             
                     }, [token])
   
         
                 const updateTableBookingData = () => {
                      dispatch(handleBooking({
                              bookingDate,
                              NoOfGuest, 
                              BookingTime,
                              selectedTitle: selectedTitle,  
                              selectedTitleId: selectedTitle[0].value,
                              FirstName,
                              LastName, 
                              selectedTelephoneCode: selectedTelephoneCode[0].label,
                              ContactNo, 
                              EmailId, 
                              Instruction
                        }))
                    }

                      const bookingSubmitHandler = () => {
                     
                               if (!bookingDate) {
                                dispatch(handleModalTitle('Kindly select Booking Date'))
                               } else if (!NoOfGuest) {
                                dispatch(handleModalTitle('Kindly select Pax'))
                               } else if (!BookingTime) {
                                dispatch(handleModalTitle('Kindly select Booking Time')) 
                                  // setModalError(!modalError)
                               }  else if (!FirstName) {
                                 dispatch(handleModalTitle('Kindly Enter Your Name'))
                                 // setModalError(!modalError)
                              } else if (!ContactNo || ContactNo.length !== 10) {
                                 dispatch(handleModalTitle('Kindly Enter Valid Contact No.'))
                          //setModalError(!modalError)
                       // } //else if (ContactNo !== tableBooking.tableData.ContactNo) { 

                       //  dispatch(sendOTP({ContactNo, token:launch.token}))
                        // setErrorMessageOTP('')
                   //     dispatch(handleModalTitle('OTP'))
                       // setModalOTP(!modalOTP)
                     //   setDiffNo(true) 
                    //  }
                        } else if (!loggedIn) {    
                        dispatch(sendOTP({ContactNo, token:launch.token}))
                        dispatch(handleModalTitle('OTP')) 
                        setBookingHandlerToggle(false)  
                        updateTableBookingData()
                      }else if (ContactNo !== tableBooking.tableData.ContactNo) {
                        setDiffNo(true)
                         dispatch(handleLogin(false)) // not to remove customer details while logout
                        setBookingHandlerToggle(true) // not to remove customer details while logout
                        dispatch(sendOTP({ContactNo, token:launch.token}))
                        dispatch(handleBooking({...tableBooking.tableData, ContactNo}))
                        dispatch(handleModalTitle('OTP'))  
                        updateTableBookingData()
                      }else {  
                         // otpHandler ()
                         // setErrorMessageOTP('')
                          setBookingHandlerToggle(true)   
                          updateTableBookingData()        
                     } 
                   }  
                    
         return(
            <Layout outletData = {outletDetails}  isOpenBL = {props.isOpenBL}>
               <Header/>
             { 
             // (!propertyName && !outletName) && <Spinner animation="grow" variant="primary" />
            }
             { propertyId && outletCode &&
              <CardBody
              className="mt-1"
               style={{backgroundColor:'white', border:'none', paddingTop:'80px'}}>{
                   //left head starts here
                }
                 <Row className="d-flex justify-content-center" >
                    <Col md={5} sm={5}>
                    <Row>
                    <Col md={3} sm={5} style={isTabletOrMobile ? {maxWidth:'45%'} : { width:'40%'}}>
                    <Label for="date" style={ {width:'75px'}}>Date: *</Label> 
                     <Input type='date' className='p-1' name='date' required
                      style={isTabletOrMobile ? {fontSize:'11px', width:'100%', height:'30px'} : {width:'185px'}}
                      value={bookingDate}
                      min = {d.toISOString().split('T')[0]}
                       onChange={e => {  
                        timeSlotRef.current = true
                          setBookingDate(e.target.value) 
                       }} 
                      />
                    </Col>
                    <Col sm={2} style={isTabletOrMobile ? { maxWidth:'55%'} : { width:'60%'}}>     
                    <Label for="noofguest" style={isTabletOrMobile ? {width:'100px'} : {width:'110px', padding:'0px'}}>No of Guest: *</Label> 
                    <Input type="number"
                    // class="form-control"  
                     style={isTabletOrMobile ? {fontSize:'11px', width:'100%'} : {height:'35px',  width:'175px'}}
                     value= {NoOfGuest}
                     min = {1}
                     max={maxPax}
                     onChange={ e => {
                       if (e.target.value > maxPax) dispatch(handleModalTitle(`Maximum booking available is ${maxPax}`))
                       setNoOfGuest(e.target.value)
                      }}   
                   />  
                     </Col> 
                     </Row>
                     <Row className='mt-3' style={{display:'flex', flexDirection:'row'}}>
                     <Col sm ='10' style={isTabletOrMobile ? {maxWidth:'100%', fontSize:'11px', marginBottom:'15px'} : {}}>
                     <Label for="time" style={isTabletOrMobile ? {width:'100px'} : {width:'60px', padding:'0px'}}>Time: *</Label>
                     
                    <div className='p-0 form-control text-center hvr' style={isTabletOrMobile ? {fontSize:'11px', maxWidth :'100%',  height:"130px", overflowY:'scroll', margin:'0px'} : {height:"195px", overflowY:'scroll', width:'100%'  }}>
                       {!timeSlotList && <Loading />}
                      {timeSlotList && timeSlotList.timeSlotList.length === 0 && <p style={{color:'red'}}>No Slot Available for booking</p>}
                      {timeSlotList && timeSlotList.timeSlotList.map((time, id) =>{
                        
                        return (
                           <Button outline key={id} className="m-1" size={isTabletOrMobile ? "sm" :""}   
                            style={isTabletOrMobile ? {fontSize:'11px', backgroundColor: (BookingTime && (BookingTime === time.timeSlot && timeColor)), color:  (BookingTime &&(BookingTime === time.timeSlot && 'white'))} : {backgroundColor:  (BookingTime &&(BookingTime === time.timeSlot && timeColor)), color:  (BookingTime &&(BookingTime === time.timeSlot && 'grey'))}}
                               onClick ={() => {  
                                setBookingTime(time.timeSlot)
                                setTimeColor('black')
                                
                             }} 
                           >{time.timeSlot}</Button>
                          )
                       })} 
                     </div>
                    </Col>  
                     </Row>
                    </Col>
                    {
                  //right head starts here
                 }
                    <Col md={5} sm={5} style={{paddingLeft:'10px'}} >
                    <Row > 
                    <Form>
                    <Label for="name" style={isTabletOrMobile ? {width:'100px'} : {width:'130px'}}>Name : *</Label>
                    <FormGroup row>   
                    <Input type="select" name="title" id="name"  className='p-1 ms-2'   
                    style={isTabletOrMobile ? {fontSize:'11px', width:'60px'} : {width:'60px'}}
                    onChange={e => setSelectedTitle(optionsTitle.filter(item => item.label === e.target.value))}              
                     >
                        {optionsTitle && optionsTitle.map((field) => {
                        
                           return (
                              <option key={field.value}>
                               {field.label}
                              </option>
                            )
                        })}
                         </Input>
                         <Input type="text" name="first" id="name1" placeholder="first name" className='py-1 ms-1 in-text' 
                          onChange={e => setFirstName(e.target.value)}    
                          value={FirstName}
                          style={isTabletOrMobile ? {fontSize:'11px', maxWidth:'36%'} : {width:'225px'}}
                         /> 
                           <Input type="text" name="second" id="name2" placeholder="last name" className='py-1 in-text ms-1'
                         onChange={e => setLastName(e.target.value)} 
                         value={LastName}
                         style={isTabletOrMobile ? {fontSize:'11px',  maxWidth:'36%'} : {width:'225px'}}
                         />  
                     </FormGroup>
                     <Label for="name" style={isTabletOrMobile ? {width:'100px'} :{width:'130px'}}>Contact No : *</Label>
                      <FormGroup row> 
                          <Input type="select" name="tcode" id="tcode"  className='p-1 ms-2' 
                              style={isTabletOrMobile ? {fontSize:'11px', width:'60px'} : {width:'60px'}}
                              onChange={e => setSelectedTelephoneCode(optionsTelephoneCode.filter(item => item.label === e.target.value))}
                                 > 
                                    {optionsTelephoneCode && optionsTelephoneCode.map((field) => {
                                     
                                       return (
                                          <option key={field.value}>
                                           {field.label}
                                          </option>
                                        )
                                    })}
                             </Input>  
                             <Input type="number" name="mobile" id="mobile" placeholder="mobile no." 
                              style={isTabletOrMobile ? {fontSize:'11px', maxWidth:'36%'} : {width:'225px'}}
                              value={ContactNo}
                              className='py-1 ms-1 in-text' minLength={10} maxLength = {10} 
                              onChange={e => { 
                               setContactNo(e.target.value)  
                             }}
                             />   
                         </FormGroup>
                         <Label for="name" style={isTabletOrMobile ? {width:'100px'} : {width:'130px'}}>Email ID : </Label>   
                         <FormGroup row> 
                         <Input type="text" name="email" id="email" placeholder="emailid" className='py-1 ms-2 in-text' 
                         style={isTabletOrMobile ? {fontSize:'11px', maxWidth:'95%'} : {width:'520px'}}
                         onChange ={e => setEmailId(e.target.value)}/>   
                        </FormGroup>
                       
                         { 
                          (outletDetails.outletDetails && outletDetails.outletDetails.enableInstruction) && <Label for="name" style={isTabletOrMobile ? {width:'100px'} : {width:'130px'}}>Instruction: </Label>
                         }
                          {
                           (outletDetails.outletDetails && outletDetails.outletDetails.enableInstruction) && 
                            <FormGroup row> 
                             <Input type="text" name="instruction" id="instruction" placeholder="instruction" className='py-1 ms-2 in-text'
                                    style={isTabletOrMobile ? {fontSize:'11px', maxWidth:'95%'} : {width:'520px'}}
                                    onChange = {e => setInstruction(e.target.value)}
                            />  
                            </FormGroup>
                            // NOTE : Submit handler is in footerAdd component, data accessed via redux
                         }
                       </Form>      
                      </Row>
                     </Col> 
                       </Row> 
                       <Row  className ='d-flex justify-content-center' >
                   <Col md='2' style={{ textAlign:'center'}}>
                   {outletDetails.outletDetails && outletDetails.outletDetails.termsAndConditions.length > 0 &&   <u style={{textUnderlineOffset: '5px'}}>Terms & Conditions</u> }
                   </Col>
                   </Row> 
                  <Row  className ='d-flex justify-content-center mb-4' > 
                   <Col md='6' > 
                      {outletDetails.outletDetails && outletDetails.outletDetails.termsAndConditions &&
                        <div style={{minWidth:'100px',  borderRadius:'5px', textAlign:'center'}} dangerouslySetInnerHTML = {{__html: outletDetails.outletDetails.termsAndConditions.map(item =>item.termsAndConditions)}}>
                         {  //border:'solid 1px #ced4da'
                         
                         } 
                        </div>
                      }
                   </Col>
                 </Row> 
                <Row className='justify-content-center mt-2'>
                <Col sm={2} style={{ textAlign:'center', marginBottom:'15px'}}>
                   <Button style={{backgroundColor:'black'}} onClick={ () => {
                       // if ()
                       bookingSubmitHandler()
                      setSaveToggle(true)
                   }}>
                     Book Table
                   </Button>
                </Col> 
              </Row> 
              </CardBody> 
              }
                <ModalsComponent 
                // otpReferenceId={otpReferenceId}
                // otpExpiryDuration ={otpExpiryDuration}
                // contactHandler={contactHandler}
                 setBookingHandlerToggle={setBookingHandlerToggle}
                 bookingHandlerToggle ={bookingHandlerToggle} 
                 optionsTelephoneCode={optionsTelephoneCode}
                 />
             </Layout>
         )
}

export default TableBookingComp