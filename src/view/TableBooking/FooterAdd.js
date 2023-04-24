import React, { Fragment } from "react"
 
import BookingDetails from "./BookingDetails"

const FooterAdd = (props) => {
  
    return (
        <Fragment>
              <BookingDetails isOpenBL = {props.isOpenBL}/>   
        </Fragment>
      
    )
}

export default FooterAdd