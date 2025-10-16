import './App.css';
import TableData from './components/tableData';
import Search from './components/Search';
import Button from './components/button';

function App() {
  return (
    <div className="App">
      <div className="left">
        <div className='log-pri'>
        <img src='/icon.png' alt='log'></img>
        <p className='title'>Prismatics</p>
        </div>
        <Button/>

        
      </div>

      <div className='main'>
        <div className='search'>
          <Search></Search>
        </div>
          

        <div className='ElementTable-div'>
          <p>주기율표</p>
          <TableData></TableData>
        </div>
      </div>
      
    </div>
  );
}

export default App;

