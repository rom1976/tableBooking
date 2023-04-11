import React from "react"

import TableBookingComp from "./view/TableBooking/TableBookingComp"

const TableBooking = (props) => {
            
         return (
                <TableBookingComp setViewPage ={props.setViewPage}/>
              )
 }     
 
export default TableBooking