import React from "react";
import { useState } from "react";
import { Card } from "reactstrap";
import Footer from "./Footer";
import Header from "./Header";

const Layout = (props) => { 
       const [modalTitle, setModalTitle] = useState()
 
    return (
         <Card> 
                <Header setModalTitle={setModalTitle}/>
                    {props.children}
                <Footer outletData = {props.outletData} modalTitle={modalTitle} isOpenBL={props.isOpenBL}/>
               
         </Card>
 
       )
}

 export default Layout