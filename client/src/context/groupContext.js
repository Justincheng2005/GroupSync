import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const GroupContext = createContext();

export const GroupContextProvider = ({ children }) => {
  const [currentGroup, setCurrentGroup] = useState(
    JSON.parse(localStorage.getItem("group")) || null
  );

  const groupSwitch = async (inputs) => {
    const res = await axios.get("http://localhost:8800/api/groups/" + inputs.id, {
       withCredentials: true,
    });
    //maybe change to res.data later
    setCurrentGroup(res.data[0])
  };

  useEffect(() => {
    localStorage.setItem("group", JSON.stringify(currentGroup));
  }, [currentGroup]);

  return (
    <GroupContext.Provider value={{ currentGroup, groupSwitch }}>
      {children}
    </GroupContext.Provider>
  );
};
