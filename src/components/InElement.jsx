import { useLocation } from 'react-router-dom';
import AtomModel2D from './AtomModel2D';
import elementData from './elementData';
import EnergyLevel from '../components/EnergyLevel';
import { useState, useEffect } from "react";
import axios from 'axios';
import './InElement.css';

export default function ElementI({ onElectronMove = () => {} }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const location = useLocation();
    
    const [elementData, setElementData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(1);

    useEffect(() => {
        axios.get("https://prismatics-api-xwmrfrdamq-du.a.run.app/elements/13")
            .then(res => {
                setElementData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>로딩 중...</p>;
    if (!elementData) return <p>해당 원소 데이터를 찾을 수 없습니다.</p>;
              
    return (
        <div className='elementI'>
            <div className='elementP'>
            <p className='elementM'>{elementData.name} 원자모형</p>
            <p className='elementM-p'>전자를 움직여 에너지 준위 변화를 확인해보세요.</p>
            </div>
            <div className='element-'>
            <AtomModel2D 
                atomicNumber={elementData.elementId} 
                onElectronMove={onElectronMove}
            />
            </div>
            <div className='Ques-icon'
            onClick={() => setModalOpen(true)}>
                <Question />
            </div>
            {isModalOpen && (
                <div className='modal-overlay' onClick={() => setModalOpen(false)}>
                    <div className='modal-content' onClick={e => e.stopPropagation()}>
                        <EnergyLevel />
                    </div>
                </div>
            )}
                        
        </div>
    );
}

function Question() {
    return(
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.1715 32.6913C9.77393 31.6597 6.34026 28.2261 5.30872 23.8285C4.56376 20.6526 4.56376 17.3474 5.30872 14.1715C6.34025 9.77393 9.77393 6.34025 14.1715 5.30872C17.3474 4.56376 20.6526 4.56376 23.8285 5.30872C28.2261 6.34025 31.6597 9.77393 32.6913 14.1715C33.4362 17.3474 33.4362 20.6526 32.6913 23.8285C31.6597 28.2261 28.2261 31.6597 23.8285 32.6913C20.6526 33.4362 17.3474 33.4362 14.1715 32.6913Z" stroke="#363853" strokeWidth="1.5"/>
        <circle cx="18.9998" cy="24.5417" r="1.58333" fill="#363853"/>
        <path d="M15.8335 15.8333V15.0417C15.8335 13.2928 17.2513 11.875 19.0002 11.875C20.7491 11.875 22.1668 13.2928 22.1668 15.0417V15.2338C22.1668 16.1246 21.813 16.9789 21.1831 17.6088L19.0002 19.7917" stroke="#363853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}