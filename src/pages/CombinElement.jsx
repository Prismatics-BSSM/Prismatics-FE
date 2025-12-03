import '../style/CombinElement.css'
import Left from '../components/left';
import ElementList from '../components/ElementList';
import ElementDetail from '../components/ElementDetail';
import elementData from '../components/elementData';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function CombinElement(){
    const navigate = useNavigate();
    const location = useLocation();
    const { elements = [] } = location.state || {};

    if (elements.length === 0) return <div>undefind</div>
    console.log("CombinElement received elements:", elements);


    return(
        <div className='CombinElement'>
           <Left/> 
           <div className='CElement-main'>
            <div className='List'>
                <ElementList elements={elements}/>
            </div>
            <div className='ElementSpectrum'>
                <div className='BackCombin' onClick={() => navigate('/Combin')}>
                    <p>뒤로가기</p>
                </div>
                <ElementDetail elements={elements}/>
            </div>
           </div>
        </div>
    );
}