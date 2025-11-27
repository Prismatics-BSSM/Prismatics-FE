import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AtomModel2D from './AtomModel2D';
import elementData from './elementData';
import Spectrum from './Spectrum';
import './ElementDetail.css';

export default function ElementDetail({ elements}){
    const location = useLocation();
    if(!elements || elements.length===0) return <div>원소 정보가 없습니다.</div>;

    console.log(elements)
    return(
        <div className='ElementDetail'>
            <p className='DElementName'>H</p>
            <div className='Detail-Element'>
                {/* <p>{elements.symbol}</p> */}
                
                <div className='Element-mo'>
                    <AtomModel2D 
                    atomicNumber={elements.atomicNumber} size={250} 
                    />
                </div>

                <div className='Detail-Element-P'>
                    <p>원자 번호 : 1</p>
                    <p>상태(0) : 기체</p>
                    <p>원자량 : 1.008 amu</p>
                    <p>분류 : 비금속</p>
                </div>
            </div>
            <hr/>
            <div className='Detail-Spectrum'>
                <p>스펙트럼</p>
                <div className='DetailSpectrum'>
                    <Spectrum wavelengths={[]} mode='emission'/>
                    <Spectrum wavelengths={[]} mode='absorption'/>
                </div>
            </div>
        </div>
    );
}