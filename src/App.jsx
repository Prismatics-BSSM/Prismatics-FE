import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useRef } from 'react';
import Main from './pages/Main';
import Combin from './pages/Combin';
import Element from './pages/element';
import './style/combin.css';

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/Main" element={<Main />} />      
                <Route path="/Combin" element={<Combin />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;