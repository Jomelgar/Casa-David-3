import React, { useEffect } from "react";
import ListaEspera from "./../../components/Tablas/TablaEspera";
import { useLayout } from "../../context/LayoutContext";

function ListaDeEspera() {
  const { setCurrentPath } = useLayout();

  useEffect(() => {
    setCurrentPath("/ Lista de Espera");
  }, []);

  return (
    <div>
      <ListaEspera />
    </div>
  );
}

export default ListaDeEspera;
