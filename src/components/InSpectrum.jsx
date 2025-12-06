import { useLocation } from "react-router-dom";
import elementData from "./elementData";
import './InSpectrum.css';
import { useNavigate } from "react-router-dom";
import Spectrum from "./Spectrum";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function InSpectrum({ type, elementId, onClose }) {
  const [waves, setWaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [elementData, setElementData] = useState();

  useEffect(() => {
    setLoading(true);

    const spectrumAPI = axios.get(
        `${API_URL}/elements/spectrums?ids=${elementId}`
    );

    const elementAPI = axios.get(
        `${API_URL}/elements/${elementId}`
    );

    Promise.all([spectrumAPI, elementAPI])
        .then(([wavesReq, elementReq]) => {
            const fetchedWaves = wavesReq.data.waves || [];
            setWaves(fetchedWaves);
            setElementData(elementReq.data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
  }, [elementId]);


  if (loading) return <p>로딩 중...</p>;
  else console.log(elementData);

  return (
    <div className="InSpectrum">
      {type === "in" && <EmissionSpectrum onClose={onClose} waves={waves} name={elementData.name}/>}
      {type === "out" && <AbsorptionSpectrum onClose={onClose} waves={waves} name={elementData.name} />}
    </div>
  );
}

function EmissionSpectrum({ onClose, waves, name}){

  return(
    <div className="Spect-css-all">
      <div className="back-icon" onClick={onClose}>
        <BackIcon/>
      </div>
      <div className="Spectrum-H">
        <h2 className="Spectrum">{name} 스펙트럼</h2>
        <p className="Spectrum-P">전자가 높은 에너지 준위에서 낮은 에너지 준위로 이동할 때,<br/>
        해당 원소의 <span>방출 스펙트럼</span>이 나타납니다.</p>
      </div>
      <div className="Spectrum-div">
        <Spectrum
          wavelengths={waves}
          mode="emission"
        />
        <p>※ 실제 측정 결과와 다를 수 있습니다.</p>
      </div>
      
      <div className="Spectrum-Mean">
        <p className="SpectrumM-T">방출 스펙트럼이란?</p>
        <p className="SpectrumM-P">고온의 기체에서 원자들의 전자가 높은 에너지 상태에서 낮은 에너지 상태로 떨어지면서 특정 파장의 빛을 방출할 때 나타나는 스펙트럼입니다. 이는 검은 바탕에 특정 색깔의 선이나 띠가 나타나는 특징을 가지며, 기체 방전관이나 별과 같은 천체에서 관측됩니다.</p>
      </div>
    </div>
  );
}

function AbsorptionSpectrum({ onClose, waves, name }){

  return(
    <div className="Spect-css-all">
      <div className="back-icon" onClick={onClose}>
        <BackIcon/>
      </div>
      <div className="Spectrum-H">
        <h2 className="Spectrum">{name} 스펙트럼</h2>
        <p className="Spectrum-P">전자가 낮은 에너지 준위에서 높은 에너지 준위로 이동할 때,<br/>
        해당 원소의 <span>흡수 스펙트럼</span>이 나타납니다.</p>
      </div>
      <div className="Spectrum-div">
        <Spectrum
          wavelengths={waves}
          mode="absorption"
        />
        <p>※ 실제 측정 결과와 다를 수 있습니다.</p>
      </div>
      <div className="Spectrum-Mean">
        <p className="SpectrumM-T">흡수 스펙트럼이란?</p>
        <p className="SpectrumM-P">빛이 물질을 통과할 때 특정 파장의 빛이 흡수되어 그 부분이 검은 선이나 띠로 나타나는 현象입니다. 연속 스펙트럼을 가진 빛을 저온의 기체에 통과시키면, 기체 속 원자나 분자가 특정 파장의 에너지를 흡수하면서 발생합니다.</p>
      </div>
    </div>
  );
}

function BackIcon(){
  return(
    <div className="backIcon">
      <svg width="12" height="24" viewBox="0 0 14 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 25L1 13L13 1" stroke="#363853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}