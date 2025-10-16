import React from "react";
import './tableData.css';

export default function TableData(){
    const table = [
        ["H", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "He"],
        // 2주기
        ["Li","Be", null,null,null,null,null,null,null,null,"B","C","N","O","F", null,null,"Ne"],
        // 3주기
        ["Na","Mg", null,null,null,null,null,null,null,null,"Al","Si","P","S","Cl", null,null,"Ar"],
        // 4주기
        ["K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"],
        // 5주기
        ["Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe"],
        // 6주기
        ["Cs","Ba","*","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn"],
        // 7주기
        ["Fr","Ra","**","Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og"],
        // 란타넘족
        [null,null,"La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu", null],
        // 악티늄족
        [null,null,"Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr", null]
    ]
    return(
    <table className="element-container">
      <tbody className="element-table">
        {table.map((row, rowIndex) => (
          <tr key={rowIndex} >
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className={`${cell ? "filled" : "empty"} 
              ${rowIndex===7 || rowIndex===8 ? "LanAct-row" : ""}`}>
                {cell ? <span className="element-text">{cell}</span> : ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    )
    
}

