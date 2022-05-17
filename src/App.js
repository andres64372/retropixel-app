import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Index from './components/index.jsx';
import Login from './components/login.jsx';
import Init from './components/init.jsx';
import Register from './components/register.jsx';

function App() {
  return(
    <Router>
      <Toaster position="top-left"/>
      <Routes>
        <Route path="/index" element={<Index/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Init/>}/> 
      </Routes>
    </Router>    
  );
}

export default App;
