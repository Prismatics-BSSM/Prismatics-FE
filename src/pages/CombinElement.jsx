import '../style/CombinElement.css';
import Left from '../components/left';
import ElementList from '../components/ElementList';
import ElementDetail from '../components/ElementDetail';
import { useLocation, useNavigate } from 'react-router-dom';
import { useElementStore } from '../context/ElementStore';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function CombinElement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { elements: rawElements = [], record } = location.state || {};

  const { selectedElementIds, setSelectedElementIds } = useElementStore();
  const [elementObjects, setElementObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialElementIds = useRef(null);

  useEffect(() => {
    const elementIds = record ? record.elementIds : rawElements.map(el => el.elementId || el);
    
    if (initialElementIds.current === null && elementIds && elementIds.length > 0) {
      initialElementIds.current = [...elementIds];
      console.log('초기 elementIds 저장:', initialElementIds.current);
    }
    
    if (!elementIds || elementIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchElements = async () => {
      try {
        if (typeof elementIds[0] === 'number') {
          const promises = elementIds.map(id => 
            axios.get(`${API_URL}/elements/${id}`)
          );
          const responses = await Promise.all(promises);
          setElementObjects(responses.map(r => r.data));
        } else {
          setElementObjects(elementIds);
        }
        
        if (record && record.elementIds) {
          setSelectedElementIds(record.elementIds);
        }
      } catch (err) {
        console.error('Element fetch 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchElements();
  }, [record, rawElements, setSelectedElementIds]);

  if (loading) return <div>로딩 중...</div>;
  if (elementObjects.length === 0) return <div>조합할 요소가 없습니다.</div>;

  return (
    <div className='CombinElement'>
      <Left />
      <div className='CElement-main'>
        <div className='List'>
          <ElementList
            elements={elementObjects}
            onSelectionChange={setSelectedElementIds}
          />
        </div>

        <div className='ElementSpectrum'>
          <div
            className='BackCombin'
            onClick={async () => {
              const userId = localStorage.getItem("userId");
              
              if (userId && initialElementIds.current && initialElementIds.current.length > 0) {
                try {
                  console.log('저장할 elementIds (초기값):', initialElementIds.current);
                  const res = await axios.post(
                    `${API_URL}/histories?userid=${userId}`,
                    { elementIds: [...initialElementIds.current] }
                  );
                  console.log("조합 저장 성공:", res.data);
                  setSelectedElementIds([]);
                } catch (err) {
                  console.error("조합 저장 실패:", err);
                }
              }
              navigate('/Combin');
            }}
          >
            <p>뒤로가기</p>
          </div>

          <ElementDetail elements={selectedElementIds} />
        </div>
      </div>
    </div>
  );
}