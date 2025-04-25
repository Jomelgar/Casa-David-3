import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const Modalito2 = ({ idReservacion, isVisible, handleClose }) => {
  const [depositado, setDepositado] = useState(null);
  const [cancelado, setCancelado] = useState(null);
  const [donado, setDonado] = useState(null);

  return (
    <Modal
      title="Informacion"
      visible={isVisible}
      onOk={handleClose}
      onCancel={handleClose}
      footer={null}
      closeIcon={<CloseOutlined style={{ fontSize: "24px" }} />}
    >
      <div
        style={{
          marginBottom: "20px",
          textAlign: "center",
          padding: "10px",
          backgroundColor: "#e0f7ea",
          borderRadius: "5px",
        }}
      >
        Se han depositado{" "}
        <span style={{ fontWeight: "bold" }}>Lps. {depositado}</span>
      </div>
      <div
        style={{
          marginBottom: "20px",
          textAlign: "center",
          padding: "10px",
          backgroundColor: "#fdecea",
          borderRadius: "5px",
        }}
      >
        Ha cancelado{" "}
        <span style={{ fontWeight: "bold" }}>{cancelado} días</span>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          backgroundColor: "#e6f7ff",
          borderRadius: "5px",
        }}
      >
        Ha donado <span style={{ fontWeight: "bold" }}>Lps. {donado}</span>
      </div>
    </Modal>
  );
};

export default Modalito2;
