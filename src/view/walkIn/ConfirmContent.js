import React, { Fragment } from "react"

const ConfirmContent = (props) => {

    return (
      <Fragment> 
      <div className="d-flex justify-content-center m-0 mt-5"> 
      <h2 style={{fontWeight:'900'}}>  {
        (props.walkingStatusDetails && props.walkingStatusDetails.walkInDetails.tableNos)
        }
        </h2> 
      </div>
      <div className="d-flex justify-content-center m-0">
       <small>Table Number</small>
      </div>   
      
      <div className="d-flex justify-content-center m-0 mt-5"> 
        {
            props.walkingStatusDetails && props.walkingStatusDetails.walkInDetails.showOrderNow &&
          <p style={{marginBottom:'0px', cursor:'pointer'}}  onClick = {() => window.open(props.walkingStatusDetails.walkInDetails.orderNowLink, '_self')}>
            <small>{props.walkingStatusDetails.walkInDetails.orderNowDisplayName}
            </small></p>}
       </div> 
      </Fragment>
    )
  }

  export default ConfirmContent