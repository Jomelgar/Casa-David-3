import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const VisitorModal = ({ isVisible, handleClose, id_persona }) => {
  const [visitorData, setVisitorData] = useState({});
  const [patientData, setPatientData] = useState({});

  useEffect(() => {
    if (id_persona) {
      // Fetch visitor data from API
      axiosInstance.get(`http://localhost:3001/visitor-data/${id_persona}`)
        .then(response => {
          const data = response.data;
          const procedencia = `${data.departamento}, ${data.municipio}`;
          const nombre = `${data.primer_nombre} ${data.primer_apellido}`;
          setVisitorData({ ...data, procedencia, nombre });
        })
        .catch(error => console.error('Error fetching visitor data:', error));

      // Fetch patient data from API
      axiosInstance.get(`http://localhost:3001/paciente-data/${id_persona}`)
        .then(response => {
          const data = response.data;
          const procedencia = `${data.Procedencium.departamento}, ${data.Procedencium.municipio}`;
          const nombre = `${data.primer_nombre} ${data.primer_apellido}`;
          setPatientData({ ...data, procedencia, nombre });
        })
        .catch(error => console.error('Error fetching patient data:', error));
    }
  }, [id_persona]);

  return (
    <Modal
      visible={isVisible}
      onCancel={handleClose}
      footer={null}
      width={600}
      closeIcon={<CloseOutlined />}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Datos del Visitante</h2>
        <div className="mb-6">
          <p><strong>Nombre:</strong> {visitorData.nombre}</p>
          <p><strong>Fecha de Nacimiento:</strong> {visitorData.fecha_nacimiento}</p>
          <p><strong>No. de Identidad:</strong> {visitorData.dni}</p>
          <p><strong>Dirección:</strong> {visitorData.direccion}</p>
          <p><strong>Género:</strong> {visitorData.genero}</p>
          <p><strong>Procedencia:</strong> {visitorData.procedencia}</p>
          <p><strong>Ocupación:</strong> {visitorData.ocupacion}</p>
          <p><strong>Teléfono:</strong> {visitorData.telefono}</p>
          <p><strong>Parentesco:</strong> {visitorData.parentesco_paciente}</p>
          <p><strong>Fecha de Entrada:</strong> {visitorData.fecha_entrada}</p>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center">Datos del Paciente</h2>
        <div className="mb-6">
          <p><strong>Nombre:</strong> {patientData.nombre}</p>
          <p><strong>Fecha de Nacimiento:</strong> {patientData.fecha_nacimiento}</p>
          <p><strong>No. de Identidad:</strong> {patientData.dni}</p>
          <p><strong>Dirección:</strong> {patientData.direccion}</p>
          <p><strong>Género:</strong> {patientData.genero}</p>
          <p><strong>Procedencia:</strong> {patientData.procedencia}</p>
          <p><strong>Ocupación:</strong> {patientData.ocupacion}</p>
          <p><strong>Teléfono:</strong> {patientData.telefono}</p>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center">Causa de la Visita</h2>
        <div className="mb-6">
          <p>{patientData.causa_visita}</p>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center">Observaciones</h2>
        <div>
          <p>{patientData.observacion}</p>
        </div>
      </div>
    </Modal>
  );
};

export default VisitorModal;
