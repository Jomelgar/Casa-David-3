import React from 'react';

function GenderWarning({ message, onConfirm }) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={handleConfirm}>Confirmar</button>
      </div>
    </div>
  );
}

export default GenderWarning;
