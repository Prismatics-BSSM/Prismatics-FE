import './InElementP.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InElementP({page}) {
    const location = useLocation();
    // const { symbol } = location.state || {};

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

    const ionValue =
        elementData.ionizationEnergies[selectedIndex - 1] !== undefined
            ? elementData.ionizationEnergies[selectedIndex - 1]
            : "데이터 없음";

    return (
        <div className='InElementP'>
            <h2 className='element-t'>{elementData.symbol} ({elementData.name})</h2>
            <div className='elemntPAll'>
                <div className='elementNumder'>
                    <span>원자번호</span>
                    <div className='value'>
                        <p>{elementData.elementId}</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>상태(0°C)</span>
                    <div className='value'>
                        <p>{elementData.state}</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>원자량</span>
                    <div className='value'>
                        <p>{elementData.atomicWeight} amu</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>전기 음성도</span>
                    <div className='value'>
                        <p>{elementData.electronegativity}</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>분류</span>
                    <div className='value'>
                        <p>{}</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>끓는점(°C)</span>
                    <div className='value'>
                        <p>{elementData.boilingPoint}°C</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>녹는점(°C)</span>
                    <div className='value'>
                        <p>{elementData.meltingPoint}°C</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>이온화 에너지</span>
                    <div className='value'>
                        <select
                            name='num'
                            className='num-select'
                            value={selectedIndex}
                            onChange={(e) => setSelectedIndex(Number(e.target.value))}
                        >
                            <NumberSelect max={elementData.ionizationEnergies.length} />
                        </select>

                        <p>{ionValue} kJ/mol</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>반지름(pm)</span>
                    <div className='value'>
                        <p>{elementData.radius} pm</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>발견</span>
                    <div className='value'>
                        <p>{elementData.discover}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NumberSelect({ max }) {
  return (
    <>
      {Array.from({ length: max }, (_, i) => (
        <option key={i+1} value={i+1}>
          {`${i+1}번째`}
        </option>
      ))}
    </>
  );
}