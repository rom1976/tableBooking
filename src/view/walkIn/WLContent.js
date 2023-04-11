import React, { Fragment, useEffect, useRef, useState } from "react"
import { RefreshCcw } from "react-feather"
import { Link } from "react-router-dom" 
import 'animate.css'
import '../../core/styles/style.css'
import classnames from "classnames"
import useWalkin from "../../Hooks/useWalkin"
const WLContent = (props) => {
  //const refreshRef = useRef(false)  
 // const refreshRotate = refreshRef.current
  const [refresh, setRefresh] = useState(false)
  const walkin = useWalkin(props.walkingStatusDetails)
  const [walkingStatusDetails, setWalkingStatusDetails] = useState(props.walkingStatusDetails)
   
 useEffect(() => {
  if (props.walkingStatusDetails)  setWalkingStatusDetails(props.walkingStatusDetails)
   console.log(props.walkingStatusDetails)
  }, [props.walkingStatusDetails])
    return (
      <Fragment>  
      <div className="d-flex justify-content-center mt-5"  style={{marginBottom:'0px', color:'black'}}>   
      <h2 style={{fontWeight:'900'}}>
         {walkingStatusDetails && walkingStatusDetails.walkInDetails.currentWaitlistNo}
         </h2> 
      </div>
      <div className="d-flex justify-content-center m-0 ">
        <span style={{marginBottom:'0px', color:'black'}}>
        <small> Your Current Wait List Number </small> 
        <Link to = "" 
         onClick = {()=> { 
                walkin.walkingBookingStatusHandler()
                setRefresh(true) 
                setTimeout(() => setRefresh(false), 3000)
               } 
             } 
                 
          
        style={{textDecoration:'none', color:'black', paddingLeft:'7px'}}> 
        {
          //animate__rotateIn
        }
           {walkingStatusDetails && walkingStatusDetails.walkInDetails.showRefresh && <RefreshCcw
            className={classnames({'rotate':true, 'rotate-inf':refresh})}
           size={15} strokeWidth='3px'/>}
         </Link> 
       </span> 
      </div>  
      <div className="d-flex justify-content-center m-0 mt-5"> 
        
       </div> 
    
      </Fragment>
    )
  }
 
  export default WLContent