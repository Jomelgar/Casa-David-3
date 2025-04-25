import React, { useState, createContext, useContext } from "react";
import { getUserFromToken } from "../utilities/auth.utils";

export const usuarioContext = createContext();

export const useUserContext = () => {
  const context = useContext(usuarioContext);

  if (!context) {
    throw new Error("useUserContext no esta dentro del UserContextProvider");
  }

  return context;
};

const obtenerInformacion = (user) => {};

export const UserContextProvider = ({ children }) => {
  const usuario = getUserFromToken();
  const userLog = usuario;

  console.log(userLog);

  const [user, setUser] = useState([
    "22211318",
    1,
    "Fabio",
    "Chepito",
    "Ramoz",
    "Su Casa, a la par de su Vecino",
    1,
    1,
    "2005/04/07",
    99999999,
    1,
    "Elote200",
  ]);

  const [changeUser, setChangeUser] = useState([
    "22211318",
    1,
    "Fabio",
    "Chepito",
    "Ramoz",
    "Su Casa, a la par de su Vecino",
    1,
    1,
    "2005/04/07",
    99999999,
    1,
    "Elote200",
  ]);

  const [isEditable, setIsEditable] = useState(false);

  return (
    <usuarioContext.Provider
      value={{
        user,
        setUser,
        changeUser,
        setChangeUser,
        isEditable,
        setIsEditable,
      }}
    >
      {children}
    </usuarioContext.Provider>
  );
};
