import React, { Fragment, useState, useRef, useEffect } from "react"
import Modal from 'react-modal' 
import { useSelector, dispatch, useDispatch } from "react-redux"
import { Button, Col, FormGroup, Input, Row } from "reactstrap"
import { useMediaQuery } from 'react-responsive'; 

import dateFormat from "dateformat";
import Countdown from 'react-countdown'; 
import { Check } from "react-feather";
import axios from "axios"; 
import { handleBooking, handleLogin, handlePropertySelection, handleOutletSelection } from "../../../redux/tableBooking";
import { handleModalTitle, sendOTP } from "../../../redux/modals";
import { getOutletDetails, getOutletList, handleOutletList } from "../../../redux/launch";
  
const ModalsComponent = (props) => { 
    Modal.setAppElement('#root') 
    const dispatch = useDispatch()
    const launch = useSelector((state => state.launch)) 
    const modalsData = useSelector(state => state.modals) 
    const tableBooking = useSelector(state => state.tableBooking)
    const property = useSelector(state => state.propertyList) 
    const [token, setToken] = useState(launch.token)  
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)' })  
    const [optionsTelephoneCode, setOptionsTelephoneCode] = useState('') 
     const [loggedIn, setLoggedIn] = useState(tableBooking.loggedIn)
     const [bookingHandlerToggle, setBookingHandlerToggle] = useState(false)
    const contactNoRef = useRef(null)  
    const [modalErrorMessage, setModalErrorMessage] = useState('')
    const inputOTP4FocRef = useRef(null) 
    const inputOTP4Ref = useRef(null);
    const [errorMessageOTP, setErrorMessageOTP] = useState('')
    const [otpExpiryDuration, setOtpExpiryDuration] = useState('')
    const [countDown, setCountDown] = useState(0)
    const [modalTitle, setModalTitle] = useState(props.modalTitle)
    const [saveToggle, setSaveToggle] = useState(false)
    const [ContactNo, setContactNo]  = useState('')
    const [otpReferenceId, setOtpReferenceId] = useState('')
    const [modalContent, setModalContent] = useState(props.modalContent)
    const [FirstName, setFirstName] = useState('')
    const [LastName, setLastName]  = useState('')
    const [diffNo, setDiffNo] = useState(false)
    const [selectedTelephoneCode, setSelectedTelephoneCode] = useState('')
    const [propertyList, setpropertyList] = useState(property.propertyData.propertyList)
    const [propertyName, setPropertyName] = useState('') 
    const [propertyId, setPropertyId] = useState('')
    const [outletCode, setOutletCode] = useState('')
    const  [outletName, setOutletName] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [outletList, setOutletList] = useState('')
    const customStyles = {
        content: {
          top: '40%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          maxHeight:'90%', 
          //overflowY:'scroll',
          maxWidth:'80%',
          minWidth:'30%',
          borderRadius:'10px'
          }
        }
        const [modalIsOpenLink, setIsOpenLink] = useState(false) 
        function openModalLink() {
           setIsOpenLink(true) 
        } 
        
        function afterOpenModal() {
          // references are now sync'd and can be accessed.
          //   subtitle.style.color = '#f00'
        }
    
        function closeModalLink() {  
                    setIsOpenLink(false) 
                //    setModalTitle('')  
                   dispatch(handleModalTitle(''))
            if (modalTitle === 'Your Booking Success')  setSaveToggle(true)  
        } 
        useEffect(() => {
          setOptionsTelephoneCode(props.optionsTelephoneCode)
        }, [props.optionsTelephoneCode])
  
        useEffect(() => {
           if (launch.outletListData) {
             setOutletList(launch.outletListData)
           }
        }, [launch.outletListData])

        useEffect(() => { 
            const bkng = tableBooking.tableData
            console.log(bkng)
               // setBookingDate(bkng.bookingDate)
              //  setNoOfGuest(bkng.NoOfGuest)
              //  setBookingTime(bkng.BookingTime)
               // setSelectedTitle()
                setFirstName(bkng.FirstName)
                setLastName(bkng.LastName)
               // setSelectedTelephoneCode(bkng.selectedTelephoneCode)
                setContactNo(bkng.ContactNo)
               // setEmailId(bkng.EmailId)
               // setInstruction(bkng.Instruction)
               setLoggedIn(tableBooking.loggedIn)
         }, [tableBooking])

         useEffect(() => {
              if (launch.token){
                setToken(launch.token)
              }
         }, [launch.token])
 
       useEffect(() => {
          // redux modal title update
           setModalTitle(modalsData.modalTitle)
           if (modalsData.otpData) { 
              setOtpReferenceId(modalsData.otpData.otpReferenceId)
              setOtpExpiryDuration(Number(modalsData.otpData.otpExpiryDuration * 60000))
           }
       }, [modalsData])

       useEffect(() => {
        if (modalsData.otpData) { 
            setOtpReferenceId(modalsData.otpData.otpReferenceId)
            setOtpExpiryDuration(Number(modalsData.otpData.otpExpiryDuration * 60000))
         }
        
       }, [modalsData.otpData])
 
   
        useEffect(() => {
               if (otpExpiryDuration) setCountDown(Date.now() + otpExpiryDuration)
           }, [otpExpiryDuration])
        
        useEffect(() => {
          if (property.propertyData) setpropertyList(property.propertyData.propertyList) 
        }, [property.propertyData])   

        const ErrorModal = (props) =>{
            return ( 
              <div className="d-flex justify-content-center m-0">
                  <p style={{color:'red'}}>{props.message}</p>
               </div> 
           )
          }
           
         const otpHandler = () => {     
             // GET 'https://dev.lucidits.com/LUCIDAPI/V1/SendOTP?OTPFor=4&MobileNo=9738854149'
              if ((!loggedIn && (ContactNo || contactNoRef.current))) dispatch(sendOTP({ContactNo, contactNoRef: contactNoRef.current, token: outletList.token || token}))
            
         }
 
    const contactHandler = (no) => {       
        //  if (ContactNo.length !== 10) {    
          if (no.length !== 10 ) {
            // && ContactNo.length !== 10 removed 
           setModalErrorMessage('Kindly Enter Valid Mobile No') 
          }else { 
            if (modalTitle === 'Your Contact No' && !ContactNo || (ContactNo !== no)) {
                          if (ContactNo !== no) {
                            dispatch(handleLogin(false))
                          }

                        setContactNo(no) 
                      //  dispatch(handleBooking({...tableBooking.tableData, ContactNo:no}))
                        otpHandler() 
                        dispatch(handleModalTitle('OTP')) 
                      } else {
                        setModalErrorMessage('') 
                        otpHandler() 
                        dispatch(handleModalTitle('OTP')) 
                }    
                      }
              
       }
  
          useEffect(() => {
       
          if(modalTitle === 'Select a Restaurant') { 
            setModalContent('') 
            !modalIsOpenLink && openModalLink()
          } else if(modalTitle === 'Select a Location') { 
              setModalContent('')
              !modalIsOpenLink && openModalLink()
          } else if (modalTitle === 'Your Contact No') {
             setModalContent('')
            // !modalIsOpenLink &&
             openModalLink()
          } else if (modalTitle === 'OTP') { 
            setErrorMessageOTP('')
           setModalContent('')
           !modalIsOpenLink && openModalLink()
         } else if (modalTitle === 'Your Booking Success') {
            setModalContent('')
            !modalIsOpenLink && openModalLink()
         }else if (modalTitle && modalTitle.length > 5) {
          setModalContent(<ErrorModal />)
          !modalIsOpenLink && openModalLink()
         }  
         else{
          closeModalLink()
         }
      
    }, [modalTitle])
        
       
    useEffect(() => {
     if(props.modalTitle) dispatch(handleModalTitle(props.modalTitle))
        
    }, [props.modalTitle])

       const PropertyModal = () =>{
         return ( 
          <FormGroup row className="d-flex justify-content-around">
              {
               propertyList && propertyList.map((prop, id) => {
                    
                  return (
                    <Col className='p-0 mx-2' key = {id}>
                    <Button outline  size="sm"  
                    className="bb"
                    style={{width:'160px', height:'50px', margin:'5px'}}
                    onClick={() => {
                       setPropertyName(prop.propertyName)
                       setPropertyId(prop.propertyId)
                       closeModalLink()
                      // setModalProperty(!modalProperty)
                      //setModalTitle('Select a Restaurant')
                       setOutletCode('')
                       setOutletName('')
                       dispatch(handlePropertySelection({propertyName:prop.propertyName, propertyId:prop.propertyId}))
                       // call here outletlist based on property selection
                       // dispatch(handleOutletSelection({outletName:'', outletCode:'', imageUrl:''}))

                         dispatch(handleOutletList(''))
                         dispatch(handleOutletSelection({}))
                       dispatch(getOutletList({propertyId:prop.propertyId, token:launch.token}))
                       }
                      }
                     >{prop.propertyName}</Button> 
                  </Col>
                  )
                })
              }      
        </FormGroup>   
        )
      }
    
    const SelectRestaurant = () => {
      return (
        <Fragment>
          <FormGroup row className="d-flex justify-content-around">
          {
           launch.outletListData.outletList && launch.outletListData.outletList.map((outlet, id) => { 
              return (
                <Col className='p-0 mx-2' key = {id}>
                <Button
                  className="bb"
                 outline 
                 size="sm"
                  style={{width:'160px', height:'50px', margin:'5px'}}
                 onClick={() => { 
                   setOutletName(outlet.outletName)
                   setOutletCode(outlet.outletCode)
                   setImageUrl(outlet.imageUrl)  
                   closeModalLink()
                   setModalTitle('')  
                   dispatch(handleOutletSelection({outletName:outlet.outletName, outletCode:outlet.outletCode, imageUrl:outlet.imageUrl}))    
                   dispatch(getOutletDetails({outletCode:outlet.outletCode, tokenOption:launch.outletListData.token}))  
                  }
                  }
                 >{outlet.outletName}</Button> 
              </Col>
              )
            })
          }        
    </FormGroup>
    <div className="d-flex justify-content-center m-0"> 
       </div>
        </Fragment>
      )
    }
     
    const LoginModalContent = () => {
      return (
        <div> 
        <FormGroup row>   
         <Input type="select" name="tcode" id="tcode"  className='p-1 ms-2' style={isTabletOrMobile ? {fontSize:'11px', width:'60px'}: {width:'60px'}}
          onChange={e => { 
            setSelectedTelephoneCode(optionsTelephoneCode.filter(item => item.label === e.target.value))
          }}
           >
              {optionsTelephoneCode && optionsTelephoneCode.map((field) => { 
                 return (
                    <option key={field.value}>
                     {field.label}
                    </option>
                  )
              })}
       </Input>  
      <Input type="number" name="mobileno" id="mobileno" placeholder="Mobile no." className='py-1 ms-2'
      autoFocus = "autofocus"  
      defaultValue={ContactNo}
      //  value={contactNoRef.current && contactNoRef.current}
        style={{width:'200px'}}
         onChange={e => {
          contactNoRef.current = e.target.value 
          if (modalErrorMessage) setModalErrorMessage('')
           //setContactNo(e.target.value)  
          
         }   
         }
         
        />  
      </FormGroup>
        </div>  
      )
    }
      const renderer = ({minutes, seconds }) => {
        return <span>{minutes}:{seconds}</span>
       } 

      const OTPModalContent = () =>{
        return (
           <Fragment>
            <div className="d-flex justify-content-center">   
              <Input type="number" name="otp4" id="otp4" 
              autoFocus
                min ={0} max={9} 
               //value={inputOTP4Ref.current}
               innerRef={inputOTP4FocRef}
               placeholder=""  maxLength="1" className='p-0 m-0'
               style={{textAlign:'center', width:'150px'}} 
               onChange = {e => {
                   inputOTP4Ref.current = e.target.value 
                 if (errorMessageOTP) setErrorMessageOTP('')  
              }
            }
               />  
          </div>
  
          { errorMessageOTP.length > 0 && <p style={{fontSize:'11px', color:'red'}}>
              { errorMessageOTP}
            </p>
          }
             
          <div className="d-flex justify-content-center m-0">
             <p><small>Resend OTP after {otpExpiryDuration && <Countdown date={countDown} 
               renderer={renderer}
               intervalDelay={0}
               precision={3}
              //autoStart ={true}
               />
               }</small></p>
             </div>
           
           </Fragment>
        )
      }

      const SaveModal = () => {
        return ( 
           <Fragment>
            <Row>
            <Col>
            <div className="d-flex justify-content-center m-0">
             <div style={{border:'solid  green'}}>
              <Check color="green" size={50} strokeWidth='5px'/> 
             </div>  
            </div>
            <div className="d-flex justify-content-center m-0">
            <p><small>Your Booking is Success</small></p>
             </div>  
            </Col>
          </Row>
           <Row>
             <Col>
             <div className="justify-content-center text-center"> 
               <p className="lh-1 m-0" >{tableBooking.selectedOutlet.outletName}</p> 
               <p  className="lh-1 mt-0">{tableBooking.selectedProperty.propertyName}</p> 
               <p className="lh-1 m-0">Date : {dateFormat(tableBooking.tableData.bookingDate, "dd-mm-yyyy")}</p> 
                 <p className="lh-1 m-0">Time : {tableBooking.tableData.BookingTime}</p>
               <p className="lh-1 mt-0">Guests : {tableBooking.tableData.NoOfGuest}</p>
               <p className="lh-1 m-0 fs-6 fw-bold text-primary"> Booking Status: Waiting  </p> 
               <p className="lh-1 m-0 fs-6"><small>[Restaurant will update your booking status soon]</small></p> 
             </div>
             </Col> 
           </Row>  
          </Fragment> 
       )
     } 
     const otpValidateHandler = () => {
      
      const tokenOption = outletList.token || token
          
        axios.post(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/ValidateOTP`, 
             {
               OTPReferenceId:otpReferenceId,
               OTP:  inputOTP4Ref.current
               }
            , {
            headers: { Authorization: `Bearer ${tokenOption}`}}
          ).then(res => { 
           if (res.data.errorCode === 0) {
              setErrorMessageOTP('')  
              dispatch(handleLogin(true)) 
              dispatch(handleBooking({...tableBooking.tableData, ContactNo}))
              //bookingHandlerToggle && 
              dispatch(handleModalTitle("Login Success"))
              props.setBookingHandlerToggle(true)
                !bookingHandlerToggle && setTimeout(() => {
               closeModalLink()
              }, 500);
              //if (modalOpened) setModalOpened(!modalOpened)
             // setModalOTP(false)
              localStorage.setItem('contactDetails',JSON.stringify({contactNo:ContactNo, firstName: FirstName, lastName: LastName, loggedIn:true}))
             if (diffNo) setBookingHandlerToggle(true)
             document.body.style.overflow = "visible"
             }
           if (res.data.errorCode === 1) {
             setErrorMessageOTP('Invalid OTP') 
             
           }
          }) 
      }


       const RenderModal = () => {   
        return (
           <div>
          <Modal isOpen={modalIsOpenLink}  
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModalLink}
              style={customStyles}
              overlayClassName="Overlay"
             > 
                      <div style={{
                       borderRadius:'3px',
                       height:'10px',
                       paddingBottom:'2px',
                       fontSize:'15px'
                     }}>
                     {(modalTitle !== 'Your Booking Success') && modalTitle} 
                       </div>  
                       <div style={{padding:'5px', marginTop:'10px'}}>
                            {modalContent}  
                            {modalTitle === 'OTP' && <OTPModalContent />}
                            {modalTitle === 'Your Contact No' && <LoginModalContent />}
                            {modalTitle === 'Your Booking Success' && <SaveModal />}
                            {modalTitle === 'Select a Location' && <PropertyModal />
                            } 
                            {modalTitle === 'Select a Restaurant' &&   launch.outletListData.outletList && <SelectRestaurant />} 
                       </div>
              { modalErrorMessage.length > 0 && <div>
                <p style={{color:'red', fontSize:'11px'}}>{modalErrorMessage} </p>
                </div>
                }
                 { modalErrorMessage.length === 0 && <div>
                <p style={{color:'red', fontSize:'11px'}}>{modalErrorMessage} </p>
                </div>
                }
              <div  
                className="d-flex justify-content-end "> 
                {modalTitle === 'Your Contact No' &&  <Button style={{backgroundColor:'black'}}
                     onClick={()=>{ 
                        contactNoRef.current ? contactHandler(contactNoRef.current) : contactHandler(ContactNo)       
                       }}
                > Continue</Button>}
               
                {modalTitle === 'OTP' && <Button 
               style={{backgroundColor:'black'}}
                onClick={() => {
                 otpValidateHandler()
                  }}
                >
                Login
              </Button> }
              </div>
            </Modal> 
          </div>
        )
      }
     
       
         return  <RenderModal />
       
         
         
       }

    export default ModalsComponent