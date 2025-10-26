import Left from '../components/left';
import TableData from '../components/tableData';
import Search from '../components/Search';
import '../style/combin.css'

export default function Main() {
  return (
    <div className='App combin-page'>
      <Left></Left>
        <div className='main'>
          <div className='search'>
            <Search></Search>
          </div>


          <div className='ElementTable-div'>
            <div className='p-button'>
              <p>주기율표</p>
              <button className='combin-b'>조합하기</button>
            </div>
            <TableData></TableData>
        </div>
      </div>
    </div>
  );
}
 