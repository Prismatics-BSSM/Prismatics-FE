import { useLayoutEffect } from 'react';
import './ElementCard.css';
import elementData from './elementData.js';
import { useLocation } from 'react-router-dom';

export default function ElementCard({element}){
    if (!element) return null;

    return(
        <div className='ElementCard'>
            <div className='ElementCardName'>
                <p>{element.symbol}</p>
            </div>
        </div>
    );
}