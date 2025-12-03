import './tableData.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TableData({ page, search, onSelect }) {
  const [selectedElement1, setSelectedElement1] = useState(null);
  const [selectedElement2, setSelectedElement2] = useState([]);
  const [elementsData, setElementsData] = useState([]);

  const navigate = useNavigate();

  // API에서 원소 데이터 가져오기
  useEffect(() => {
    const fetchElements = async () => {
      try {
        const promises = [];
        for (let i = 1; i <= 118; i++) {
          promises.push(
            axios.get(`https://prismatics-api-xwmrfrdamq-du.a.run.app/elements/${i}`)
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
    
    // 영어 기호로 검색 (테이블에서 직접)
    if (cell.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // 한글 이름으로 검색 (백엔드 데이터에서)
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

  // ⭐ main 페이지 테이블
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
                      if (onSelect) onSelect(elementInfo);

                      navigate('/Element', {
                        state: {
                          symbol: cell,
                          name: elementInfo?.name,
                          elementId: elementInfo?.elementId 
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

                return (
                  <td
                    key={cellIndex}
                    className={`
                      ${cell ? "filled" : "empty"}
                      ${rowIndex === 7 || rowIndex === 8 ? "LanAct-row" : ""}
                      ${isSelected2 ? "selected" : ""}
                      ${(rowIndex === 5 && cellIndex === 2) || (rowIndex === 6 && cellIndex === 2) ? "ot" : ""}
                      ${matched ? "highlight" : ""}
                    `}
                    onClick={() => {
                      if (!cell) return;
                      
                      const position = { row: rowIndex, col: cellIndex };
                      const isAlreadySelected = selectedElement2.some(
                        el => el.row === rowIndex && el.col === cellIndex
                      );
                      
                      const newSelected = isAlreadySelected
                        ? selectedElement2.filter(el => !(el.row === rowIndex && el.col === cellIndex))
                        : [...selectedElement2, position];
                      
                      setSelectedElement2(newSelected);
                      
                      if (typeof onSelect === "function") {
                        const selectedElements = newSelected.map(pos => {
                          const symbol = table[pos.row][pos.col];
                          return elementsData.find(el => el.symbol === symbol);
                        });
                        onSelect(selectedElements);
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