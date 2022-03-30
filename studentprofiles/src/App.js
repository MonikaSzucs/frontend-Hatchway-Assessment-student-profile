import React from 'react';
import { Route , BrowserRouter, Routes, Switch} from "react-router-dom";
import './index.css';

import Home from './Pages/Home';

export default function Main() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Home/> } />
          </Routes>
        </BrowserRouter>
      </div>
    )
}