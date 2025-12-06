import { createContext, useContext, useState } from 'react';

const ElementContext = createContext();

export function ElementProvider({ children }) {
  const [selectedElementIds, setSelectedElementIds] = useState([]);

  return (
    <ElementContext.Provider value={{ selectedElementIds, setSelectedElementIds }}>
      {children}
    </ElementContext.Provider>
  );
}

export function useElementStore() {
  return useContext(ElementContext);
}
