import React, { useState } from 'react';

function PopUpGender({message, onConfirm, onCancel}){
    const [gender, setGender] = useState('');
    const handleConfirm = () => {
      onConfirm(gender);
    }
    return(
        <div className="gender-overlay">
        <div className="gender-content">
          <p>{message}</p>
          <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Genero</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMENINO">Femenino</option>
        </select>
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={handleConfirm}>Confirmar</button>
        </div>
      </div>
    );
}

export default PopUpGender;