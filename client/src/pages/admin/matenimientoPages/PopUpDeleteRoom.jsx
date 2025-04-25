import React, { useState } from "react";
import HabitacionApi from "../../../api/Habitacion.api";

function PopUpDeleteRoom({ message, onConfirm, onCancel, roomData }) {
  const [selectedRoomName, setSelectedRoomName] = useState(null);

  const handleConfirm = () => {
    onConfirm(selectedRoomName);
  };

  return (
    <div className="DeleteRoom-overlay">
      <div className="DeleteRoom-content">
        <p>{message}</p>
        <select
          value={selectedRoomName}
          onChange={(e) => setSelectedRoomName(e.target.value)}
        >
          <option value="">¿Qué habitación deseas eliminar?</option>
          {roomData.map((room) => (
            <option
              key={room.id}
              value={JSON.stringify(room)}
            >{`Room ${room.roomName}`}</option>
          ))}
        </select>
        <button onClick={onCancel}>Cancelar</button>
        <button onClick={handleConfirm}>Confirmar</button>
      </div>
    </div>
  );
}

export default PopUpDeleteRoom;
