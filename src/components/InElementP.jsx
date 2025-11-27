import './InElementP.css';
import { useLocation } from 'react-router-dom';
import elementData from './elementData';

export default function InElementP({page}) {
    const location = useLocation();
    const { symbol, name } = location.state || {};

    const element = elementData.find(
        el => el.symbol === symbol || el.name === name
    );

    return (
        <div className='InElementP'>
            <h2 className='element-t'>{symbol}({element.name})</h2>
            <div className='elemntPAll'>
                <div className='elementNumder'>
                    <span>원자번호</span>
                    <div className='value'>
                        <p>{element.atomicNumber}</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>상태(0°C)</span>
                    <div className='value'>
                        <p>{element.atomicWeight}</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>원자량</span>
                    <div className='value'>
                        <p>1.008 amu</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>전기 음성도</span>
                    <div className='value'>
                        <p>2.20</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>분류</span>
                    <div className='value'>
                        <p>비금속</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>끓는점(°C)</span>
                    <div className='value'>
                        <p>-259.1°C</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>녹는점(°C)</span>
                    <div className='value'>
                        <p>-252.9°C</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>이온화 에너지</span>
                    <div className='value'>
                        <select name='num' className='num-select'>
                            <NumberSelect />
                        </select>
                        <p>1,312.0 kJ/mol</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>반지름(pm)</span>
                    <div className='value'>
                        <p>53pm</p>
                    </div>
                </div>
                <div className='elementNumder'>
                    <span>발견</span>
                    <div className='value'>
                        <p>AD 1766년</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NumberSelect() {
  return Array.from({ length: 30 }, (_, i) => (
    <option key={i+1} value={i+1}>{`${i+1}번째`}</option>
  ));
}