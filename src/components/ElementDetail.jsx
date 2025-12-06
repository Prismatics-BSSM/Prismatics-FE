import { useEffect, useState } from 'react';
import AtomModel2D from './AtomModel2D';
import Spectrum from './Spectrum';
import axios from 'axios';
import './ElementDetail.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function ElementDetail({ elements }) {
  const [elementDetails, setElementDetails] = useState([]);
  const [combinedWaves, setCombinedWaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 ElementDetail useEffect 실행됨, elements:', elements);

    if (!elements || elements.length === 0) {
      console.log('❌ elements 비어있음');
      setElementDetails([]);
      setCombinedWaves([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchData = async () => {
      try {
        console.log('📡 API 호출 시작, elements:', elements);
        
        const requests = elements.map(id =>
          Promise.all([
            axios.get(`${API_URL}/elements/${id}`),
            axios.get(`${API_URL}/elements/spectrums?ids=${id}`)
          ])
        );

        const results = await Promise.all(requests);

        const details = results.map(([elRes, waveRes]) => ({
          ...elRes.data,
          waves: waveRes.data.waves || []
        }));

        console.log('✅ 데이터 로드 완료:', details);
        
        setElementDetails(details);
        setCombinedWaves(details.flatMap(el => el.waves));
        setLoading(false);
      } catch (err) {
        console.error("fetch error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [elements.join(',')]);

  if (loading) return <p className='DetailLoadAError'>로딩 중...</p>;
  if (!elementDetails || elementDetails.length === 0)
    return <p className='DetailLoadAError'>선택된 원소가 없습니다.</p>;

  if (elementDetails.length === 1) {
    const el = elementDetails[0];
    return (
      <div className='ElementDetail'>
        {/* ✅ 상단 영역 wrapper 추가 */}
        <div className='detail-top-section'>
          <div className='DetailCard single-element'>
            <p className='DElementName'>{el.name}</p>
            <div className='Detail-Element'>
              <div className='Element-mo'>
                <AtomModel2D atomicNumber={el.elementId} size={200} disableMovement={true} />
              </div>
              <div className='Detail-Element-P'>
                <div className='DetailElementNumder'><span>원자번호</span><div className='DetailValue'><p>{el.elementId}</p></div></div>
                <div className='DetailElementNumder'><span>상태(0°C)</span><div className='DetailValue'><p>{el.state || "N/A"}</p></div></div>
                <div className='DetailElementNumder'><span>원자량</span><div className='DetailValue'><p>{el.atomicWeight || "N/A"} amu</p></div></div>
                <div className='DetailElementNumder'><span>분류</span><div className='DetailValue'><p>{el.series || "N/A"}</p></div></div>
              </div>
            </div>
          </div>
        </div>
        
        <hr />
        
        <div className='Detail-Spectrum'>
          <p>스펙트럼</p>
          <div className='DetailSpectrums'>
            <Spectrum wavelengths={el.waves} mode='emission' />
            <Spectrum wavelengths={el.waves} mode='absorption' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='ElementDetail'>
      {/* ✅ 상단 영역 wrapper 추가 */}
      <div className='detail-top-section'>
        <div className='ElementList-Multiple'>
          {elementDetails.map(el => (
            <div key={el.elementId} className='DetailCard list-item'>
              <div className='List-Element-Header'>
                <p className='DElementName'>{el.symbol} ({el.name})</p>
              </div>
              <div className='List-Element-Info'>
                <div className='Info-Row'><span className='Info-Label'>원자번호:</span><span className='Info-Value'>{el.elementId}</span></div>
                <div className='Info-Row'><span className='Info-Label'>상태(0°C):</span><span className='Info-Value'>{el.state || "N/A"}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr />
      
      <div className='Detail-Spectrum'>
        <p>스펙트럼</p>
        <div className='DetailSpectrums'>
          <Spectrum wavelengths={combinedWaves} mode='emission' />
          <Spectrum wavelengths={combinedWaves} mode='absorption' />
        </div>
      </div>
    </div>
  );
}