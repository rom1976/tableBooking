import React from "react"
import { Link } from "react-router-dom"
import { CardFooter, Row } from "reactstrap"

import FooterAdd from "../../view/TableBooking/FooterAdd"
const Footer = (props) => {
    return (
        <CardFooter style={{backgroundColor:'white', border:'none'}}>
               <FooterAdd outletData = {props.outletData} modalTitle ={props.modalTitle}/>
             <Row className="d-flex justify-content-center border-top fixed-bottom" 
               style={{background:'#EAEAEA'}}>
                 <div style={{width:'160px'}}>
                    <small><em style={{fontSize:'11px', color:'#8D8D8D'}}>Powered by {' '}</em><Link to= "" 
                    onClick={() => window.open('https://lucidpos.com/', '_blank')}
                    style={{fontWeight:'normal', fontSize:'11px', color:'#8D8D8D'}}><strong>LUCID POS</strong></Link></small> 
                  </div>
              </Row>
           </CardFooter>
    )
  }
 
  export default Footer