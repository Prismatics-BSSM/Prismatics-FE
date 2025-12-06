import './ElementList.css';
import ElementCard from './ElementCard';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export default function ElementList({ elements, onSelectionChange }) {
  const validElements = useMemo(() => {
    return elements?.filter(el => el && el.symbol) || [];
  }, [elements]);

  const [selectedElements, setSelectedElements] = useState([]);
  
  const prevElementsRef = useRef([]);
  const onSelectionChangeRef = useRef(onSelectionChange);

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    const prev = prevElementsRef.current;
    const next = validElements.map(el => el.elementId);

    const isSame =
      prev.length === next.length &&
      prev.every((v, i) => v === next[i]);

    if (!isSame && next.length > 0) {
      const allSymbols = validElements.map(el => el.symbol);
      const allIds = validElements.map(el => el.elementId);

      setSelectedElements(allSymbols);
      onSelectionChangeRef.current?.(allIds);

      prevElementsRef.current = next;
    }
  }, [validElements]);

  const toggleSelect = useCallback((symbol) => {
    setSelectedElements(prev => {
      const newSelected = prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol];

      const selectedIds = newSelected
        .map(sym => validElements.find(el => el.symbol === sym)?.elementId)
        .filter(Boolean);

      onSelectionChangeRef.current?.(selectedIds);

      return newSelected;
    });
  }, [validElements]);

  const handleSelectAll = useCallback((e) => {
    if (e.target.checked) {
      const allSymbols = validElements.map(el => el.symbol);
      const allIds = validElements.map(el => el.elementId);
      
      setSelectedElements(allSymbols);
      onSelectionChangeRef.current?.(allIds);
    } else {
      setSelectedElements([]);
      onSelectionChangeRef.current?.([]);
    }
  }, [validElements]);

  if (validElements.length === 0) return <p>선택된 원소가 없습니다.</p>;

  return (
    <div className='ElementList'>
      <div className='checkbox-div'>
        <div className='check-H'>
          <p>선택하세요</p>
        </div>

        <input
          type="checkbox"
          id='check-all'
          checked={
            selectedElements.length === validElements.length &&
            validElements.length > 0
          }
          onChange={handleSelectAll}
        />
        <label htmlFor="check-all">전체 선택</label>
      </div>

      <div className='CardContainer'>
        {validElements.map((el, idx) => (
          <div key={idx} className='Card'>
            <ElementCard
              element={el}
              selected={selectedElements.includes(el.symbol)}
              onClick={() => toggleSelect(el.symbol)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}