import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useRef } from 'react';
import Main from './pages/Main';
import Combin from './pages/Combin';
import './style/combin.css';

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/Main" element={<Main />} />      {/* 홈 페이지 */}
                <Route path="/Combin" element={<Combin />} /> {/* 소개 페이지 */}
            </Routes>
        </BrowserRouter>
    );
}

export default App; 