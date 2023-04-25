import React, { Suspense, lazy } from "react"
import Loading from "./Loading";

const LoadTableBooking = () => {
    
     const TableBooking = lazy(() => import('./TableBooking'));

     return (
     <Suspense> 
     <TableBooking />
    </Suspense>
    )

}

export default LoadTableBooking