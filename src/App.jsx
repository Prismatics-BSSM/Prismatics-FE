import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useRef } from 'react';
import Main from "./pages/Main.jsx";
import Combin from './pages/Combin.jsx';
import Element from "./pages/Element.jsx";
import CombinElement from "./pages/CombinElement.jsx";
import InSpectrum from "./components/InSpectrum.jsx";
import InElement from "./components/InElement.jsx";
import './style/combin.css';

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/Main" element={<Main />} />      
                <Route path="/Combin" element={<Combin />} />
                <Route path="/Element" element={<Element />} />
                <Route path="/CombinElement" element={<CombinElement/>}/>
                <Route path="/InSpectrum" element={<InSpectrum/>}></Route>
                <Route path="/InElement" element={<InElement/>}/>
             </Routes>
        </BrowserRouter>
    );
}

export default App;