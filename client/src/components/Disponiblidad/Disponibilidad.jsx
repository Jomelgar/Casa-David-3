import { Card, Col, Flex, Row } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CamaApi from "../../api/Cama.api";
import { useLayout } from "../../context/LayoutContext";

function Disponibilidad({
  camasDisponiblesHombres,
  camasDisponiblesMujeres,
  mostrarCantidad = false,
  noSolicitudesHombres = false,
  noSolicitudesMujeres = false,
}) {

  const { userLog } = useLayout();
  const validarDisponibilidadMujeres = () => {
    if (noSolicitudesMujeres) {
      return camasDisponiblesMujeres > noSolicitudesMujeres;
    }

    return camasDisponiblesMujeres > 0;
  };

  const validarDisponibilidadHombres = () => {
    if (noSolicitudesHombres) {
      return camasDisponiblesHombres > noSolicitudesHombres;
    }

    return camasDisponiblesHombres > 0;
  };

  return (
    <Flex justify="center" align="center">
      <Row gutter={25} className="w-full">
        <Col
          xs={{ flex: "100%", width: "100%" }}
          lg={{ flex: "50%" }}
          style={{ marginBottom: 25 }}
        >
          <div
            className={`shadow-#1   select-none text-center px-4 py-2 rounded-3xl  hover:shadow-xl transition-all ${
              validarDisponibilidadMujeres() ? "bg-green-500" : "bg-red-400"
            }`}
          >
            <Flex justify="center" align="center" gap={"small"} style={{}}>
              <h1 className="text-lg text-white-100 text-start">
                {validarDisponibilidadMujeres()
                  ? "Camas Disponibles Para Mujeres"
                  : "No hay camas para mujeres"}
              </h1>
              <span className="text-4xl font-bold text-white-100">👩🏻</span>
            </Flex>

            {mostrarCantidad ? (
              <span className="text-xl font-bold text-white-100">
                {camasDisponiblesMujeres}
              </span>
            ) : (
              ""
            )}
          </div>
        </Col>
        <Col
          xs={{ flex: "100%", width: "100%" }}
          lg={{ flex: "50%" }}
          style={{ marginBottom: 25 }}
        >
          <div
            className={`shadow-#1 select-none text-center px-4 py-2 rounded-3xl hover:shadow-xl transition-all  ${
              validarDisponibilidadHombres() ? "bg-green-500" : "bg-red-400"
            }`}
          >
            <Flex justify="center" align="center" gap={"small"}>
              <h1 className="text-lg text-white-100 text-start">
                {validarDisponibilidadHombres()
                  ? "Camas Disponibles Para Hombres"
                  : "No hay camas para hombres"}
              </h1>
              <span className="text-4xl font-bold text-white-100">👦🏻</span>
            </Flex>

            {mostrarCantidad ? (
              <span className="text-xl font-bold text-white-100">
                {camasDisponiblesHombres}
              </span>
            ) : (
              ""
            )}
          </div>
        </Col>
      </Row>
    </Flex>
  );
}

export default Disponibilidad;
