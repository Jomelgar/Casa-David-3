import React, { useState } from 'react';

function PopUpBed({ message, onConfirm, onCancel }) {
  const [bedId, setBedId] = useState('');
  const [bedId2, setBedId2] = useState('');
  const [bedType, setBedType] = useState('');

  const handleConfirm = () => {
    onConfirm(bedId, bedId2, bedType);
  };

  return (
    <div className="popup2-overlay">
      <div className="popup2-content">
        <p>{message}</p>
        <input
          type="text"
          placeholder={bedType === 'CAMAROTE' ? 'ID Cama de abajo' : 'ID de la cama'}
          value={bedId}
          onChange={(e) => setBedId(e.target.value.toUpperCase())}
        />
        {bedType === 'CAMAROTE' && (
          <input
            type="text"
            placeholder="ID Cama de arriba"
            value={bedId2}
            onChange={(e) => setBedId2(e.target.value.toUpperCase())}
          />
        )}
        <select
          value={bedType}
          onChange={(e) => setBedType(e.target.value)}
        >
          <option value="">Tipo de cama</option>
          <option value="INDIVIDUAL">Individual</option>
          <option value="CAMAROTE">Camarote</option>
        </select>
        <button onClick={onCancel}>Cancelar</button>
        <button onClick={handleConfirm}>Confirmar</button>
      </div>
    </div>
  );
}

export default PopUpBed;
