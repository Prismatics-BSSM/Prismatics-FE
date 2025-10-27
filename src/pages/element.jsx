import '../style/Main.css'
import ElementI from '../components/elementT ';
import { useNavigate } from 'react-router-dom';

export default function element() {
    
    return (
        <div className='App'>
            <div className='element-p'>

            </div>
            <div className='element-div'>
                <ElementI></ElementI>
                <Question></Question>
            </div>
        </div>
    );
}
 
function Question() {
    return(
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.1715 32.6913C9.77393 31.6597 6.34026 28.2261 5.30872 23.8285C4.56376 20.6526 4.56376 17.3474 5.30872 14.1715C6.34025 9.77393 9.77393 6.34025 14.1715 5.30872C17.3474 4.56376 20.6526 4.56376 23.8285 5.30872C28.2261 6.34025 31.6597 9.77393 32.6913 14.1715C33.4362 17.3474 33.4362 20.6526 32.6913 23.8285C31.6597 28.2261 28.2261 31.6597 23.8285 32.6913C20.6526 33.4362 17.3474 33.4362 14.1715 32.6913Z" stroke="#363853" stroke-width="1.5"/>
        <circle cx="18.9998" cy="24.5417" r="1.58333" fill="#363853"/>
        <path d="M15.8335 15.8333V15.0417C15.8335 13.2928 17.2513 11.875 19.0002 11.875C20.7491 11.875 22.1668 13.2928 22.1668 15.0417V15.2338C22.1668 16.1246 21.813 16.9789 21.1831 17.6088L19.0002 19.7917" stroke="#363853" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}