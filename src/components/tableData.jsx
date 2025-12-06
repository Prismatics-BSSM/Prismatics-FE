import './tableData.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function TableData({ page, search, onSelect }) {
  const [selectedElement1, setSelectedElement1] = useState(null);
  const [selectedElement2, setSelectedElement2] = useState([]);
  const [elementsData, setElementsData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const promises = [];
        for (let i = 1; i <= 118; i++) {
          promises.push(
            axios.get(`${API_URL}/elements/${i}`)
          );
        }
        const responses = await Promise.all(promises);
        const data = responses.map(res => res.data);
        setElementsData(data);
      } catch (error) {
        console.error("원소 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchElements();
  }, []);

  const isMatch = (cell) => {
    if (!cell || !search || !search.trim()) return false;
    
    const searchLower = search.toLowerCase().trim();
    
    // 영어 검색
    if (cell.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // 한글 검색
    const element = elementsData.find(el => el.symbol === cell);
    if (element && element.name) {
      return element.name.includes(search.trim());
    }
    
    return false;
  };

  // 원소 테이블 배열
  const table = [
    ["H", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "He"],
    ["Li","Be", null,null,null,null,null,null,null,null,"B","C","N","O","F", null,null,"Ne"],
    ["Na","Mg", null,null,null,null,null,null,null,null,"Al","Si","P","S","Cl", null,null,"Ar"],
    ["K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"],
    ["Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe"],
    ["Cs","Ba", null ,"Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn"],
    ["Fr","Ra", null ,"Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og"],
    [null,null,"La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu", null],
    [null,null,"Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr", null]
  ];

  const SPECTRUM_AVAILABLE = [
    1, 2, 3, 4, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    32, 35, 36, 37, 38, 39, 42, 43, 44, 45,
    47, 48, 49, 50, 53, 54, 55, 56, 57, 58,
    60, 62, 63, 64, 66, 67, 68, 69, 70, 71,
    72, 73, 74, 77, 78, 79, 80, 81, 82, 83,
    87, 88, 89
  ];

  // main 페이지 테이블
  if (page === "main") {
    return (
      <table className="element-container">
        <tbody className="element-table">
          {table.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const matched = isMatch(cell);
                const isSelected1 =
                  selectedElement1?.row === rowIndex &&
                  selectedElement1?.col === cellIndex;

                return (
                  <td
                    key={cellIndex}
                    className={`
                      ${cell ? "filled" : "empty"}
                      ${rowIndex === 7 || rowIndex === 8 ? "LanAct-row" : ""}
                      ${isSelected1 ? "selected" : ""}
                      ${(rowIndex === 5 && cellIndex === 2) || (rowIndex === 6 && cellIndex === 2) ? "ot" : ""}
                      ${matched ? "highlight" : ""}
                    `}
                   onClick={() => {
                    if (!cell) return;

                    const elementInfo = elementsData.find(el => el.symbol === cell);
                    if (!elementInfo) return;

                    if (onSelect) onSelect(elementInfo);

                    navigate('/Element', {
                      state: {
                        elementId: elementInfo.elementId,
                        symbol: elementInfo.symbol,
                        name: elementInfo.name
                      }
                    });
                  }}

                  >
                    {cell && <span className="element-text">{cell}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // combin 페이지 테이블
  else if (page === "combin") {
    return (
      <table className="element-container">
        <tbody className="element-table">
          {table.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const matched = isMatch(cell);
                const isSelected2 = selectedElement2.some(
                  el => el.row === rowIndex && el.col === cellIndex
                );

                const elementInfo = cell ? elementsData.find(el => el.symbol === cell) : null;
                const hasSpectrum = elementInfo ? SPECTRUM_AVAILABLE.includes(elementInfo.elementId) : false;

                return (
                  <td
                    key={cellIndex}
                    className={`
                      ${cell ? "filled" : "empty"}
                      ${rowIndex === 7 || rowIndex === 8 ? "LanAct-row" : ""}
                      ${isSelected2 ? "selected" : ""}
                      ${(rowIndex === 5 && cellIndex === 2) || (rowIndex === 6 && cellIndex === 2) ? "ot" : ""}
                      ${matched ? "highlight" : ""}
                      ${cell && !hasSpectrum ? "no-spectrum" : ""}
                    `}
                    onClick={() => {
                      if (!cell) return;
                      
                      if (!hasSpectrum) {
                        alert(`${elementInfo.name} (${cell})은(는) 스펙트럼 정보가 없습니다.`);
                        return;
                      }
                      
                      const position = { row: rowIndex, col: cellIndex };
                      const isAlreadySelected = selectedElement2.some(
                        el => el.row === rowIndex && el.col === cellIndex
                      );
                      
                      const newSelected = isAlreadySelected
                        ? selectedElement2.filter(el => !(el.row === rowIndex && el.col === cellIndex))
                        : [...selectedElement2, position];
                      
                      setSelectedElement2(newSelected);
                      
                      if (typeof onSelect === "function") {
                        const symbols = newSelected.map(pos => table[pos.row][pos.col]);
                        const selectedElementsData = symbols
                          .map(symbol => elementsData.find(el => el.symbol === symbol))
                          .filter(el => el !== undefined);
                        
                        console.log("선택된 원소들:", selectedElementsData); 
                        onSelect(selectedElementsData);
                      }
                    }}
                  >
                    {cell && <span className="element-text">{cell}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}