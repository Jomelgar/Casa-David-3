import React from "react";
import { Input, Select, DatePicker } from "antd";
import { FaMale, FaFemale } from "react-icons/fa";
import { PiUsersThreeFill } from "react-icons/pi";
import { HiOutlineEye } from "react-icons/hi";

const { Option } = Select;
const { RangePicker } = DatePicker;

// Simulación de datos
const pacientes = [
  { id: 1, nombre: "Menjivar", hospital: "Del Valle", genero: "Masculino", edad: 20 },
  { id: 2, nombre: "Ponce", hospital: "Del Valle", genero: "Masculino", edad: 20 },
];

export default function Pacientes() {
  return (
    <div className="w-full h-full flex flex-col items-center bg-[#FAFAFA] py-8">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-[97%] max-w-[1500px] flex flex-col gap-5">
        {/* FECHAS */}
        <div className="w-full bg-[#F8F9FB] rounded-xl px-4 py-4 flex items-center gap-4">
          <span className="font-semibold text-lg text-[#878787] mr-2">Fechas</span>
          <RangePicker className="rounded-xl !h-10 !w-[320px]" />
        </div>
        {/* FILTROS */}
        <div className="w-full bg-[#F8F9FB] rounded-xl px-6 py-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Select className="w-full !h-10" placeholder="Todos los Departamentos">
              <Option value="all">Todos los Departamentos</Option>
            </Select>
            <Select className="w-full !h-10" placeholder="Todos los Municipios">
              <Option value="all">Todos los Municipios</Option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select className="w-full !h-10" placeholder="Todas las ocupaciones">
              <Option value="all">Todas las ocupaciones</Option>
            </Select>
            <Select className="w-full !h-10" placeholder="Todos los géneros">
              <Option value="all">Todos los Géneros</Option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select className="w-full !h-10" placeholder="Todos los hospitales">
              <Option value="all">Todos los Hospitales</Option>
            </Select>
            <Select className="w-full !h-10" placeholder="Todas las causas">
              <Option value="all">Todas las Causas</Option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input className="!h-10" placeholder="Edad desde" type="number" />
            <Input className="!h-10" placeholder="Edad hasta" type="number" />
          </div>
        </div>
        {/* CARDS DE PACIENTES */}
        <div className="w-full grid grid-cols-3 gap-4 mt-2">
          {/* Masculinos */}
          <div className="bg-[#89e1f7] rounded-xl flex flex-col justify-center items-center py-5 min-h-[100px]">
            <div className="flex items-center gap-2">
              <span className="text-white text-3xl"><FaMale /></span>
              <span className="text-white text-[21px] font-bold leading-tight">Hombres</span>
            </div>
            <div className="text-white text-lg mt-1">Cantidad: 0</div>
          </div>
          {/* Femeninos */}
          <div className="bg-[#fcaaaa] rounded-xl flex flex-col justify-center items-center py-5 min-h-[100px]">
            <div className="flex items-center gap-2">
              <span className="text-white text-3xl"><FaFemale /></span>
              <span className="text-white text-[21px] font-bold leading-tight">Mujeres</span>
            </div>
            <div className="text-white text-lg mt-1">Cantidad: 0</div>
          </div>
          {/* Totales */}
          <div className="bg-[#98e6b1] rounded-xl flex flex-col justify-center items-center py-5 min-h-[100px]">
            <div className="flex items-center gap-2">
              <span className="text-white text-3xl"><PiUsersThreeFill /></span>
              <span className="text-white text-[21px] font-bold leading-tight">Total</span>
            </div>
            <div className="text-white text-lg mt-1">Cantidad: 0</div>
          </div>
        </div>
        {/* TABLA */}
        <div className="w-full mt-6">
          <div className="w-full bg-[#98e6b1] rounded-t-xl">
            <div className="grid grid-cols-6 font-bold text-white text-lg py-2 px-4">
              <div><input type="checkbox" /></div>
              <div>Paciente</div>
              <div>Hospital</div>
              <div>Género</div>
              <div>Edad</div>
              <div>Acciones</div>
            </div>
          </div>
          <div className="w-full bg-white rounded-b-xl border-t-0">
            {pacientes.map((p) => (
              <div
                className="grid grid-cols-6 items-center text-base py-2 px-4 border-b last:border-b-0"
                key={p.id}
              >
                <div><input type="checkbox" /></div>
                <div>{p.nombre}</div>
                <div>{p.hospital}</div>
                <div>{p.genero}</div>
                <div>{p.edad}</div>
                <div>
                  <span className="cursor-pointer text-gray-700 text-xl flex justify-center">
                    <HiOutlineEye />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* BOTÓN DESCARGAR */}
        <div className="w-full flex justify-start mt-4">
          <button
            className="bg-[#fcaaaa] text-white px-7 py-2 rounded-lg font-bold border-2 border-white shadow hover:bg-[#fc7a7a] transition"
            style={{
              minWidth: 180,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              letterSpacing: "0.02em"
            }}
          >
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
  );
}
