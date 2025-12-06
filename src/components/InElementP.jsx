import './InElementP.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function InElementP({ elementId, page }) {
    const [elementData, setElementData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(1);

    useEffect(() => {
        if (!elementId) return;

        axios
            .get(`${API_URL}/elements/${elementId}`)
            .then(res => {
                setElementData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [elementId]);


    if (loading) return <p>로딩 중...</p>;
    if (!elementData) return <p>해당 원소 데이터를 찾을 수 없습니다.</p>;

    const processedElements = Object.fromEntries(
        Object.entries(elementData).map(([key, value]) => [
            key,
            value === null ? "N/A" : value
        ])
    );

    const hasIonData =
        Array.isArray(elementData.ionizationEnergies) &&
        elementData.ionizationEnergies.length > 0;

    const ionValue = hasIonData
        ? elementData.ionizationEnergies[selectedIndex - 1]
        : "N/A";

    return (
        <div className='InElementP'>
            <h2 className='element-t'>{elementData.symbol} ({elementData.name})</h2>

            <div className='elemntPAll'>

                <div className='elementNumder'>
                    <span className='NumderT'>원자번호</span>
                    <div className='value'><p>{processedElements.elementId}</p></div>
                </div>

                <div className='elementNumder'>
                    <span className='NumderT'>상태(0°C)</span>
                    <div className='value'><p>{processedElements.state}</p></div>
                </div>

                <div className='elementNumder'>
                    <span className='NumderT'>원자량</span>
                    <div className='value'>
                        <p>{processedElements.atomicWeight} <span className='Unit'>amu</span></p>
                    </div>
                </div>

                <div className='elementNumder'>
                    <span className='NumderT'>전기 음성도</span>
                    <div className='value'><p>{processedElements.electronegativity}</p></div>
                </div>

                <div className='elementNumder'>
                    <span className='NumderT'>분류</span>
                    <div className='value'><p>{processedElements.series}</p></div>
                </div>

                <div className='elementNumder'>
                    <span className='NumderT'>끓는점(°C)</span>
                    <div className='value'>
                        <p>{processedElements.boilingPoint} <span className='Unit'>°C</span></p>
                    </div>
                </div>

                <div className='elementNumder'>
                    <span className='NumderT'>녹는점(°C)</span>
                    <div className='value'>
                        <p>{processedElements.meltingPoint} <span className='Unit'>°C</span></p>
                    </div>
                </div>

                <div className='elementNumder'>
                    <span className='NumderT'>이온화 에너지</span>
                    <div className='value'>
                        {hasIonData ? (
                            <>
                                <select
                                    className='num-select'
                                    value={selectedIndex}
                                    onChange={(e) => setSelectedIndex(Number(e.target.value))}
                                >
                                    <NumberSelect max={elementData.ionizationEnergies.length} />
                                </select>

                                <p>{ionValue} <span className='Unit'>kJ/mol</span></p>
                            </>
                        ) : (
                            <p>N/A</p>
                        )}
                    </div>
                </div>

                <div className='elementNumder'>
                    <span className='NumderT'>반지름(pm)</span>
                    <div className='value'>
                        <p>{processedElements.radius} <span className='Unit'>pm</span></p>
                    </div>
                </div>

                <div className='elementNumder'>
                    <span className='NumderT'>발견</span>
                    <div className='value'><p>{processedElements.discover}</p></div>
                </div>

            </div>
        </div>
    );
}

function NumberSelect({ max }) {
    return (
        <>
            {Array.from({ length: max }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                    {`${i + 1}번째`}
                </option>
            ))}
        </>
    );
}
