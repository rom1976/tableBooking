 
import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import TableBooking from './TableBooking';
import Home from './Home';
import View from './View';
import Launching from './Launching';
function App() {
    
  return (
    <div>
    <Routes> 
      <Route path='/home'  element={<Home />} />
      <Route path= '/' element = {<Launching/>} > 
       <Route path="/table-booking" element={<TableBooking />}/> 
      <Route path='/view' element={<View />} />
     </Route> 
    </Routes>
    </div>
  );
}

export default App;
