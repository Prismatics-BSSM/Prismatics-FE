import './ElementList.css';
import elementData from './elementData.js';
import ElementCard from './ElementCard';
import { useState } from 'react';

export default function ElementList({ elements }) {

  const [selectedElements, setSelectedElements] = useState([]);

  // 개별 카드 클릭
  const toggleSelect = (symbol) => {
    setSelectedElements(prev => 
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)  // 해제
        : [...prev, symbol]               // 선택
    );
  };

  // 전체 선택 / 해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedElements(elements.map(el => el.symbol)); // 전체 선택
    } else {
      setSelectedElements([]); // 전체 해제
    }
  };

  if (!elements || elements.length === 0) return <p>선택된 원소가 없습니다.</p>;

  return (
    <div className='ElementList'>
      <div className='checkbox-div'>
        <div className='check-H'>
          <p>선택하세요</p>
        </div>

        <input
          type="checkbox"
          id='check-all'
          checked={selectedElements.length === elements.length}
          onChange={handleSelectAll}
        />
        <label htmlFor="check-all">전체 선택</label>
      </div>

      <div className='CardContainer'>
        {elements.map((el, idx) => {
          const elementInfo = elementData.find(e => e.symbol === el.symbol);
          if (!elementInfo) return null;

          return (
            <div key={idx} className='Card'>
              <ElementCard
                element={elementInfo}
                selected={selectedElements.includes(elementInfo.symbol)}
                onClick={() => toggleSelect(elementInfo.symbol)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
