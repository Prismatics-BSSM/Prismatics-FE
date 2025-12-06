import Left from '../components/left';
import TableData from '../components/tableData';
import Search from '../components/Search';
import '../style/Main.css'
import { useState } from "react";

export default function Main() {
  const [search, setSearch] = useState("");

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
            />
        </div>
      </div>
    </div>
  );
}
