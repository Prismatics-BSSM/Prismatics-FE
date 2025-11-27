import './ElementList.css';
import elementData from './elementData.js';
import ElementCard from './ElementCard';

export default function ElementList({ elements }) {
    
  if (!elements || elements.length === 0) return <p>선택된 원소가 없습니다.</p>;

  return (
    <div className='ElementList'>
      <div className='checkbox-div'>
        <div className='check-H'>
            <p>선택하세요</p>
        </div>
        <input type="checkbox" id='check-all' />
        <label htmlFor="check-all">전체 선택</label>
      </div>

      <div className='CardContainer'>
        {elements.map((el, idx) => {
          const elementInfo = elementData.find(e => e.symbol === el.symbol);

          if (!elementInfo) {
            console.log("Element not found:", el);
            return null;
          }
        return (
            <div key={idx} className='Card'
              // onClick={() => {

              // }}
            >
                <ElementCard element={elementInfo} />
            </div>
            );
        })}
    </div>

    </div>
  );
}
