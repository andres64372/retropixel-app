import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
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
      <Switch>
        <Route path="/index">
          <Index/>
        </Route>
        <Route path="/register">
          <Register/>
        </Route>
        <Route path="/login">
          <Login/>
        </Route>
        <Route path="/">
          <Init/>
        </Route>
      </Switch>
    </Router>    
  );
}

export default App;
