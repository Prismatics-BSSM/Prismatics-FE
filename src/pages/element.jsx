import '../style/Element.css'
import { useLocation } from 'react-router-dom';
import InElement from '../components/InElement';
import InSpectrum from '../components/InSpectrum';
import InElementP from '../components/InElementP'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Element({page}) {
    const location = useLocation();
    const { symbol, name, elementId } = location.state;

    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const [mode, setMode] = useState("element"); 
    const [spectrumType, setSpectrumType] = useState(null);

    function handleElectronMove(type) {
        setSpectrumType(type);
        setMode("spectrum");
    }

    return (
        <div className='Element'>
            <div className='element-all'>
                <div className='elementBox'>
                    <div className='elementp'>
                        <InElementP  elementId={elementId} />
                    </div>
                    <div className='in_'>
                        {mode === "element" && (
                            <InElement 
                             elementId={elementId} 
                             onElectronMove={handleElectronMove} />
                        )}
                        
                        {mode === "spectrum" && spectrumType && (
                            <InSpectrum 
                                type={spectrumType} 
                                elementId={elementId}
                                onClose={() => {
                                    setMode("element");
                                    setSpectrumType(null);
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className='del-div'
                    onClick={() => {
                        navigate('/Main');
                    }}>
                    <Del/>  
                </div>
            </div>
        </div>
    );
}

function Del() {
    return(
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.93198 20.2959L20.2959 9.93198M9.93198 9.93198L20.2959 20.2959" stroke="#333446" strokeWidth="2" strokeLinecap="round"/>
        <path d="M1.30872 10.1715C2.34026 5.77393 5.77393 2.34025 10.1715 1.30872C13.3474 0.563759 16.6526 0.56376 19.8285 1.30872C24.2261 2.34026 27.6597 5.77393 28.6913 10.1715C29.4362 13.3474 29.4362 16.6526 28.6913 19.8285C27.6597 24.2261 24.2261 27.6597 19.8285 28.6913C16.6526 29.4362 13.3474 29.4362 10.1715 28.6913C5.77393 27.6597 2.34026 24.2261 1.30872 19.8285C0.563759 16.6526 0.563759 13.3474 1.30872 10.1715Z" stroke="#363853" strokeWidth="1.5"/>
        </svg>
    )
}