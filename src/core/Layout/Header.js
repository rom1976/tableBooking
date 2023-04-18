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
import { getPropertyList } from "../../redux/propertyData";
import { getOutletDetails, getOutletList } from "../../redux/launch";
 

const Header = (props) => {
const tableBooking = useSelector(state => state.tableBooking)
const [loggedIn, setLoggedIn] = useState(tableBooking.loggedIn)
const property = useSelector(state => state.propertyList)
const dispatch = useDispatch()
const launchData = useSelector(state => state.launch) 
const [token, setToken] = useState(launchData.token) 
const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
const [outletData, setOutletData] = useState(launchData.outletListData);
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
 const outletDetailsRef = useRef(true)

      useEffect(() => { 
           if (launchData.outletData) setOutletData(launchData.outletListData)
           if (launchData.outletDetails) setOutletDetails(launchData.outletDetails.outletDetails)
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
         //    if (launchData.paramData.outletCode !== 'NONE' && outletCode !== "" && outletCode !== "NONE") {
         //     
         //     setOutletCode(launchData.paramData.outletcode)  
        //     }

        //    }
          
           if (launchData.token) {
            setToken(launchData.token)
           } 
             
        }, [launchData.outletDetails, launchData.token, launchData.outletData])

     useEffect(() => {
           if (tableBooking) setLoggedIn(tableBooking.loggedIn)

            if (tableBooking.selectedProperty) {
              console.log(sel)
                 const sel = tableBooking.selectedProperty
                 setPropertyName(sel.propertyName)
                 setPropertyId(sel.propertyId)
                 }
              
              const sel = tableBooking.selectedOutlet
              console.log(sel)
              
              setOutletName(sel.outletName)
              setOutletCode(sel.outletCode)
              setImageUrl(sel.imageUrl)
              // for updating outlet details post outlet selection
                if (sel.outletCode && launchData.outletListData.token && outletDetailsRef.current) {
                  dispatch(getOutletDetails({outletCode:sel.outletCode, tokenOption:launchData.outletListData.token}))
                  outletDetailsRef.current = false  
         }
        
     }, [tableBooking.selectedOutlet.outletCode, tableBooking.selectedProperty, tableBooking.loggedIn, launchData.outletListData.token])
        
       // for resetting while changing outleCode  
       useEffect(() => {
            if (tableBooking.selectedOutlet.outletCode) {
              outletDetailsRef.current = true
            }
            return () =>   outletDetailsRef.current = false
       },[tableBooking.selectedOutlet.outletCode])
     
           useEffect(() => {  
              if (property.propertyData.propertyList) { 
                    const pr = property.propertyData.propertyList
                    setPropertyCount(pr.length)  
                   if (property.propertyData.propertyList.length === 1 && token && outletListRef.current) { 
                      const [propertyObj] =  property.propertyData.propertyList
                     
                      dispatch(handlePropertySelection({propertyName:propertyObj.propertyName, propertyId:propertyObj.propertyId}))
                      dispatch(getOutletList({propertyId:propertyObj.propertyId, token}))
                      outletListRef.current = false
                    } else if (property.propertyData.propertyList.length > 1) {
                        if (!propertyName || !propertyId) {
                             dispatch(handleModalTitle('Select a Location'))
                          } 
                       } 
                 }
              
            },[property.propertyData.propertyList, token, propertyId])

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
 
 
       useEffect(() => {      
            if (launchData.outletListData.outletList) {    
                      setOutletCount(launchData.outletListData.outletList.length) 
                   if (launchData.outletListData.outletList.length === 1 ) {   
                         const [outl] = launchData.outletListData.outletList
                         
                         // closeModalLink()
                        
                          setImageUrl(outl.imageUrl)
                          setOutletName(outl.outletName)
                          setOutletCode(outl.outletCode) 
                          dispatch(handleOutletSelection({outletName:outl.outletName, outletCode:outl.outletCode, imageUrl:outl.imageUrl}))

                          //sessionStorage.setItem('paramData',JSON.stringify({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:outletcode, outletName:outletName, imageUrl:imgurl})) 
                   }  else if (launchData.outletListData.outletList.length > 1) {  
                             // dispatch(handleOutletSelection({outletName:'', outletCode:'', imageUrl:''})) 
                           if (outletName === 'NONE' || outletName === '' || !outletName) { 
                                dispatch(handleModalTitle('Select a Restaurant'))  
                            }  //else {
                            //    dispatch(handleOutletSelection({outletName:outletName, outletCode:outletCode, imageUrl:imageUrl}))
                        //    } 
                   }}   
               }, [launchData.outletListData.outletList])

                      useEffect(() => {      
                           if (outletDetails && outletDetails.imageUrl) { 
                    
                                  // setOutletCount(outletList.outletList.length)  
                                     const imgurl = outletDetails.imageUrl 
                                    // closeModalLink()
                                     setImageUrl(imgurl)
                                  
                                }   
                              
                         }, [outletDetails])

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
              >{outletName}
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
                    dispatch(getPropertyList(token))
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