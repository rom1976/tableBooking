import axios from "axios"
import React, { Fragment, useEffect, useRef, useState } from "react"
import { MinusCircle, PlusCircle, RefreshCcw } from "react-feather"
import { useSelector } from "react-redux"

import { Col, Collapse, Row, Spinner, Table } from "reactstrap"
import { useMediaQuery } from 'react-responsive'; 
import { useDispatch } from "react-redux";
import { handlePageId, handleViewPage } from "../../redux/launch";
import View from "../../View";
import ReactPaginate from "react-paginate"
import { handleModalTitle } from "../../redux/modals"
import { handleIsOpenBL } from "../../redux/tableBooking"

const BookingDetailsList = (props) => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const tableBooking = useSelector(state => state.tableBooking) 
    const launch = useSelector(state => state.launch)
    const [token, setToken] = useState(launch.token)
    const modalsData = useSelector(state => state.modals) 
    const [isOpenBL, setIsOpenBL] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalBooking, setTotalBooking] = useState('')
    const [GuestTableBookingList, setGuestTableBookingList] = useState('')
    const dispatch = useDispatch()
    const [ContactNo, setContactNo] = useState(tableBooking.tableData.ContactNo)
    const [OutletCode, setOutletCode] = useState('')
    // const [OrganizationId, setOrganizationId] = useState('')
    const [spinnerToggle, setSpinnerToggle] = useState(false)
    // const [bookingHandlerToggle, setBookingHandlerToggle] = useState(false)
    const handlePagination = page => setCurrentPage(page.selected + 1)
    const guestRef = useRef(false)
          useEffect(() => { 
              const bkng = tableBooking.tableData
                 // setBookingDate(bkng.bookingDate)
                 //  setNoOfGuest(bkng.NoOfGuest)
                 //  setBookingTime(bkng.BookingTime)
                 // setSelectedTitle()
                 // setFirstName(bkng.FirstName)
                 // setLastName(bkng.LastName)
                 // setSelectedTelephoneCode(bkng.selectedTelephoneCode)
                 setContactNo(bkng.ContactNo)
                 // setEmailId(bkng.EmailId)
                 // setInstruction(bkng.Instruction)
                 if (tableBooking.loggedIn === false) {
                    setGuestTableBookingList('') 
                    setIsOpenBL(false)   
                   }     
      }, [tableBooking])

   

            useEffect(() => {
            
                 if(tableBooking.guestList)  {
                  setGuestTableBookingList(tableBooking.guestList) 
                 }
            }, [tableBooking.guestList])

            useEffect(() => {
               if(tableBooking.guestTotalBooking.totalBooking)  {
               setTotalBooking(tableBooking.guestTotalBooking.totalBooking)  
              }
            
              console.log(tableBooking.guestTotalBooking)
            }, [tableBooking.guestTotalBooking.totalBooking])

           useEffect(() => {
               if (launch) { 
                 //setToken(launch.token)
                 setOutletCode(launch.paramData.outletCode)
             //    setOrganizationId(launch.paramData.organizationId)
               }
           }, [launch])

           useEffect(() => {
              if (launch.outletListData) {
                setToken(launch.outletListData.token)
               }
               console.log(launch.outletListData)
             }, [launch.outletListData])

             const tableBookingHandler = () => {
                 dispatch(handleViewPage(''))
                dispatch(handlePageId(1))
               // getGuestListHandler()
                 
              //   guestRef.current = true
               }   
               useEffect(() => {    
                   if (isOpenBL) {
                     guestRef.current = true  
                   }
               }, [currentPage, isOpenBL]) 

           const getGuestListHandler = () => {
                     
                   //GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetGuestTotalBooking?ContactNo=9738854149'
                   axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetGuestTotalBooking`, {
                     params:{
                       ContactNo:ContactNo
                     },
                     headers: { Authorization: `Bearer ${token || props.token}`},
                      "Content-Type": "application/json"
                     }
                  ).then((res) =>{
                    setTotalBooking(res.data.response.totalBooking) 
                  })
                  //GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetGuestTableBookingList?CurrentPageNumber=10&NoOfRowsPerPage=1&ContactNo=9738854149'
                    axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetGuestTableBookingList`, {
                     params:{
                       CurrentPageNumber:currentPage,
                       NoOfRowsPerPage:10,
                       ContactNo:ContactNo
                     },
                     headers: { Authorization: `Bearer ${token || props.token}`},
                      "Content-Type": "application/json"
                     }
                  ).then((res) =>{ 
                   setGuestTableBookingList(res.data.response)
                   window.scrollTo(0, document.body.scrollHeight);
                   guestRef.current = false
                  })
                }

                useEffect(() => {
                  if (tableBooking.isOpenBL) {
                   !isOpenBL && setIsOpenBL(tableBooking.isOpenBL)
                 //  getGuestListHandler()
                  }

             },[tableBooking.isOpenBL])
 
          useEffect(() => { 
               if(isOpenBL && tableBooking.loggedIn && ContactNo && guestRef.current) {
                   guestRef.current = false 
                   console.log(GuestTableBookingList)
                   getGuestListHandler()
                   document.body.style.overflow = "visible"   
                 } 
               
                 console.log(isOpenBL, tableBooking.loggedIn, ContactNo)
            }, [isOpenBL, tableBooking.loggedIn, currentPage, props.outletList, props.token, ContactNo])

            const cancelHandler = (outcode, propertyId, bookingId) => {
                  setSpinnerToggle(bookingId)
                axios.post(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}ValidateCancelTableBooking`, 
                {
                 PropertyId:propertyId,
                 OutletCode:outcode,
                 BookingId:bookingId,
                 ContactNo:props.ContactNo
                  }
               , {
               headers: { Authorization: `Bearer ${token || props.token}`}}
             ).then(res => { 
               if (res.data.errorCode === 0) {
             
              axios.post(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}CancelTableBooking`, 
              {
               PropertyId:propertyId,
               OutletCode:outcode,
               BookingId:bookingId,
               ContactNo: props.ContactNo
                }
             , {
             headers: { Authorization: `Bearer ${token || props.token}`}}
            ) 
               }
             }).then(() => {   
               
               setTimeout(() => {  
                 setSpinnerToggle('') 
                 getGuestListHandler()}, 2000 ) 
               //  setBookingHandlerToggle(false)  
             }) 
              } 

              useEffect(() => {
                    if (modalsData.modalTitle === 'Your Booking Success' && isOpenBL) getGuestListHandler()
                      
                   // return () => setModalTitle('')
              }, [modalsData.modalTitle])
           
    return (
        <Fragment>
        <Row className="mb-1" >
        <Col sm={2} style={{paddingLeft:'25px'}}>
        {isOpenBL ? <MinusCircle size={20} className='pe-1'/> : <PlusCircle size={20} className='pe-1'/>} 
           <p
           style={{color:'black', display:'inline', cursor:'pointer'}}
            onClick = { () => { 
             if (tableBooking.loggedIn === false && (ContactNo && ContactNo.length !== 10)) {
                   dispatch(handleModalTitle('Kindly Enter Valid Mobile No'))
                     // setModalError(!modalError)
                } else if (tableBooking.loggedIn === false) {  
                        dispatch(handleModalTitle('Kindly Login to View Bookings'))
                //  setModalTitle('Kindly Login to View Bookings')
               //setModalError(!modalError)
              } else {
                setIsOpenBL(!isOpenBL)  
              }
            }}
          ><u>Your Bookings</u>
          </p>{totalBooking && tableBooking.loggedIn && <span>({totalBooking})</span>}<div
              style={{textDecoration:'none', color:'black', display:'inline', cursor:'pointer'}}
             onClick = { () => {  
             if ((tableBooking.loggedIn === false) || ContactNo.length !== 10) {
                dispatch(handleModalTitle('Kindly Enter Valid Mobile No'))
                //  props.setModalTitle('Kindly Enter Valid Mobile No')
                 props.setModalError(!props.modalError)
             } else {
                // props.setModalTitle('')
                getGuestListHandler() 
               }
             }}
           >{'  '}{totalBooking && <RefreshCcw size={14} strokeWidth='3px' className='rotate' />}</div>
        </Col>
       </Row>
       <Row 
       className="mb-3"
       style={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'}}>
        <Col>
        <Collapse isOpen={isOpenBL} >
          <div style={{minHeight:'300px'}}>
        <Table responsive striped size="sm" style={isTabletOrMobile ? {fontSize:'11px'} : {paddingLeft:'20px', paddingRight:'20px'}}>
       {  (GuestTableBookingList && isOpenBL) &&  <thead>
        <tr>
          <th style={{width:'130px', textAlign:'center'}}>Location</th>
          <th style={{width:'70px'}}>Date</th>
          <th  style={{width:'60px'}}>Time</th>
          <th style={{textAlign:'center', width:'80px'}}>No of Guest</th>
          <th style={{width:'70px'}}>Status</th>
          <th style={{width:'70px'}}>View</th>
          <th style={{width:'90px'}}>Cancel</th> 
        </tr>
       </thead> 
       }
       <tbody>
        {(!GuestTableBookingList && isOpenBL) &&  <tr><td colSpan={5} className='text-center'><Spinner animation="grow" variant="primary" /></td></tr>} 
        {
         (GuestTableBookingList && isOpenBL) && GuestTableBookingList.bookingList.map((item, id) => {
          
         return(
          <tr key={id}>
            <td className="ps-2">
              {item.location} 
            </td> 
            <td>
              {item.bookingDate}
            </td>
            <td>
              {item.bookingTime}
            </td>
            <td style={{textAlign:'center'}}>
              {item.noOfGuest}
            </td>
            <td>
              {item.status} 
            </td>
            <td>
            <p
             style={{color:'black', display:'inline', cursor:'pointer', textDecorationLine:'underline'}}
                // state={{OrganizationId, PropertyId:item.propertyId, BookingId: item.bookingId, OutletCode: item.outletCode, tokenData:tokenData}}
               onClick={() => {   
                     console.log(item.outletCode) 
                     dispatch(handleViewPage(<View PropertyId= {item.propertyId} BookingId = {item.bookingId} OutletCode ={item.outletCode} tableBookingHandler = {tableBookingHandler}/>))
                     dispatch(handleIsOpenBL(false))
                     dispatch(handlePageId(2)) 
                     // sessionStorage.setItem('paramData',JSON.stringify({organizationId:OrganizationId, propertyId:item.propertyId, propertyName: propertyName, 
                     // outletName: outletName, outletCode:item.outletCode,imageUrl:imageUrl,})) 
                  }
                }
               >View</p>
            </td>
            <td>
                {item.allowCancel &&  <div
                 style={{color:'black', display:'inline', cursor:'pointer', textDecorationLine:'underline'}} onClick={() => {
                 cancelHandler(item.outletCode, item.propertyId,item.bookingId) 
                }
                }>{(spinnerToggle === item.bookingId) ?
                  <div className="spinner-border text-danger spinner-border-sm" role="status"> 
                 </div> : 'Cancel' 
                }</div>}
            </td>
           </tr>
           )
          })
         }
        </tbody>
       </Table>
          </div> 
       <div className={isTabletOrMobile ? "d-flex justify-content-center" :"d-flex justify-content-end pagin"} style={{width:'100%'}}>
        <div sm='2'> 
        <ReactPaginate
          size ='sm'
          breakLabel="..."
          nextLabel=">"
          onPageChange={page => handlePagination(page)}
          forcePage={GuestTableBookingList && GuestTableBookingList.paginationDetail.currentPageNumber - 1}
          pageRangeDisplayed={5}
          pageCount={GuestTableBookingList && Math.ceil(GuestTableBookingList.paginationDetail.totalRecords / GuestTableBookingList.paginationDetail.noOfRowsPerPage)}
          previousLabel="<"
          renderOnZeroPageCount={null}
          activeClassName='active'
          pageClassName='page-item'
          breakClassName='page-item'
          pageLinkClassName='page-link'
          nextLinkClassName='page-link'
          breakLinkClassName='page-link'
          nextClassName='page-item next'
          previousLinkClassName='page-link'
          previousClassName='page-item prev'
          containerClassName='pagination react-paginate pagination-danger pagination-sm'
          style={{maxWidth:'50%'}} 
        /> 
        </div>
       </div> 
          </Collapse>
        </Col>
      </Row>
      </Fragment>
    )
}

export default BookingDetailsList