import './EnergyLevel.css';
import { MathJax, MathJaxContext } from "better-react-mathjax";

export default function EnergyLevel() {
    return (
        <div className='EnergyLevel'>
            <p className='Energy-t'>에너지 준위(Energy level)란?</p>
            <p className='Level-p'>
                에너지 준위는 원자와 분자가 갖는 에너지의 값 보어의 원자 모형에서 전자가 에너지를 받아 위치를 바꾼, 이 위치들의 에너지 준위이다.
            </p>
            <div className='Level-tlr'>
                <MathJaxContext>
                        <MathJax>
                        {`$$E_n = -\\frac{1213}{n^2}\\;\\text{kJ/mol}$$`}
                        </MathJax>
                </MathJaxContext>
            </div>
            <img src='/Level.png' alt='EnrgyLevel-img' width='400px' height='210px'></img>
        </div>
    );
}