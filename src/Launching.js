import { useSelector, useDispatch } from "react-redux";
import {getOutletDetails, handlePageId, handleViewPage } from "./redux/launch"; 
import useLaunch from "./core/utils/useLaunch";
import React, { useEffect, useState, useRef, Fragment, lazy } from 'react';
  
import View from "./View";
import CheckIn from "./view/check-in/CheckIn";
import LoadTableBooking from "./LoadTableBooking";
import Loading from "./Loading"; 
import { handleModalTitle } from "./redux/modals";
 
const Launching = () => {
  const launch = useLaunch() 
  const launchData = useSelector((state) => state.launch)
  const tableBooking = useSelector(state => state.tableBooking)
  const dispatch = useDispatch() 
  //const TableBooking = lazy(() => import('./TableBooking'));
  const [selfCheckIn, setSelfCheckIn] = useState(false)  
  //const navigate = useNavigate(); 
  const [viewPage, setViewPage] = useState() 
  const [OrganizationId, setOrganizationId] = useState(launchData.paramData.organizationId) 
  //const [OrganizationName] = useState(searchParams.get("orgname"))
  const [propertyId, setPropertyId] = useState(launchData.paramData.propertyId)
  const [propertyName, setPropertyName] = useState('') //searchParams.get("propname") wrong prop name from jay's api
  const [outletCode, setOutletCode] = useState(launchData.paramData.outletCode)
  const [remarks, setRemarks] = useState(launchData.paramData.remarks)
  const [token, setToken] = useState(launchData.token)  
     
    const [outletList, setOutletList] = useState(launchData.outletList) 
    const [imageUrl, setImageUrl] = useState('')  
    const [pageId, setPageId] = useState(launchData.pageId)
    const tokenRef = useRef(true)
    const reDirect = useRef(tableBooking.isOpenBL)
    const refOtDetails = useRef(false)

     //    outletlet list should be called only for multiple property options avaialble
     //     useEffect(() =>  {
     //       if (outletCode === 'NONE' || !outletCode) { 
     //          if (propertyId && launchData.token) dispatch(getOutletList({PropertyId: propertyId  , token:launchData.token}))  
     //          console.log(launchData.token, outletCode === 'NONE', !outletCode)
     //         }  
     //  
     //    }, [propertyId,launchData.token, outletCode])
      
     useEffect(() => {
      const favicon = document.getElementById("favicon");
      if (imageUrl) favicon.href = imageUrl

      console.log(imageUrl)
     }, [imageUrl])
    
    useEffect(() => {
          if (launchData) {
            setPropertyId(launchData.paramData.propertyId !== "NONE" ? launchData.paramData.propertyId : null)
            setRemarks(launchData.paramData.remarks)  
            setViewPage(launchData.viewPage)
            setPageId(launchData.pageId)
            setToken(launchData.token)
            setOutletCode(launchData.paramData.outletCode !=="NONE" ? launchData.paramData.outletCode !=="NONE" : null) 
         
          } 
           console.log(launchData)   

    }, [launchData.paramData.propertyId, launchData.paramData.remarks, launchData.viewPage, launchData.pageId, launchData.token, launchData.paramData.outletCode])

       useEffect(() => { 
          if (token && launchData.paramData.outletCode !== "NONE" && launchData.paramData.outletCode !== '' && !refOtDetails.current) {
             //   dispatch(getOutletDetails({tokenOption:token, outletCode:launchData.paramData.outletCode}))
                refOtDetails.current = true
            } else {
              console.log('No outlet Code')
            }
        }, [token, launchData.paramData]) 
     
       useEffect(() => {
             if (launchData.outletDetails.outletDetails) {
                 setImageUrl(launchData.outletDetails.outletDetails.imageUrl)
               }
               console.log(launchData.outletDetails && launchData.outletDetails.outletDetails) 
             if (launchData.outletDetails.errorCode === 1) {
                dispatch(handleModalTitle(launchData.outletDetails.message))
              } 
           }, [launchData.outletDetails])

       const tableBookingHandler = () => {  
         dispatch(handlePageId(1))   
        }

       const viewPageHandler = () => { 
         if (remarks === 'tbr-self-chkin') {
          //  sessionStorage.setItem('paramData',JSON.stringify({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:OutletCode, outletName:outletName, remarks:remarks, imageUrl:imageUrl}))  
           setSelfCheckIn(true)
           dispatch(handlePageId(3))  
         } else { 
             if (tableBooking.isOpenBL) {
              dispatch(handlePageId(1))
             } else {
              setSelfCheckIn(false)  
              dispatch(handleViewPage(<View BookingId = {remarks.split('|')[1]} BookingType ={remarks.split('|')[0]} tableBookingHandler = {tableBookingHandler} PropertyId={propertyId}/>))
              dispatch(handlePageId(2))
             }
            
           //setViewPage()
          } 
          
          
        }
     
     useEffect(() => {
        if (remarks) {
          viewPageHandler() 
        } else if(launchData.paramData && launchData.paramData.organizationId) {
            dispatch(handlePageId(1))  
        }  
     }, [remarks, imageUrl, launchData.paramData])
 
          useEffect(() => {
                  (!token ? tokenRef.current = true : tokenRef.current = false) 
               
           }, [token])
   
     useEffect(() => {
          if (propertyName)  document.title = propertyName + '- Table Booking'  
     }, [propertyName])
   
       if (pageId === 2) {
        return viewPage
      } else if(pageId === 3) {
        return <CheckIn/>
      } else if(pageId === 1) {
        return <LoadTableBooking setViewPage={setViewPage}/>
      } // else return <Loading />
}

export default Launching