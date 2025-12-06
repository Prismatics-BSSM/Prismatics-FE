import Left from '../components/left';
import TableData from '../components/tableData';
import Search from '../components/Search';
import '../style/combin.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function Combin() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [selectedElements, setSelectedElements] = useState([]); 

  return (
    <div className='Combin'>
      <Left></Left>
      <div className='main'>
        <div className='search'>
          <Search search={search} onChange={(e) => setSearch(e.target.value)}></Search>
        </div>

        <div className='ElementTable-div-c'>
          <div className='p-button'>
            <p>주기율표</p>

            <button
              className='combin-b'
              onClick={() => {
                if (selectedElements.length === 0) {
                  alert("원소를 선택하세요!");
                  return;
                }

                  navigate('/CombinElement', {
                    state: {
                    elements: selectedElements
                    }
                  });
              }}
            >
              조합하기
            </button>
          </div>

          <TableData
            page="combin"
            onSelect={(list) => setSelectedElements(list)}
            search={search}   
          />
        </div>
      </div>
    </div>
  );
}
