import Left from '../components/left';
import TableData from '../components/tableData';
import Search from '../components/Search';
import '../style/Main.css'
import { useNavigate } from 'react-router-dom';

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className='App'>
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
