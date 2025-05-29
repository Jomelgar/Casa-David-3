import React from "react";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// import { useEffect, useState } from "react";

// Layout
import LayoutAdmin from "./layouts/LayoutAdmin.jsx";
import LayoutAuth from "./layouts/LayoutAuth.jsx";

// Pages auth
import Login from "./pages/auth/Login.jsx";

//Pages admin
import pagesAdmin from "./pages/admin/index.jsx";

import Error404 from "./pages/Error404.jsx";

//Pages User
import FormularioHuesped from "./pages/user/FormularioHuesped.jsx";

import { getUserFromToken } from "./utilities/auth.utils.js";
import { validarPrivilegio } from "./utilities/validarUserLog.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LayoutAuth />}>
          <Route index element={<Login />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAllow={getUserFromToken() !== null}
              redirectTo="/auth"
            />
          }
        >
          <Route path="/" element={<LayoutAdmin />}>
            <Route index element={<pagesAdmin.Home />} />

            <Route path="/hospedar" element={<pagesAdmin.Hospedar />} />

            <Route
              element={
                <ProtectedRoute
                  isAllow={validarPrivilegio(getUserFromToken(), 3)}
                />
              }
            >
              <Route
                path="/huesped/:idReservacion"
                element={<pagesAdmin.Huesped />}
              />

              <Route path="/huespedes" element={<pagesAdmin.Huespedes />} />
            </Route>

            <Route
              path="/reportes/personas"
              element={
                <ProtectedRoute
                  isAllow={validarPrivilegio(getUserFromToken(), 5)}
                >
                  <pagesAdmin.Personas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lista-negra"
              element={
                <ProtectedRoute
                  isAllow={validarPrivilegio(getUserFromToken(), 6)}
                >
                  <pagesAdmin.ListaNegra />
                </ProtectedRoute>
              }
            />

            <Route
              element={
                <ProtectedRoute
                  isAllow={validarPrivilegio(getUserFromToken(), 4)}
                />
              }
            >
              <Route
                path="/mantenimiento/usuarios"
                element={<pagesAdmin.Usuarios />}
              />

              <Route
                path="/mantenimiento/usuario/:id"
                element={<pagesAdmin.VistaUsuario />}
              />

              <Route
                path="/mantenimiento/usuarios/CrearUsuarios"
                element={<pagesAdmin.CrearUsuarios />}
              />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  isAllow={validarPrivilegio(getUserFromToken(), 2)}
                />
              }
            >
              <Route
                path="/mantenimiento/habitaciones"
                element={<pagesAdmin.Habitaciones />}
              />

              <Route
                path="/mantenimiento/habitaciones/dormitorio"
                element={<pagesAdmin.dormitorio />}
              />

              <Route
                path="/mantenimiento/camas"
                element={<pagesAdmin.Camas />}
              />

              <Route
                path="/mantenimiento/paises"
                element={<ProtectedRoute isAllow={validarPrivilegio(getUserFromToken(), 11)}>
                  <pagesAdmin.Paises/>
                </ProtectedRoute>}
                
              />

              <Route
                path="/mantenimiento/paises/:id"
                element={<pagesAdmin.TiposPaises />}
              />

            </Route>
            <Route
              element={
                <ProtectedRoute
                  isAllow={validarPrivilegio(getUserFromToken(), 10)}
                />
              }
            >
              <Route path="reportes/pagos" element={<pagesAdmin.Pagos />} />
              <Route
                path="reportes/reporte-de-huespedes"
                element={<pagesAdmin.ReporteHuesped />}
              />
              <Route
                path="reportes/residentes-actuales"
                element={<pagesAdmin.ResidentesActuales />}
              />
              <Route
                path="reportes/informes"
                element={<pagesAdmin.Informes />}
              />

              <Route
                path= "reportes/pacientes"
                element={<pagesAdmin.Pacientes />}
              />
            </Route>

            <Route path="perfil" element={<pagesAdmin.Perfil />} />
            <Route
              path="/tabla-de-solicitudes"
              element={
                <ProtectedRoute
                  isAllow={validarPrivilegio(getUserFromToken(), 9)}
                >
                  <pagesAdmin.TablaDeSolicitudes />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
