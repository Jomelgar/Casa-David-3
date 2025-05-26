import React, { useState } from "react";

function PopUpDeleteBed({ message, onConfirm, onCancel, bedData }) {
  const [selectedBedId, setSelectedBedId] = useState(null);

  const handleConfirm = () => {
    onConfirm(selectedBedId);
  };

  return (
    <div className="DeleteBed-overlay">
      <div className="DeleteBed-content">
        <p>{message}</p>
        <select
          value={selectedBedId}
          onChange={(e) => setSelectedBedId(e.target.value)}
        >
          <option value="">Selecciona una cama</option>
          {bedData.map((bed) => (
            <option key={bed.id} value={JSON.stringify(bed)}>{`Cama ${bed.nomre}`}</option>
          ))}
        </select>
        <button onClick={onCancel}>Cancelar</button>
        <button onClick={handleConfirm}>Confirmar</button>
      </div>
    </div>
  );
}

export default PopUpDeleteBed;
