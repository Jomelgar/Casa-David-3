import React, { useState } from 'react';

function PopUpAlojar({ message, onConfirm, onCancel, setInput1 }) {
  const [input1, setInputValue1] = useState('');

  const handleConfirm = () => {
    onConfirm(input1);
  };

  const persons = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Brown',
    'Charlie Davis',
    'Diana Evans',
    'Eve Foster',
    'Frank Green',
    'Grace Harris',
    'Henry Jackson'
  ];

  return (
    <div className="popup3-overlay">
      <div className="popup3-content">
        <p>{message}</p>
        <select
          value={input1}
          onChange={(e) => {
            setInputValue1(e.target.value);
            setInput1(e.target.value); 
          }}
        >
          <option value="">Selecciona la persona a hospedar</option>
          {persons.map((person, index) => (
            <option key={index} value={person}>{person}</option>
          ))}
        </select>
        <button onClick={handleConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

export default PopUpAlojar;
