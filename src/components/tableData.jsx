import './tableData.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import elementData from './elementData';

export default function TableData({ page, search, onSelect }) {
  const [selectedElement1, setSelectedElement1] = useState(null);
  const [selectedElement2, setSelectedElement2] = useState([]);

  const navigate = useNavigate();

  const handleElementClick = (symbol) => {
  const elementInfo = elementData.find(el => el.symbol === symbol);
  };


  const handleClick2 = (rowIndex, cellIndex) => {
    const position = { row: rowIndex, col: cellIndex };

    if (selectedElement2.some(el => el.row === rowIndex && el.col === cellIndex)) {
      setSelectedElement2(
        selectedElement2.filter(el => !(el.row === rowIndex && el.col === cellIndex))
      );
    } else {
      setSelectedElement2([...selectedElement2, position]);
    }
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

  // 검색 하이라이트 헬퍼
  const isMatch = (cell) => {
    if (!cell) return false;
    if (!search) return false;
    return cell.toLowerCase().includes(search.toLowerCase());
  };

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
                        const elementInfo = elementData.find(el => el.symbol === cell);
                        if (onSelect) onSelect(elementInfo);

                      navigate('/Element', {
                        state: {
                          symbol: cell,
                          name: elementData.find(el => el.symbol === cell)?.name,
                          atomicNumber: elementInfo?.atomicNumber 
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
                        return elementData.find(el => el.symbol === symbol);
                      });
                      onSelect(selectedElements);
                    }

                  }
                  }
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
