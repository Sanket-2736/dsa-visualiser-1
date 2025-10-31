import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [dataStructure, setDataStructure] = useState("");
  const [explainLevel, setExplainLevel] = useState("beginner"); // beginner | intermediate | expert
  const [achievements, setAchievements] = useState(() => {
    try { return JSON.parse(localStorage.getItem('achievements')||'{}') } catch { return {} }
  })

  function unlockAchievement(key) {
    setAchievements(prev => {
      if (prev[key]) return prev
      const next = { ...prev, [key]: Date.now() }
      localStorage.setItem('achievements', JSON.stringify(next))
      return next
    })
  }

  const value = {
    dataStructure,
    setDataStructure,
    explainLevel,
    setExplainLevel,
    achievements,
    unlockAchievement
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
