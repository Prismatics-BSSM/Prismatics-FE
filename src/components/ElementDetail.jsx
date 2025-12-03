import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AtomModel2D from './AtomModel2D';
import elementData from './elementData';
import Spectrum from './Spectrum';
import './ElementDetail.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ElementDetail({ elements}){
    const location = useLocation();

    const [elementData, setElementData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [waves, setWaves] = useState(null);
    
    useEffect(() => {
    setLoading(true);

    const spectrumAPI =  axios.get("https://prismatics-api-xwmrfrdamq-du.a.run.app/elements/spectrums?ids=118")

    const elementAPI =  axios.get("https://prismatics-api-xwmrfrdamq-du.a.run.app/elements/118")

    Promise.all([spectrumAPI, elementAPI])
    .then(([wavesReq, elementReq]) => {
          setWaves(wavesReq.data.waves);
          setElementData(elementReq.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
  }, [])
    if (loading) return <p className='DetailLoadAError'>로딩 중...</p>;
    else console.log(elementData);
    if (!elementData) return <p className='DetailLoadAError'>해당 원소 데이터를 찾을 수 없습니다.</p>;

    console.log(elementData)
    return(
        <div className='ElementDetail'>
            <p className='DElementName'>{elementData.name}</p>
            <div className='Detail-Element'>
                {/* <p>{elements.symbol}</p> */}
                
                <div className='Element-mo'>
                    <AtomModel2D 
                    atomicNumber={elementData.elementId} size={300} disableMovement={true} />
                </div>

                <div className='Detail-Element-P'>
                    <div className='DetailElementNumder'>
                        <span>원자번호</span>
                        <div className='DetailValue'>
                            <p>{elementData.elementId}</p>
                        </div>
                    </div>
                    <div className='DetailElementNumder'>
                        <span>상태(0)</span>
                        <div className='DetailValue'>
                            <p>{elementData.state}</p>
                        </div>
                    </div>
                    <div className='DetailElementNumder'>
                        <span>원자량</span>
                        <div className='DetailValue'>
                            <p>{elementData.atomicWeight} amu</p>
                        </div>
                    </div>
                    <div className='DetailElementNumder'>
                        <span>분류</span>
                        <div className='DetailValue'>
                            <p>{}</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div className='Detail-Spectrum'>
                <p>스펙트럼</p>
                <div className='DetailSpectrums'>
                    <Spectrum wavelengths={[]} mode='emission'/>
                    <Spectrum wavelengths={[]} mode='absorption'/>
                </div>
            </div>
        </div>
    );
}