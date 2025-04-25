import React, { useState } from "react";
import { Alert, Space } from 'antd';


function PopUpRoom({ message, onConfirm, onCancel, setInput1, setInput2 }) {
  const [input1, setInputValue1] = useState("");
  const [input2, setInputValue2] = useState("");
  const handleConfirm = () => {
    onConfirm(input1, input2);
  };

  return (
    <div className="popup-overlay">
   
      <div className="popup-content">
        <p>{message}</p>
        <input
          type="text"
          placeholder="Nombre del dormitorio"
          value={input1}
          onChange={(e) => {
            setInputValue1(e.target.value.toUpperCase());
            setInput1(e.target.value); // Actualizar el estado del nombre del dormitorio
          }}
        />

        <select
          value={input2}
          onChange={(e) => {
            setInputValue2(e.target.value);
            setInput2(e.target.value); // Actualizar el estado del género del dormitorio
          }}
        >
          <option value="">Selecciona el género</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMENINO">Femenino</option>
        </select>
        <button onClick={onCancel}>Cancelar</button>
        <button onClick={handleConfirm}>Confirmar</button>
      </div>
    </div>
  );
}

export default PopUpRoom;
