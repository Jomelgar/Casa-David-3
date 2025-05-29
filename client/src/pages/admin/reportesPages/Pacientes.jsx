import React from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import { PiUsersThreeFill } from "react-icons/pi";
import { HiOutlineEye } from "react-icons/hi";

const pacientes = [
  { id: 1, nombre: "Menjivar", hospital: "Del Valle", genero: "Masculino", edad: 20 },
  { id: 2, nombre: "Ponce", hospital: "Del Valle", genero: "Masculino", edad: 20 },
];

export default function Pacientes() {
  return (
    <div className="w-full h-full flex flex-col justify-start items-center bg-[#FAFAFA] py-10">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-[97%] max-w-[1500px] flex flex-col gap-7">
        <h2 className="font-extrabold text-3xl text-[#273043] mb-2">
          Reportes / Pacientes
        </h2>
        {/* FILTROS */}
        <div className="grid grid-cols-2 gap-3 w-full mb-2">
          {/* Columna Izquierda */}
          <div className="flex flex-col gap-2">
            <div>
              <label className="font-bold text-xs mb-1 block">
                Todos los Departamentos
              </label>
              <select className="w-full border rounded p-1 text-sm">
                <option>Todos los Departamentos</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-xs mb-1 block">
                Todos los Géneros
              </label>
              <select className="w-full border rounded p-1 text-sm">
                <option>Todos los Géneros</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-xs mb-1 block">
                Todos los Hospitales
              </label>
              <select className="w-full border rounded p-1 text-sm">
                <option>Todos los Hospitales</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-xs mb-1 block">
                Edad desde:
              </label>
              <input className="w-full border rounded p-1 text-sm" type="number" />
            </div>
          </div>
          {/* Columna Derecha */}
          <div className="flex flex-col gap-2">
            <div>
              <label className="font-bold text-xs mb-1 block">
                Todos los Municipios
              </label>
              <select className="w-full border rounded p-1 text-sm">
                <option>Todos los Municipios</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-xs mb-1 block">
                Todas las ocupaciones
              </label>
              <select className="w-full border rounded p-1 text-sm">
                <option>Todas las ocupaciones</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-xs mb-1 block">
                Todas las Causas
              </label>
              <select className="w-full border rounded p-1 text-sm">
                <option>Todas las Causas</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-xs mb-1 block">
                Edad hasta:
              </label>
              <input className="w-full border rounded p-1 text-sm" type="number" />
            </div>
          </div>
        </div>
        {/* CARDS */}
        <div className="flex gap-5 mt-1 mb-2 w-full">
          {/* CARD FEMENINOS */}
          <div className="flex-1 bg-[#FC7979] rounded-xl flex flex-col justify-center items-center py-5 min-h-[120px]">
            <span className="mb-0 leading-none">
              <FaFemale size={50} color="white" />
            </span>
            <span className="text-white text-[21px] font-bold leading-tight mt-1">
              Pacientes Femeninos
            </span>
            <span className="text-white text-[32px] font-extrabold mt-[-8px]">0</span>
          </div>
          {/* CARD MASCULINOS */}
          <div className="flex-1 bg-[#52BFFC] rounded-xl flex flex-col justify-center items-center py-5 min-h-[120px]">
            <span className="mb-0 leading-none">
              <FaMale size={50} color="white" />
            </span>
            <span className="text-white text-[21px] font-bold leading-tight mt-1">
              Pacientes Masculinos
            </span>
            <span className="text-white text-[32px] font-extrabold mt-[-8px]">0</span>
          </div>
          {/* CARD TOTALES */}
          <div className="flex-1 bg-[#B4F5C1] rounded-xl flex flex-col justify-center items-center py-5 min-h-[120px]">
            <span className="mb-0 leading-none">
              <PiUsersThreeFill size={50} color="white" />
            </span>
            <span className="text-white text-[21px] font-bold leading-tight mt-1">
              Pacientes Totales
            </span>
            <span className="text-white text-[32px] font-extrabold mt-[-8px]">0</span>
          </div>
        </div>
        {/* TABLA */}
        <div className="w-full bg-[#B4F5C1] rounded-t-xl mt-4">
          <div className="grid grid-cols-6 font-bold text-white text-lg py-2 px-4">
            <div>
              <input type="checkbox" />
            </div>
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
              <div>
                <input type="checkbox" />
              </div>
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
        {/* BOTÓN DESCARGAR */}
        <div className="w-full flex justify-start mt-4">
          <button className="bg-[#FC7979] text-white px-6 py-2 rounded-lg font-bold hover:bg-red-400 transition">
            Descargar Excel
          </button>
        </div>
      </div>
    </div>
  );
}
