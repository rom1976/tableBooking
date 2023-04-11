import React, { Fragment } from "react"
import { Badge } from "reactstrap"


const CancelContent = (props) => {
    return (
      <Fragment> 
        <div className="d-flex justify-content-center m-0 mt-5">
        <h4><Badge outline color='black'  >Cancelled</Badge> </h4> 
        </div> 
      <div className="d-flex justify-content-center m-0 mt-0 mb-5 pb-2">
      <small style={{fontSize:'10px'}}>[{props.walkingStatusDetails && props.walkingStatusDetails.walkInDetails.cancelReason}]</small>  
      </div>     
      <div className="d-flex justify-content-center m-0 mt-5"> 
        { // for spacing prupose , not rquired for cancelled to order
            //  walkingStatusDetails && walkingStatusDetails.walkInDetails.showOrderNow &&
            //<p style={{marginBottom:'0px'}}>
           // <small><Link to='' onClick = {() => window.open(walkingStatusDetails.walkInDetails.orderNowLink, '_self')}>{walkingStatusDetails.walkInDetails.orderNowDisplayName}</Link> 
           // </small></p>
            }
       </div> 
      </Fragment>
    )
  }

  export default CancelContent