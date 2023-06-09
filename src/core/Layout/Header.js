import React, { useEffect, useRef, useState } from "react"
import { CardHeader } from "reactstrap"
import { useMediaQuery } from 'react-responsive'; 
 
// custome hooks
import useBooking from "../../Hooks/useBooking";
 
import { Edit, Image } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Fragment } from "react";
import ModalsComponent from "../../view/TableBooking/Modals/ModalsComponent";
import { handleModalTitle } from "../../redux/modals";
import { handleLogin, handleOutletSelection, handlePropertySelection } from "../../redux/tableBooking";
import { getPropertyList, handleProperty } from "../../redux/propertyData";
import { getOutletDetails, getOutletList, handleOutletList } from "../../redux/launch";
 

const Header = (props) => {
const tableBooking = useSelector(state => state.tableBooking)
const [loggedIn, setLoggedIn] = useState(tableBooking.loggedIn)
const property = useSelector(state => state.propertyList)
const modalsData = useSelector(state => state.modals) 
const dispatch = useDispatch()
const launchData = useSelector(state => state.launch) 
const [token, setToken] = useState(launchData.token) 
const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' }) 
const [propertyId, setPropertyId] = useState(launchData.paramData.propertyId)
const [propertyName, setPropertyName] = useState('') //searchParams.get("propname") wrong prop name from jay's api
const [outletCode, setOutletCode] = useState('')
const [outletName, setOutletName] =  useState('')
const [imageUrl, setImageUrl] = useState('')
const [outletCount, setOutletCount] = useState(0)
const [propertyCount, setPropertyCount] = useState(0)
const [outletDetails, setOutletDetails] = useState(launchData.outletDetails.outletDetails)
//const [modalTitle, setModalTitle] = useState() used Redux to pass modal Title
 const outletListRef = useRef(true)
 const outletDetailsRef = useRef(false)
  

      useEffect(() => { 
           
           if (launchData.outletDetails.outletDetails) {
              setOutletDetails(launchData.outletDetails.outletDetails) 
              if (launchData.outletDetails.outletDetails.length > 0) outletDetailsRef.current = false
            }
              //  if (launchData.paramData) { 
                // closeModalLink() 
              //  if (launchData.paramData.propertyName !== 'NONE' && propertyName !== "" && propertyName !== "NONE") {
              //   setPropertyName(launchData.paramData.propertyName)
              //  
              //  }
              // if (launchData.paramData.propertyId !== 'NONE' && propertyId !== "" && propertyId !== "NONE") {
              //  
              //  setPropertyId( launchData.paramData.propertyId)
              // }
              //    if (launchData.paramData.outletName !== 'NONE' && outletName !== "" && outletName !== "NONE") {
              //     setOutletName(launchData.paramData.outletName)
              //     
              //    }  
   
              //    }  
           if (launchData.token) {
            setToken(launchData.token)
           } 
             
        }, [launchData.outletDetails, launchData.token, launchData.outletData])

        useEffect(() => {
          if (launchData.paramData.outletCode !== 'NONE' && launchData.outletListData.outletList) { 
              setOutletCode(launchData.paramData.outletCode)   
              console.log(launchData.outletListData.outletList, launchData.paramData.outletCode )
             if (launchData.outletListData.outletList.length > 0 && !outletCode && !tableBooking.selectedOutlet.outletCode) { // outleCode is mentioned to avoid running it when reset tablebooking 
                    const [defaultOutletObj] = launchData.outletListData.outletList.filter(item => item.outletCode === launchData.paramData.outletCode)
                                              //  alert(tableBooking.selectedOutlet.outletName)
                                              defaultOutletObj && dispatch(handleOutletSelection({outletName:defaultOutletObj.outletName, outletCode:defaultOutletObj.outletCode, imageUrl:defaultOutletObj.imageUrl}))
               } 
             }
          }, [launchData.paramData.outletCode, launchData.outletListData.outletList, modalsData.modalTitle])

     useEffect(() => {
           if (tableBooking) setLoggedIn(tableBooking.loggedIn)

            if (tableBooking.selectedProperty) { 
                 const sel = tableBooking.selectedProperty
                 console.log(sel.propertyId)
                 setPropertyName(sel.propertyName)
                 setPropertyId(sel.propertyId)
               
              //  if (!launchData.outletListData.outletList) outletListRef.current = true // updated while coming back from view page , call outletlist post property update
                 // isopenBL can be true while visiting back from view
                 }

                    //  tableBooking.selectedOutlet === '' for reset while selecting new property
               if (tableBooking.selectedOutlet.outletCode !== 'NONE') { 
                        const sel = tableBooking.selectedOutlet
                           // once outleCode is updated enable outletdetails ref  
                      if (sel.outletCode !== "NONE" || outletCode === '') {
                          // setOutletCode(sel.outletCode) 
                           setOutletName(sel.outletName)
                           setImageUrl(sel.imageUrl) 
                       // if (sel.outletCode !== outletCode) {
                       //   if (tableBooking.selectedOutlet.outletCode && tableBooking.selectedOutlet.outletCode !== 'NONE' && launchData.outletListData.token && outletDetailsRef.current) {
                       //                
                       //               outletDetailsRef.current = false   
                       //               dispatch(getOutletDetails({outletCode:tableBooking.selectedOutlet.outletCode, tokenOption:launchData.outletListData.token}))
                       //       
                       //   }
                       //   console.log(outletDetailsRef.current, outletCode, sel.outletCode)
//
                       // } 
                        if(sel.outletCode && sel.outletCode !== "NONE" && outletCode === '' && outletDetailsRef.current && launchData.outletListData.token) { 
                          outletDetailsRef.current = false
                          dispatch(getOutletDetails({outletCode:tableBooking.selectedOutlet.outletCode, tokenOption:launchData.outletListData.token}))
                       
                        }
                        if (sel.outletCode === outletCode && launchData.outletDetails.outletDetails && launchData.outletDetails.outletDetails.length === 0) {
                          outletDetailsRef.current = false
                        }
                      } 
                } 

               console.log(tableBooking)
            
               // if (!tableBooking.selectedOutlet.outletCode) {
               
               //} 
     }, [tableBooking.selectedOutlet, tableBooking.selectedProperty, tableBooking.loggedIn, launchData.outletListData.token])
        
       // for resetting while changing outleCode
       // Note : for different properties same outletCodes are repeated eg: Property 00002 - {"outletCode":"HAMR","outletName":"Hammered Dinein"} ,
       // Property 000001 - {"outletCode":"HAMR","outletName":"HSR Dinein",}   
  
         useEffect(() => {
                 // for updating outlet details post outlet selection
               //  if (tableBooking.selectedOutlet.outletCode && tableBooking.selectedOutlet.outletCode !== 'NONE' && launchData.outletListData.token && outletDetailsRef.current) {
               //   outletDetailsRef.current = false   
               //   dispatch(getOutletDetails({outletCode:tableBooking.selectedOutlet.outletCode, tokenOption:launchData.outletListData.token}))
               //  
               // }
               //    return () =>  outletDetailsRef.current = false   
         }, [tableBooking.selectedOutlet.outletCode,launchData.outletListData.token])

         useEffect(() => {
          if (tableBooking.isOpenBL && !outletListRef.current) { 
             // outletListRef.current = true  , getOutletList only while coming back from view
             dispatch(getOutletList({propertyId:tableBooking.selectedProperty.propertyId, token:launchData.token})) 
             outletDetailsRef.current = true
           } 
          },[tableBooking.isOpenBL])

           useEffect(() => {   
                            if (property.propertyData.propertyList) {  
                            
                                 console.log(tableBooking.selectedProperty.propertyId, launchData.token, outletListRef.current) 
                                  const pr = property.propertyData.propertyList
                                  setPropertyCount(pr.length)  
                                //  dispatch(handleOutletList(''))
                                 // dispatch(handleOutletSelection({})) 
                              // whenever page refresh happening outlet was not called, since outletcodes cane be similar, propertyId change can be used
                                if (tableBooking.selectedProperty.propertyId && launchData.token && outletListRef.current) {
                                     outletListRef.current = false    
                                  
                                   if(!tableBooking.isOpenBL) {
                                  //  alert(tableBooking.isOpenBL)
                                     dispatch(getOutletList({propertyId:tableBooking.selectedProperty.propertyId, token:launchData.token})) 
                                     outletDetailsRef.current = true
                                    }
                                       
                                  } else if (!tableBooking.selectedProperty.propertyId) {
                                  
                                          if ((launchData.paramData.outletCode === 'NONE' || !launchData.paramData.outletCode || !outletCode || outletCode === 'NONE') && launchData.token) {
                
                                           if (launchData.paramData.propertyId && tableBooking.selectedProperty.propertyId === '') {
                                                dispatch(getOutletList({propertyId:launchData.paramData.propertyId, token:launchData.token})) 
                                                outletListRef.current = false
                                                outletDetailsRef.current = true
                                              }}
                                           if (property.propertyData.propertyList.length === 1 && token && outletListRef.current) { 
                                               const [propertyObj] =  property.propertyData.propertyList 
                                                  dispatch(handlePropertySelection({propertyName:propertyObj.propertyName, propertyId:propertyObj.propertyId}))
                                                 
                                                if (token) {
                                                     dispatch(getOutletList({propertyId:propertyObj.propertyId, token})) 
                                                     outletListRef.current = false
                                                     outletDetailsRef.current = true
                                                   }  
                                            } else if (property.propertyData.propertyList.length > 1) {
                                          if (!propertyId || propertyId === 'NONE') {
                                               dispatch(handleModalTitle('Select a Location'))
                                               outletDetailsRef.current = true
                                             } else if (propertyId){
                                              console.log(property.propertyData.propertyList)
                                               const [propertyObj] =  property.propertyData.propertyList.filter(item => item.propertyId === propertyId) 
                                                console.log(propertyObj)
                                                propertyObj && dispatch(handlePropertySelection({propertyName:propertyObj.propertyName, propertyId:propertyObj.propertyId}))
                                                  if (token && propertyObj) {
                                                       dispatch(getOutletList({propertyId:propertyObj.propertyId, token}))
                                                         outletListRef.current = false
                                                         outletDetailsRef.current = true

                                                }
                                           }
                                      
                                       }
                                 }
                                
                          }
 
                },[property.propertyData.propertyList, launchData.token, tableBooking.selectedProperty.propertyId])

          //     useEffect(() => {
          //      if ((!propertyId || propertyId === "NONE") && (propertyList && propertyList.propertyList.length === 1))  { 
          //        const propertyNames = propertyList.propertyList.map(item => item.propertyName).filter(property => property)
          //        const propertyIds = propertyList.propertyList.map(item => item.propertyId).filter(property => property)   
          //      //  setPropertyId(propertyIds[0]) 
          //        setPropertyName(propertyNames[0])
          //        document.title = propertyNames[0] + '- Table Booking'
          //     
          //    } else if ((propertyId === "NONE" || !propertyId) && (propertyList && propertyList.propertyList.length > 1)) 
          //       { 
          //   //    setModalTitle("Select a Location")  
          //      
          //    } 
          //    if (propertyName === '' && (propertyId !== 'NONE' && propertyId) && propertyList && propertyList.propertyList.length ) {
          //   
          //      propertyList.propertyList.forEach(item => {
          //          if (propertyId === item.propertyId) setPropertyName(item.propertyName)
          //         
          //         })
          //    }

            //if (propertyList && PropertyId) {
            //  const area = propertyList.propertyList.filter(item => item.propertyId === PropertyId)
            //  setAreaName(area.areaName)
            //  setCityName(area.cityName) 
            //} 
            //   if (propertyList)  setPropertyCount(propertyList.propertyList.length)
  //    }, [propertyList])
  
       useEffect(() => {   console.log(modalsData)
                        if (launchData.outletListData.outletList) {  
                             console.log(launchData.outletListData.outletList)  
                                 setOutletCount(launchData.outletListData.outletList.length) 
                                 
                                 if(!tableBooking.selectedOutlet.outletCode || tableBooking.selectedOutlet.outletCode === '' || tableBooking.selectedOutlet.outletCode === 'NONE')  {  
                                    console.log(launchData.outletListData.outletList.length) 
                                     
                                      if (launchData.outletListData.outletList.length === 1 ) { 
                                        
                                           const [outl] = launchData.outletListData.outletList 
                                           dispatch(handleModalTitle(''))  
                                            setImageUrl('')
                                           setOutletName('')
                                          //  setOutletCode('') 
                                              dispatch(handleOutletSelection({outletName:outl.outletName, outletCode:outl.outletCode, imageUrl:outl.imageUrl}   ))
                                              dispatch(getOutletDetails({outletCode:outl.outletCode, tokenOption:launchData.outletListData.token}))
                                             // outletDetailsRef.current = true 
                                             
                                        
                                       }  else if (launchData.outletListData.outletList.length > 1) { 
                                             if (!outletCode || outletCode === 'NONE') {
                                              dispatch(handleOutletSelection({})) 
                                              dispatch(handleModalTitle('Select a Restaurant'))  
                                             }
                                              
                                             if (modalsData.modalTitle === 'Select a Location') {  
                                                  setImageUrl('')
                                                  setOutletName('')
                                                  // setOutletCode('')
                                                  dispatch(handleOutletSelection({})) 
                                                     dispatch(handleModalTitle('Select a Restaurant'))  
                                                // if (outletCode === 'NONE' || !outletCode ||  tableBooking.selectedOutlet.outletCode === '' || outletCode === '') 
                                              }
                                              //else if (launchData.paramData.outletCode === 'NONE' || !launchData.paramData.outletCode ||  tableBooking.selectedOutlet.outletCode === '' || outletCode === '') { 
                                            //
                                            //         dispatch(handleModalTitle('Select a Restaurant'))  
                                          
                                            //   } else if (launchData.paramData.outletCode && modalsData.modalTitle !== 'Select a Restaurant') {
                                            //    const [defaultOutletObj] = launchData.outletListData.outletList.filter(item => item.outletCode ===  launchData.paramData.outletCode)
                                            //     alert(tableBooking.selectedOutlet.outletName)
                                            //    dispatch(handleOutletSelection({outletName:defaultOutletObj.outletName, outletCode:defaultOutletObj.outletCode, imageUrl:defaultOutletObj.imageUrl}))
                                            //   }
                                           //else {
                                     //    dispatch(handleOutletSelection({outletName:outletName, outletCode:outletCode, imageUrl:imageUrl}))
                                  } 
                              } else if (tableBooking.selectedOutlet.outletCode &&  outletDetailsRef.current) { 
                                outletDetailsRef.current = false 
                                dispatch(getOutletDetails({outletCode:tableBooking.selectedOutlet.outletCode, tokenOption:launchData.outletListData.token}))
                            //    const [defaultOutletObj] = launchData.outletListData.outletList.filter(item => item.outletCode ===  tableBooking.selectedOutlet.outletCode)
                                
                              // dispatch(handleOutletSelection({outletName:defaultOutletObj.outletName, outletCode:defaultOutletObj.outletCode, imageUrl:defaultOutletObj.imageUrl}))
                              }
                    
                    }  
                   // } 
                 }, [launchData.outletListData.outletList,  tableBooking.selectedOutlet.outletCode, modalsData.modalTitle, launchData.outletListData.token])

                    //  useEffect(() => {      
                    //       if (outletDetails && outletDetails.imageUrl) {  
                    //              // setOutletCount(outletList.outletList.length)  
                    //                 const imgurl = outletDetails.imageUrl 
                    //                // closeModalLink()
                    //                 setImageUrl(imgurl)  
                    //            }   
                    //          
                    //     }, [outletDetails])

                       useEffect(() => {
                        const favicon = document.getElementById("favicon");
                        if (imageUrl) favicon.href = imageUrl
                        
                       }, [imageUrl])
      
   return (
     <Fragment>  
      <CardHeader
              className='text-dark fixed-top mb-5' 
              style={{border:'none', background:'#EAEAEA'}}>
              <div style={{float:'right', display:'flex', justifyContent: 'right', width:'15%'}}> 
              <div style={isTabletOrMobile ? {float: "right", position:'absolute', fontSize:'12px'} : {float: "right", position:'absolute'}}>
                {loggedIn ? <p   className='text-dark pe-1'
               onClick ={() => { 
                   localStorage.clear() 
                   sessionStorage.clear()
                 dispatch(handleLogin(false))
               }}
              >Logout</p> :
              <p
              style={{color:'black', display:'inline', cursor:'pointer', textDecorationLine:'underline'}} className='text-dark pe-1'
                  onClick={() => {
                 dispatch(handleModalTitle('Your Contact No'))    
                //  clearOTPInput()
                 }
                }>Login</p>
              }</div>
              </div>
              {
               // Left Side Logout
              }
             <div style={{float:'left', display:'flex', width:'85%'}}>
             {(imageUrl && <img src= {imageUrl} className=" rounded float-start img-fluid" alt="..." 
                style={isTabletOrMobile ? {maxwidth:'100px', maxHeight:'60px'} : {maxHeight:'70px', maxWidth:'200px'}}
               /> )||<Image size={50}/>
               }
               <div style={isTabletOrMobile ? {display:'flex', flexDirection:'column', paddingTop:'15px', fontSize:'12px'} : {display:'flex', flexDirection:'column', paddingTop:'15px'}}>
              <span className="ps-2"  
              >{tableBooking.selectedOutlet.outletName}
              { outletCount > 1 &&
               <span onClick={ ()=> { 
                dispatch(getOutletList({propertyId, token})) 
                dispatch(handleModalTitle('Select a Restaurant'))
                 //setModalOutlet(!modalOutlet) 
               //  setModalTitle()
                }} 
                style={{color:'#2ECC71', textDecoration:'none', }}
              >{' '}<Edit size={15} /></span>} </span> 
              <span className="ps-2"  
              >{propertyName}
               
                 { propertyCount > 1  && 
                   <span  
                   onClick={ ()=> { 
                   // dispatch(handlePropertySelection({}))
                  //  dispatch(handleOutletList(''))

                  //  dispatch(getPropertyList(token)) 
                    // setModalProperty(!modalProperty)
                   dispatch(handleModalTitle('Select a Location'))
                 }} 
                 style={{color:'#2ECC71', textDecoration:'none', padding:'1px'}}>  
                 {' '}
                <Edit size={15}  /> 
                </span>  }
                
              </span> 
             
          </div>  
             {
              // Right Side Logout
             }
              </div> 
   </CardHeader>
    <ModalsComponent  
     // setBookingHandlerToggle={setBookingHandlerToggle}
     // bookingHandlerToggle ={bookingHandlerToggle}
     // setLoggedIn={setLoggedIn}
     /></Fragment>
 
   )   
}

export default Header