import React, { useEffect, useState } from "react";
import { useLayout } from "../../../context/LayoutContext";

import { Pagination } from "antd";
import { Link } from "react-router-dom";
import {
  PlusCircleOutlined,
  PlusSquareOutlined,
  InfoCircleOutlined,
  ManOutlined,
  WomanOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import occupiedBedIcon from "../../../assets/occupiedBed.png";
import freeBedIcon from "../../../assets/freeBed.png";

import PopUpRoom from "./PopUpRoom";
import PopUpBed from "./PopUpBed";
import PopUpDeleteBed from "./PopUpDeleteBed";
import PopUpDeleteRoom from "./PopUpDeleteRoom";
import PopUpGender from "./PopUpGender";
import GenderWarning from "./GenderWarning";
import DeleteBedWarning from "./DeleteBedWarning";
import HabitacionApi from "../../../api/Habitacion.api";
import CamaApi from "../../../api/Cama.api";
import PersonApi from "../../../api/Persona.api";
import UserApi from "../../../api/User.api";
import ReservacionesApi from "../../../api/Reservaciones.api";
import { getUserFromToken } from "../../../utilities/auth.utils";

const { PORT_CLIENT, URL_HOSTING } = require("../../../config");

/**
 * Represents a single bed component.
 * @param {Object} bed - The bed object containing information about the bed.
 * @param {string} bed.nomre - The name of the bed.
 * @param {boolean} bed.disponible - Whether the bed is available or occupied.
 */
function Bed({ bed }) {
  // Destructure properties from the bed object
  const { nomre, disponible } = bed;

  // Determine which bed icon to display based on availability
  const bedImage = disponible ? (
    <img className="bed_img" src={freeBedIcon} alt="Free Bed" />
  ) : (
    <img className="bed_img" src={occupiedBedIcon} alt="Occupied Bed" />
  );

  return (
    <div className="room_beds">
      {/* Display the bed name */}
      <h2 className="bed_id">{nomre}</h2>
      {/* Display the bed image (free or occupied) */}
      {bedImage}
    </div>
  );
}

/**
 * Card component representing a room with its beds and related operations.
 * @param {Object} props - Props containing room information and initial bed data.
 * @param {number} props.habitacionId - The ID of the room.
 * @param {string} props.roomName - The name of the room.
 * @param {string} props.gender - The gender associated with the room.
 * @param {Array} props.initialBedData - Initial data for beds in the room.
 */
function Card({ habitacionId, roomName, gender, initialBedData }) {
  // State variables
  const [bedData, setBedData] = useState(initialBedData);
  const [showBedPopUp, setShowBedPopUp] = useState(false);
  const [showDeleteBedPopUp, setShowDeleteBedPopUp] = useState(false);
  const [showGenderPopUp, setShowGenderPopUp] = useState(false);
  const [showGenderWarning, setShowGenderWarning] = useState(false);
  const [varGender, setGender] = useState(gender);
  const [showDeleteBedWarning, setShowDeleteBedWarning] = useState(false);
  const [showEmptyBedWarning, setShowEmptyBedWarning] = useState(false);
  const [showEmptyGenderWarning, setShowEmptyGenderWarning] = useState(false);
  const [showEmptyDeleteBedWarning, setShowEmptyDeleteBedWarning] =
    useState(false);
  const { userLog } = useLayout();

  // Fetch bed data for the room from the API
  const fetchBedData = async () => {
    try {
      const camasRes = await CamaApi.getCamaRequestbyRoom(habitacionId);
      const bedData = camasRes ? camasRes.data : [];
      setBedData(Array.isArray(bedData.data) ? bedData.data : []);
    } catch (error) {
      console.error("Error fetching bed data:", error);
      setBedData([]);
    }
  };

  useEffect(() => {
    fetchBedData();
  }, []); // Runs once on component mount to fetch initial bed data

  // Handlers for various button clicks

  // Handler for adding a new bed
  const handleAddButtonClick = () => {
    setShowBedPopUp(true);
  };

  // Handler for changing the room's gender
  const handleGenderButtonClick = () => {
    setShowGenderPopUp(true);
  };

  // Handler for deleting a bed
  const handleDeleteButtonClick = () => {
    setShowDeleteBedPopUp(true);
  };

  // Handler for confirming a new bed addition
  const handleConfirmBed = async (bedId, bedId2, bedType) => {
    const newBedData1 = {
      nomre: bedId,
      tipo: bedType,
      disponible: true,
      id_habitacion: habitacionId,
    };

    const newBedData2 = {
      nomre: bedId2,
      tipo: bedType,
      disponible: true,
      id_habitacion: habitacionId,
    };

    if (bedType === "CAMAROTE") {
      if (
        newBedData1.nomre === "" ||
        newBedData2.nomre === "" ||
        newBedData1.tipo === "" ||
        newBedData2.tipo === ""
      ) {
        setShowEmptyBedWarning(true);
      } else {
        try {
          await CamaApi.postCamaRequest(newBedData1);
          await CamaApi.postCamaRequest(newBedData2);
          fetchBedData();
          setShowBedPopUp(false);
        } catch (error) {
          console.error("Error adding bunk bed:", error);
        }
      }
    } else {
      if (newBedData1.nomre === "" || newBedData1.tipo === "") {
        setShowEmptyBedWarning(true);
      } else {
        try {
          await CamaApi.postCamaRequest(newBedData1);
          fetchBedData();
          setShowBedPopUp(false);
        } catch (error) {
          console.error("Error adding bed:", error);
        }
      }
    }
  };
  // Handler for confirming a gender change
  const handleConfirmGender = async (newGender) => {
    console.log("Genero pasado a confirmar: ", newGender);
    if (newGender === "") {
      setShowEmptyGenderWarning(true);
    } else if (bedData.some((bed) => !bed.disponible)) {
      setShowGenderWarning(true);
    } else {
      try {
        setGender(newGender);
        const userId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userId"))
          .split("=")[1];
        const userProp = await UserApi.getUserRequest(userId);
        console.log("User prop: ", userProp);
        const resUser = await PersonApi.getPersonaRequest(
          userProp.data.id_persona
        );
        const data = {
          id_habitacion: habitacionId,
          id_lugar: resUser.data.id_lugar,
          nombre: roomName,
          genero: newGender,
        };
        await HabitacionApi.putHabitacionRequest(habitacionId, data);
        setShowGenderPopUp(false); // Close the popup after confirming
      } catch (error) {
        console.error("Error updating gender:", error);
      }
    }
  };

  // Handler for confirming deletion of a bed
  const handleConfirmDeleteBed = async (selectedBedId) => {
    if (selectedBedId === null) {
      setShowEmptyDeleteBedWarning(true);
    } else if (JSON.parse(selectedBedId).disponible !== true) {
      setShowDeleteBedWarning(true);
    } else {
      try {
        //set reservaciones as null
        // await ReservacionesApi.putBedReservacionRequest(JSON.parse(selectedBedId).id_cama);
        await CamaApi.deleteCamaRequest(JSON.parse(selectedBedId).id_cama);
        fetchBedData(); // Refresh bed data after deleting bed
        setShowDeleteBedPopUp(false); // Close the popup after confirming
      } catch (error) {
        console.error("Error deleting bed:", error);
      }
    }
  };

  // Cancel handlers for popups
  const handleCancelBed = () => {
    setShowBedPopUp(false);
  };

  const handleCancelDeleteBed = () => {
    setShowDeleteBedPopUp(false);
  };

  const handleCancelGender = () => {
    setShowGenderPopUp(false);
  };

  // Handler for confirming the delete bed warning
  const handleDeleteBedWarningConfirm = async () => {
    setShowDeleteBedWarning(false);
  };

  // Handler for confirming the gender change warning
  const handleGenderWarningConfirm = async () => {
    setShowGenderWarning(false);
  };

  // Handler for confirming the empty bed warning
  const handleEmptyBedConfirm = async () => {
    setShowEmptyBedWarning(false);
  };

  // Handler for confirming the empty bed warning
  const handleEmptyGenderConfirm = async () => {
    setShowEmptyGenderWarning(false);
  };

  // Handler for confirming the delete empty bed warning
  const handleEmptyDeleteBedWarningConfirm = async () => {
    setShowEmptyDeleteBedWarning(false);
  };

  // Pagination and bed display logic

  const [currentPage, setCurrentPage] = useState(1);
  const [cardBedNum] = useState(6);
  const indexOfLastBed = currentPage * cardBedNum;
  const indexOfFirstBed = indexOfLastBed - cardBedNum;
  const currentBeds = bedData.slice(
    indexOfFirstBed,
    indexOfFirstBed + cardBedNum
  );

  // Calculate amount of unoccupied beds
  const countUnoccupiedBeds = bedData.filter((bed) => bed.disponible).length;

  // Determine gender icon based on room's gender
  let genderIcon;
  if (varGender === "MASCULINO") {
    genderIcon = <ManOutlined className="gender_icon" />;
  } else {
    genderIcon = <WomanOutlined className="gender_iconW" />;
  }
  console.log(habitacionId);

  // JSX for rendering the Card component
  const url =
    process.env.NODE_ENV === "production"
      ? URL_HOSTING +
        `mantenimiento/habitaciones/dormitorio/?id_habitacion=${habitacionId}`
      : `http://localhost:${PORT_CLIENT}/mantenimiento/habitaciones/dormitorio/?id_habitacion=${habitacionId}`;

  return (
    <div className="room_container">
      <div className="room_sub_container">
        {/* Room header with room name, gender button, info button, delete button, and add button */}
        <div className="room_header">
          <h2 className="room_id">{roomName}</h2>
          <button className="genderButton" onClick={handleGenderButtonClick}>
            {genderIcon}
          </button>
          <Link to={`${url}`}>
            <button className="infoButton">
              <InfoCircleOutlined className="information_icon" />
            </button>
          </Link>
          <button className="deleteButton" onClick={handleDeleteButtonClick}>
            <DeleteOutlined className="trashCanIcon" />
          </button>
          <button className="add_button" onClick={handleAddButtonClick}>
            <PlusSquareOutlined className="add_icon" />
          </button>
        </div>
        {/* Display number of beds and number of available beds */}
        <div className="room_header2">
          <h2 className="roomBedsLabel">No. de Camas:</h2>
          <h2 className="roomBedNum">{bedData.length}</h2>
        </div>
        <div className="room_header3">
          <h2 className="roomAvailableLabel">Disponibles:</h2>
          <h2 className="roomAvailableBedsNum">{countUnoccupiedBeds}</h2>
        </div>
        {/* Display current beds with Bed components */}
        <div className="room_card">
          {currentBeds.map((bed) => (
            <Bed key={bed.id} bed={bed} setBedData={setBedData} />
          ))}
        </div>
      </div>
      {/* Pagination component to navigate through beds */}
      <div className="room_pagination">
        <Pagination
          size="small"
          current={currentPage}
          total={bedData.length}
          pageSize={cardBedNum}
          onChange={setCurrentPage}
        />
      </div>
      {/* Popups for adding bed, deleting bed, and changing gender */}
      {showBedPopUp && (
        <PopUpBed
          message="Agregar cama"
          onConfirm={handleConfirmBed}
          onCancel={handleCancelBed}
        />
      )}
      {showDeleteBedPopUp && (
        <PopUpDeleteBed
          message="Eliminar cama"
          onConfirm={handleConfirmDeleteBed}
          onCancel={handleCancelDeleteBed}
          bedData={bedData}
        />
      )}
      {showGenderPopUp && (
        <PopUpGender
          message="Cambiar Genero"
          onConfirm={handleConfirmGender}
          onCancel={handleCancelGender}
        />
      )}
      {showGenderWarning && (
        <GenderWarning
          message="No se puede cambiar el genero si hay camas ocupadas!"
          onConfirm={handleGenderWarningConfirm}
        />
      )}
      {showDeleteBedWarning && (
        <DeleteBedWarning
          message="No se puede borrar una cama ocupada!"
          onConfirm={handleDeleteBedWarningConfirm}
        />
      )}
      {showEmptyBedWarning && (
        <DeleteBedWarning
          message="Porfavor llene todos los datos!"
          onConfirm={handleEmptyBedConfirm}
        />
      )}
      {showEmptyGenderWarning && (
        <DeleteBedWarning
          message="Porfavor escoga el genero!"
          onConfirm={handleEmptyGenderConfirm}
        />
      )}
      {showEmptyDeleteBedWarning && (
        <DeleteBedWarning
          message="Porfavor escoga una cama!"
          onConfirm={handleEmptyDeleteBedWarningConfirm}
        />
      )}
    </div>
  );
}

// Container for the card component, handles logic for adding and deleting rooms.
function Habitaciones() {
  // State variables
  const [roomData, setRoomData] = useState([]);
  const [showRoomPopUp, setShowRoomPopUp] = useState(false);
  const [showDeleteRoomPopUp, setShowDeleteRoomPopUp] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomGender, setNewRoomGender] = useState("");
  const [showEmptyRoomWarning, setEmptyRoomWarning] = useState(false);
  const [showEmptyDeleteRoom, setEmptyDeleteRoom] = useState(false);
  const [showOccupiedRoomWarning, setOccupiedRoomWarning] = useState(false);
  // Context
  const { setCurrentPath, userLog } = useLayout();

  // Function to fetch room data from API
  const fetchRoomData = async () => {
    try {
      const res = await HabitacionApi.getAllHabitacionesRequest();
      //get user data
      const userToken = getUserFromToken();
      const userProp = await UserApi.getUserRequest(userToken.userId);
      const resUser = await PersonApi.getPersonaRequest(
        userProp.data.id_persona
      );
      //filter by user id lugar
      const filteredRes = res.data.filter(
        (item) => item.id_lugar == resUser.data.id_lugar
      );
      if (filteredRes) {
        const data = await Promise.all(
          filteredRes.map(async (item) => {
            const camasRes = await CamaApi.getCamaRequestbyRoom(
              item.id_habitacion
            );
            const initialBedData = camasRes ? camasRes.data : [];
            return {
              habitacion_id: item.id_habitacion,
              roomName: item.nombre,
              gender: item.genero,
              initialBedData,
            };
          })
        );
        setRoomData(data);
      } else {
        console.error("Error fetching room data:", res);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  // Effect to fetch room data on component mount
  useEffect(() => {
    fetchRoomData();
    setCurrentPath("/ Mantenimiento / Habitaciones");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run effect only on mount

  // Handlers for room pop-up actions
  const handleAddRoom = () => {
    setShowRoomPopUp(true);
  };

  const handleDeleteRoom = () => {
    fetchRoomData();
    setShowDeleteRoomPopUp(true);
  };

  const handleConfirmAddRoom = async (tmpRoomName, tmpGenderName) => {
    if (tmpRoomName === "" || tmpGenderName === "") {
      setEmptyRoomWarning(true);
    } else {
      try {
        const data = {
          id_lugar: userLog.id_lugar,
          nombre: newRoomName,
          genero: newRoomGender,
        };
        const res = await HabitacionApi.postHabitacionRequest(data);

        if (res) {
          fetchRoomData(); // Refresh room data after adding new room
          setShowRoomPopUp(false);
        }
      } catch (error) {
        console.error("Error adding room:", error);
      }
    }
  };

  const handleConfirmDeleteRoom = async (selectedRoomName) => {
    if (selectedRoomName === null) {
      setEmptyDeleteRoom(true);
    } else {
      if (JSON.parse(selectedRoomName).initialBedData.data.length > 0) {
        setOccupiedRoomWarning(true);
      } else {
        try {
          const res = await HabitacionApi.deleteHabitacionRequest(
            JSON.parse(selectedRoomName).habitacion_id
          );
          if (res) {
            fetchRoomData(); // Refresh room data after deleting room
            setShowDeleteRoomPopUp(false);
          }
        } catch (error) {
          console.error("Error deleting room:", error);
        }
      }
    }
  };

  const handleCancelAddRoom = () => {
    setShowRoomPopUp(false);
  };

  const handleCancelDeleteRoom = () => {
    setShowDeleteRoomPopUp(false);
  };

  const handleConfirmEmptyRoomWarning = () => {
    setEmptyRoomWarning(false);
  };

  const handleConfirmEmptyDeleteRoom = () => {
    setEmptyDeleteRoom(false);
  };

  const handleConfirmOccupiedRoomWarning = () => {
    setOccupiedRoomWarning(false);
  };

  return (
    <div className="habitaciones_container">
      {/* Render each room as a Card component */}
      {roomData.map((room) => (
        <Card
          key={room.habitacion_id}
          habitacionId={room.habitacion_id}
          roomName={room.roomName}
          gender={room.gender}
          initialBedData={room.initialBedData.data}
        />
      ))}

      {/* Buttons to add and delete rooms */}
      <div className="add_room_container">
        <div className="room_header">
          <button className="add_room_button" onClick={handleAddRoom}>
            <PlusCircleOutlined className="add_room_icon" />
          </button>

          <button className="delete_room_button" onClick={handleDeleteRoom}>
            <CloseCircleOutlined className="delete_room_icon" />
          </button>
        </div>
      </div>

      {/* Pop-up dialogs for adding and deleting rooms */}
      {showRoomPopUp && (
        <PopUpRoom
          message="Agregar habitación"
          onConfirm={handleConfirmAddRoom}
          onCancel={handleCancelAddRoom}
          setInput1={setNewRoomName}
          setInput2={setNewRoomGender}
        />
      )}
      {showDeleteRoomPopUp && (
        <PopUpDeleteRoom
          message="Eliminar habitación"
          onConfirm={handleConfirmDeleteRoom}
          onCancel={handleCancelDeleteRoom}
          roomData={roomData}
        />
      )}
      {showEmptyRoomWarning && (
        <DeleteBedWarning
          message="Porfavor llene los datos!"
          onConfirm={handleConfirmEmptyRoomWarning}
        />
      )}
      {showEmptyDeleteRoom && (
        <DeleteBedWarning
          message="Porfavor escoga una cama!"
          onConfirm={handleConfirmEmptyDeleteRoom}
        />
      )}
      {showOccupiedRoomWarning && (
        <DeleteBedWarning
          message="No se puede borrar una habitacion con camas!"
          onConfirm={handleConfirmOccupiedRoomWarning}
        />
      )}
    </div>
  );
}

export default Habitaciones;
