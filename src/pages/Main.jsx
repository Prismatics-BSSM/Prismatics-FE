import Left from '../components/left';
import TableData from '../components/tableData';
import Search from '../components/Search';
import '../style/Main.css'

export default function Main() {
  return (
    <div className='App main-page'>
      <Left></Left>
        <div className='main'>
          <div className='search'>
            <Search></Search>
          </div>


          <div className='ElementTable-div'>
            <div className='p-button'>
              <p>주기율표</p>
            </div>
            <TableData></TableData>
        </div>
      </div>
    </div>
  );
}
 