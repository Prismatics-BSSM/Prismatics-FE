import Left from '../components/left';
import TableData from '../components/tableData';
import Search from '../components/Search';
import '../style/Main.css'
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import calculateElectronConfig from "../utils/calculateElectronConfig";

export default function Main() {
  const navigate = useNavigate(); 
  const [search, setSearch] = useState("");

  const [selectedElement, setSelectedElement] = useState(null);

  const shells = selectedElement
  ? calculateElectronConfig(selectedElement.elementId)
  : [];


  return (
    <div className='Main'>
      <Left></Left>
      <div className='main'>
          <div className='search'>
            <Search search={search} onChange={(e) => setSearch(e.target.value)}></Search>
          </div>
          <div className='ElementTable-div'>
            <div className='p-div'>
              <p>주기율표</p>
            </div>
            <TableData
            page="main"
            search={search}
            onSelect={(elementInfo) => setSelectedElement(elementInfo)}
            />
        </div>
      </div>
    </div>
  );
}
