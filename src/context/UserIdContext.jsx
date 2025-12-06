import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserIdContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export function UserIdProvider({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshUserId = async () => {
  try {
    const res = await axios.post(
      `${API_URL}/auth`
    );
    const newUserId = res.data.userId;
    setUserId(newUserId);
    localStorage.setItem("userId", newUserId);
    console.log("✔ userId 갱신 완료:", newUserId);
    return newUserId;
  } catch (err) {
    console.error("userId 갱신 실패:", err);
    throw err;
  }
};


  const fetchRecords = async (currentUserId) => {
    if (!currentUserId) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `${API_URL}/histories?userid=${currentUserId}`
      );

      const histories = res.data || [];
      const result = [];

      for (const h of histories) {
        const detailRes = await axios.get(
          `${API_URL}/histories?userid=${currentUserId}`,
          { ids: h.elementsIds }
        );

        result.push({
          historyId: h.historyId,
          symbols: detailRes.data.map((el) => el.symbol),
        });
      }

      setRecords(result);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("userId 만료, 갱신 시도...");
        const newUserId = await refreshUserId();
        if (newUserId) {
          fetchRecords(newUserId); 
        } else {
          setRecords([]);
        }
      } else {
        console.error("레코드 가져오기 실패:", err);
        setRecords([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchRecords(userId);
  }, [userId]);

  return (
    <UserIdContext.Provider
      value={{
        userId,
        setUserId,
        records,
        loading,
        refreshUserId,
      }}
    >
      {children}
    </UserIdContext.Provider>
  );
}

export const useUserId = () => useContext(UserIdContext);
