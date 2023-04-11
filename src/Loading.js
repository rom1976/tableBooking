import React from "react"
import { Col, Container, Row, Spinner } from "reactstrap"

const Loading = () => {
    return (
       
                <Row className="d-flex justify-content-center mt-5 ">  
                    <Spinner animation='border' color="primary" />  
                </Row> 
           
    )
}

export default Loading