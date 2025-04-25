import React, { useEffect, useState } from "react";
import { Modal, Space, Input, Button, ConfigProvider } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { DatePicker, Table } from "antd";
import dayjs from "dayjs";

const PagarModal = ({ isVisible, handleClose, handleOk }) => {
  const [amount, setAmount] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [observacion, setObservacion] = useState("");
  const [isSingleDateDonation, setIsSingleDateDonation] = useState(true);
  const [singleDate, setSingleDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [donationBulk, setDonationBulk] = useState([]);
  const [donationDatesRange, setDonationDatesRange] = useState([]);

  const { RangePicker } = DatePicker;

  function handleRadioDatesChange() {
    const radioChecked = document.getElementById("single-radio").checked;
    setIsSingleDateDonation(radioChecked);
  }

  useEffect(() => {
    if (isSingleDateDonation) {

      setDonationBulk([{
        recibo: receiptNumber,
        fecha: singleDate,
        monto: amount,
        observacion: observacion,
      }]);

      console.warn("Ahora solo es una donacion!")
      console.log(donationDatesRange);

      return;
    }

    let startDate = donationDatesRange.length > 0 ? dayjs(donationDatesRange[0], "DD-MM-YYYY") : null;
    let endDate = donationDatesRange.length >= 1 ? dayjs(donationDatesRange[1], "DD-MM-YYYY") : null;

    if (!startDate || !endDate) return;

    const days = endDate.diff(startDate, "day") + 1;
    const donations = [];

    for (let i = 0; i < days; i++) {
      let currentDate = startDate.add(i, "day");

      donations.push({
        key: i,
        fecha: currentDate.format("DD-MM-YYYY"),
        monto: amount / days,
        recibo: receiptNumber,
        observacion: "",
      });
    }

    setDonationBulk(donations);
  }, [isSingleDateDonation, receiptNumber, amount, observacion, singleDate, donationDatesRange]);

  function handleDatesChange(datesJs, datesStr) {
    const start = datesStr[0];
    const end = datesStr[1];

    setDonationDatesRange([start, end]);
    handleRadioDatesChange();
  }

  // Manejar cambios en la columna de observación
  const handleObservationChange = (key, value) => {
    setDonationBulk((prev) =>
      prev.map((donation) =>
        donation.key === key ? { ...donation, observacion: value } : donation
      )
    );
  };

  function handleSingleDateChange(dateJsObject, dateString) {
    console.warn("Object", dateJsObject)
    console.log("Parsed", dateJsObject.format("DD-MM-YYYY"))

    setSingleDate(dateJsObject.format("DD-MM-YYYY"));
  }

  const tableColumns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Monto",
      dataIndex: "monto",
      key: "monto",
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleObservationChange(record.key, e.target.value)}
          placeholder="Agregar observación"
        />
      ),
    },
  ];

  return (
    <Modal
      visible={isVisible}
      onCancel={handleClose}
      footer={null}
      centered
      width={600}
      closeIcon={<CloseOutlined style={{ fontSize: "24px" }} />}
      bodyStyle={{ textAlign: "center" }}
    >
      <Space direction="vertical" size={30} style={{ width: "60%" }}>
        <span
          style={{ fontSize: "24px", color: "#AFAFAF", fontWeight: "bold" }}
        >
          Donación
        </span>

        <ConfigProvider
          theme={{
            components: {
              Input: {
                addonBg: "rgb(119, 217, 161)",
                hoverBorderColor: "#77D9A1",
                activeBorderColor: "#77D9A1",
              },
            },
          }}
        >
          <Input
            addonBefore={
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Monto a donar
              </span>
            }
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto a donar"
            style={{ fontSize: "20px", marginBottom: "20px" }}
          />
          <Input
            addonBefore={
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                No. Recibo
              </span>
            }
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            placeholder="Número de recibo"
            style={{ fontSize: "20px" }}
          />
        </ConfigProvider>

        <div className="flex flex-row gap-x-4">
          <label>Fecha Única</label>
          <input
            type="radio"
            name="dates-radio"
            id="single-radio"
            defaultChecked={isSingleDateDonation}
            onChange={handleRadioDatesChange}
          />

          <label>Rango de Fechas</label>
          <input
            type="radio"
            name="dates-radio"
            id="range-radio"
            defaultChecked={!isSingleDateDonation}
            onChange={handleRadioDatesChange}
          />
        </div>

        <div className="flex flex-row">
          <label className="w-fit h-fit text-lg font-bold text-white-100 py-1 px-3 rounded-md rounded-r-none bg-[#77D9A1]">
            Fecha
          </label>
          {isSingleDateDonation ? (
            <DatePicker onChange={handleSingleDateChange} allowClear={false} allowEmpty={false} format={"DD-MM-YYYY"} />
          ) : (
            <RangePicker format={"DD-MM-YYYY"} allowEmpty={false} id="rangePicker" onChange={handleDatesChange} />
          )}
        </div>

        {(!isSingleDateDonation) ?
          <Table columns={tableColumns} dataSource={donationBulk} className="custom-table" />
          :
          <div className="flex flex-row">
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    addonBg: "rgb(119, 217, 161)",
                    hoverBorderColor: "#77D9A1",
                    activeBorderColor: "#77D9A1",
                  },
                },
              }}
            >

              <Input
                addonBefore={
                  <span
                    style={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    Observación
                  </span>
                }
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                placeholder="Ingrese una Observación"
                style={{ fontSize: "20px" }}
              />
            </ConfigProvider>
          </div>
        }

        <Button
          key="submit"
          type="primary"
          onClick={() => handleOk(donationBulk)}
          style={{ fontSize: "18px", height: "auto", padding: "10px 20px" }}
        >
          Donar
        </Button>
      </Space>
    </Modal>
  );
};

export default PagarModal;
