
-- Privilegios
INSERT INTO privilegio (id_privilegio, descripcion)
VALUES
    (1, 'Asignar Camas'),
    (2, 'Administrar Dormitorios'),
    (4, 'Administrar Usuarios'),
    (5, 'Administrar Personas'),
    (6, 'Administrar Lista Negra'),
    (7, 'Administrar Lista de Espera'),
    (8, 'Hospedar'),
    (9, 'Administrar Solicitudes de Hospedaje'),
    (10, 'Administrar Reportes'),
    (3, 'Administrar Huespedes'),
    (11, 'Administrar Paises');

-- Reglamento
INSERT INTO reglamento (id_regla, descripcion_regla)
VALUES
    (1, 'Todos los visitantes deben registrarse en la recepción.'),
    (2, 'No está permitido fumar en las instalaciones.'),
    (3, 'Los visitantes deben mantener un nivel de ruido bajo para no perturbar a los pacientes.'),
    (4, 'Las visitas están limitadas a dos personas por paciente a la vez.'),
    (5, 'No se permite la entrada de alimentos o bebidas externas.'),
    (6, 'El horario de visitas es de 8 a.m. a 8 p.m.'),
    (7, 'Los niños menores de 12 años deben estar acompañados por un adulto en todo momento.'),
    (8, 'No se permite el uso de teléfonos móviles en las salas de examen.'),
    (9, 'Todos los visitantes deben lavarse las manos antes de entrar a las habitaciones de los pacientes.'),
    (10, 'Está prohibido el ingreso de animales, excepto animales de servicio debidamente identificados.');


-- Corrección completa tabla lugar
INSERT INTO lugar (id_lugar, id_pais, codigo, direccion, activo)
VALUES
(1, 1, 'TGU', 'Tegucigalpa, Honduras', true),
(2, 1, 'SPS', 'San Pedro Sula, Honduras', true);


-- Ocupacion
INSERT INTO ocupacion (id_ocupacion, descripcion)
VALUES
    (1, 'INGENIERO'),
    (2, 'MÉDICO'),
    (3, 'ABOGADO'),
    (4, 'ARQUITECTO'),
    (5, 'PROGRAMADOR'),
    (6, 'PROFESOR'),
    (7, 'CIENTÍFICO'),
    (8, 'CONTADOR'),
    (9, 'DISEÑADOR GRÁFICO'),
    (10, 'PSICÓLOGO'),
    (12, 'LICENCIADO'),
    (13, 'PIONERO'),
    (14, 'OBRERO'),
    (15, 'CARPINTERO'),
    (16, 'ZAPATERO'),
    (17, 'ALBAÑIL'),
    (18, 'NINGUNA'),
    (19, 'FLORERO'),
    (37, 'AGRICULTOR'),
    (38, 'ESTUDIANTE'),
    (39, 'AMA DE CASA'),
    (40, 'ENFERMERA INSTRUMENTISTA'),
    (41, 'BARBERO'),
    (42, 'RECIEN NACIDO'),
    (69, 'LICENCIADA');


--Persona
INSERT INTO persona (
    id_persona, id_lugar, id_ocupacion, dni, municipio_id,
    direccion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
    genero, fecha_nacimiento, compartio_evangelio, acepto_a_cristo,
    iglesia, reconcilio, extranjero, observacion
)
VALUES
(2, 1, 1, '0801-1975-00330', 10, 'COL. AMERICA', 'VINDA', 'ESTHER', 'SABILLON', 'CORRALES', 'FEMENINO', '1975-01-07', true, true, 'Iglesia Central', false, false, NULL),
(52, 2, 12, '0801-1989-16375', 10, 'TATUMBLA FM', 'CESAR', 'ROBERTO', 'CASTELLANOS', 'AGURCIA', 'MASCULINO', '1989-09-26', true, true, 'Iglesia Central', false, false, NULL),
(53, 2, 12, '0801-1989-16365', 10, 'TATUMBLA FM', 'CESAR', 'ROBERTO', 'CASTELLANOS', 'AGURCIA', 'MASCULINO', '1989-09-26', true, true, 'Iglesia Central', false, false, NULL),
(1, 1, 2, '0801-1975-06770', 10, 'COLONIA AMERICA', 'RIGOBERTO', '', 'AGURCIA', 'ZELAYA', 'MASCULINO', '1975-11-13', true, true, 'Iglesia Central', false, false, NULL),
(118, 1, 37, '0310-1984-00425', 45, 'ALDEA LA DEFENSA', 'MARIO', 'SAUL', 'CABALLERO', 'BONILLA', 'MASCULINO', '1984-10-01', true, true, 'Iglesia Central', false, false, NULL),
(119, 1, 38, '0310-2012-00261', 45, 'ALDEA LA DEFENSA', 'LICSA', 'YARELY', 'CABALLERO', 'BAIRES', 'FEMENINO', '2012-06-11', true, false, 'Iglesia Central', false, false, NULL),
(120, 1, 39, '0310-1986-00250', 45, 'ALDEA LA DEFENSA', 'TERESA', '', 'BAIRES', 'OVIEDO', 'FEMENINO', '1986-10-03', true, false, 'Iglesia Central', false, false, NULL),
(121, 1, 40, '0107-1976-01399', 7, 'BARRIO EL RETIRO', 'PATRICIA', 'LIZZETH', 'FUENTES', 'PORTILLO', 'FEMENINO', '1976-05-19', true, false, 'Iglesia Central', false, false, NULL),
(54, 1, 12, '1011-1992-00074', 10, 'SAN PEDRO SULA', 'DEYBI', 'NOEL', 'RAMOS', 'SANTOS', 'MASCULINO', '1992-08-26', false, false, 'Iglesia Central', false, false, NULL),
(122, 1, 39, '0101-1961-01846', 33, 'ALDEA CUACAZONA', 'MARIA', 'ESPERANZA', 'RODRIGUEZ', '', 'FEMENINO', '1961-12-01', false, false, 'Iglesia Central', false, false, NULL),
(123, 1, 37, '0209-1955-00081', 33, 'ALDEA CUACAZONA', 'CARLOS', 'SEBASTIAN', 'REYES', 'MEJIA', 'MASCULINO', '1995-09-25', true, true, 'Iglesia Central', false, false, NULL),
(151, 1, 69, '0801-1979-10397', 79, 'COLONIA FESITRANH, SAN PEDRO SULA', 'DEBBIE', 'ELAINY', 'BANEGAS', 'OSORIO', 'FEMENINO', '1979-02-24', true, true, 'Iglesia Central', false, false, NULL),
(152, 1, 69, '1801-1976-00571', 79, 'COLONIA FESITRANH, SAN PEDRO SULA', 'CARMEN', 'AMERICA', 'SOSA', 'ESCOBAR', 'FEMENINO', '1976-04-27', true, true, 'Iglesia Central', false, false, NULL),
(69, 1, 1, '0505-2005-00577', 90, 'Pueblo Good Sight, Disco 2, Registro 4', 'Jorge', 'Fernando', 'Hernandez', 'Cruz', 'MASCULINO', '2005-08-28', true, true, 'Iglesia Central', false, false, NULL),
(15,1,1,'0501-2005-08506',79,'Costa Verde Villas','Johnny','Josue','Melgar','Machorro','MASCULINO','2005-07-23',true,true,'Iglesia Central',false,false,NULL);

    -- Teléfonos
INSERT INTO telefono (id_pais,id_telefono, id_persona, referencia_telefonica, telefono)
VALUES
(1,1, 118, '+504', '9566-4072'),
(1,2, 119, '+504', '9202-5240'),
(1,3, 120, '+504', '9202-5240');


-- Lista Negra
INSERT INTO lista_negra (id_lista_negra, id_persona, id_regla, observacion)
VALUES
(1, 54, 2, 'Incumplimiento de normas'),
(2, 122, 3, 'Conducta inapropiada');

--Hospital
INSERT INTO hospital (id_hospital, id_pais, nombre, direccion, activo)
VALUES
(4, 1, 'Centro Médico Concordia', 'Calle del Olmo 9', true),
(12, 1, 'Seguro Social - IHSS', '', true),
(22, 1, 'Fundacion Casa David', '', true),
(23, 1, 'Hospital Club de Leones Fraternidad', 'San Pedro Sula', true),
(24, 1, 'Hospital Mario Catarino Rivas', 'San Pedro Sula', true),
(56, 1, 'Hospital Nacional Mario Catarino Rivas', 'San Pedro Sula', true);

--piso
INSERT INTO piso (id_piso, id_hospital, nombre_piso)
VALUES
    (14, 23, 'Ninguno'),
    (15, 12, 'Ninguno');

--sala
INSERT INTO sala (id_sala, id_piso, nombre_sala)
VALUES
    (19, 14, 'Ninguno'),
    (20, 15, 'Ninguno');

--habitacion
INSERT INTO habitacion (id_habitacion, id_lugar, nombre, genero, disponible)
VALUES
    (44, 1, 'Habitacion 1', 'FEMENINO', true),
    (45, 1, 'Habitacion 2', 'FEMENINO', true),
    (46, 1, 'Habitacion 3', 'FEMENINO', true),
    (47, 1, 'Habitacion 4', 'FEMENINO', true),
    (48, 1, 'Habitacion 5', 'FEMENINO', true),
    (49, 1, 'Habitacion 6', 'MASCULINO', true),
    (50, 1, 'Habitacion 7', 'MASCULINO', true);

--cama
INSERT INTO cama (id_cama, id_habitacion, nomre, tipo, disponible)
VALUES
    (81, 44, 'Cama 1', 'INDIVIDUAL', true),
    (82, 44, 'Cama 2', 'INDIVIDUAL', true),
    (83, 44, 'Cama 3', 'INDIVIDUAL', true),
    (84, 45, 'Cama 4', 'INDIVIDUAL', true),
    (86, 45, 'Cama 6', 'INDIVIDUAL', true),
    (87, 45, 'Cama 7', 'INDIVIDUAL', true),
    (88, 45, 'Cama 8', 'INDIVIDUAL', true),
    (89, 45, 'Cama 9', 'INDIVIDUAL', true),
    (91, 46, 'Cama 11', 'INDIVIDUAL', true),
    (92, 46, 'Cama 12', 'INDIVIDUAL', true),
    (94, 47, 'Cama 14', 'INDIVIDUAL', true),
    (95, 47, 'Cama 15', 'INDIVIDUAL', true),
    (96, 47, 'Cama 16', 'INDIVIDUAL', true),
    (97, 47, 'Cama 17', 'INDIVIDUAL', true),
    (98, 47, 'Cama 18', 'INDIVIDUAL', true),
    (99, 48, 'Cama 19', 'INDIVIDUAL', true),
    (100, 48, 'Cama 20', 'INDIVIDUAL', true),
    (101, 48, 'Cama 21', 'INDIVIDUAL', true),
    (102, 48, 'Cama 22', 'INDIVIDUAL', true),
    (103, 48, 'Cama 23', 'INDIVIDUAL', true),
    (105, 49, 'Cama 25', 'CAMAROTE', true),
    (106, 49, 'Cama 26', 'CAMAROTE', true),
    (107, 49, 'Cama 27', 'INDIVIDUAL', true),
    (108, 49, 'Cama 28', 'INDIVIDUAL', true),
    (109, 49, 'Cama 30', 'CAMAROTE', true),
    (110, 49, 'Cama 29', 'CAMAROTE', true),
    (113, 50, 'Cama 33', 'INDIVIDUAL', true),
    (114, 50, 'Cama 34', 'INDIVIDUAL', true),
    (115, 50, 'Cama 35', 'INDIVIDUAL', true),
    (180, 50, 'Cama 37', 'INDIVIDUAL', true),
    (116, 50, 'Cama 36', 'INDIVIDUAL', true),
    (90, 46, 'Cama 10', 'INDIVIDUAL', true),
    (93, 46, 'Cama 13', 'INDIVIDUAL', true),
    (104, 48, 'Cama 24', 'INDIVIDUAL', true),
    (111, 50, 'Cama 32', 'INDIVIDUAL', false),
    (85, 45, 'Cama 5', 'INDIVIDUAL', false);

--causa_visita
INSERT INTO causa_visita (id_causa_visita, causa)
VALUES
    (35, 'Quebradura de Un Hueso'),
    (36, 'Quemaduras'),
    (37, 'Examenes Clinicos'),
    (38, 'Cirugia programada');

-- Iglesia
INSERT INTO iglesia (id_iglesia, nombre)
VALUES
(1, 'Iglesia Central'),
(2, 'Iglesia Esperanza de Vida');


--huesped
INSERT INTO huesped (id_huesped, id_persona, activo, reingreso)
VALUES
    (61, 118, true, false),
    (62, 119, true, false),
    (63, 120, true, false),
    (64, 121, true, false),
    (65, 122, true, false),
    (66, 123, true, false);

-- Iglesia Huesped
INSERT INTO iglesia_huesped (id_iglesia_huesped, id_iglesia, id_huesped)
VALUES
(1, 1, 61),
(2, 2, 62);

--paciente    
INSERT INTO paciente (id_paciente, id_hospital, id_piso, id_sala, observacion, id_person, id_causa_visita)
VALUES
    (76, 23, 14, 19, 'CITA EN OFTALMOLOGIA PEDIATRICA', 119, 35),
    (77, 23, 14, 19, 'CITA EN OFTALMMOLOGIA PEDIATRICA', 119, 35),
    (78, 23, 14, 19, 'CITA EN OFTALMOLOGIA PEDIATRICA', 119, 35),
    (79, 12, 15, 20, 'REALIZARSE BIOPSIA', 121, 37),
    (80, 23, 14, 19, 'Paciente viene para revision y operacion de su ojo izquierdo', 123, 38);

--paciente_huesped
INSERT INTO paciente_huesped (id_paciente_huesped, id_paciente, id_huesped, parentesco_paciente)
VALUES
    (99, 76, 61, 'Hija'),
    (100, 77, 62, 'No Aplica'),
    (101, 78, 63, 'Hija'),
    (102, 79, 64, 'No Aplica'),
    (103, 80, 65, 'Conyugue'),
    (104, 80, 66, 'Conyugue');

--reservacion
INSERT INTO reservacion (id_reservacion, id_paciente_huesped, id_cama, id_hospital, activa, fecha_entrada, fecha_salida, becado)
VALUES
    (52, 99, 116, 23, false, '2024-10-16', '2024-10-17', false),
    (53, 100, 90, 23, false, '2024-10-16', '2024-10-17', false),
    (54, 101, 93, 23, false, '2024-10-16', '2024-10-17', false),
    (55, 102, 104, 12, false, '2024-10-16', '2024-10-17', false),
    (56, 104, 111, 23, true, '2024-10-18', '2024-10-19', false),
    (57, 103, 85, 23, true, '2024-10-18', '2024-10-19', false);

--Afiliado
INSERT INTO afiliado (id_afiliado, id_pais, dni, nombre, condicion)
VALUES
(9, 1, '0107-1976-01399', 'PATRICIA LIZZETH FUENTES PORTILLO', '');


    -- Lista Solicitud
INSERT INTO lista_solicitud (id_lista_solicitud, id_paciente_huesped, observacion, fecha_entrada, fecha_salida, becada, id_afiliado)
VALUES
(1, 99, 'Solicitud pendiente de revisión', '2024-10-15', '2024-10-20', true, 9);

--Afiliado_Reservacion
INSERT INTO afiliado_reservacion (id_afiliado_reservacion, id_afiliado, id_reservacion)
VALUES (7, 9, 55);

-- Cambio Reserva
INSERT INTO cambio_reserva (id_cambio_reserva, id_reservacion, "fechaSalidaAntigua", "fechaSalidaNueva", "fechaModificacion", responsable_id)
VALUES
(1, 55, '2024-10-17', '2024-10-20', '2024-10-16', 2);

-- Patrono
INSERT INTO patrono (id_patrono, nombre)
VALUES
(1, 'Fundación Buen Samaritano');

-- Patrono Afiliado
INSERT INTO patrono_afiliado (id_patrono_afiliado, id_patrono, id_afiliado)
VALUES
(1, 1, 9);

--Ofrenda
INSERT INTO ofrenda (id_ofrenda, id_reservacion, id_pais, valor, recibo, observacion,fecha)
VALUES 
(30, 52, 1, 50.0, 'REC-001', null,current_TIMESTAMP),
(31, 53, 1, 50.0, 'REC-002', null,current_TIMESTAMP),
(32, 54, 1, 50.0, 'REC-003', null,current_TIMESTAMP),
(33, 55, 1, 50.0, 'REC-004', null,current_TIMESTAMP),
(34, 57, 1, 50.0, 'REC-005', null,current_TIMESTAMP);

--Usuario
INSERT INTO usuario (id_usuario, id_persona, id_hospital, nickname, contrasena, rol)
VALUES 
(2, 2, 22, 'vsabillon', '$2a$11$4LfLg0YnqZheuJ62izYs3ONGWnimvex4.n7d5GEUIE2WPdAb9X9Pm', 'usuario'),
(19, 52, 22, 'ccastellanos01', '$2a$11$4LfLg0YnqZheuJ62izYs3ONGWnimvex4.n7d5GEUIE2WPdAb9X9Pm', 'admin'),
(20, 53, 22, 'ccastellanos', '$2a$11$4LfLg0YnqZheuJ62izYs3ONGWnimvex4.n7d5GEUIE2WPdAb9X9Pm', 'usuario'),
(1, 1, 4, 'ragurcia', '$2a$11$4LfLg0YnqZheuJ62izYs3ONGWnimvex4.n7d5GEUIE2WPdAb9X9Pm', 'admin'),
(21, 54, 22, 'dramos01', '$2a$11$4LfLg0YnqZheuJ62izYs3ONGWnimvex4.n7d5GEUIE2WPdAb9X9Pm', 'usuario'),
(52, 151, 56, 'Banegas01', '$2a$11$4LfLg0YnqZheuJ62izYs3ONGWnimvex4.n7d5GEUIE2WPdAb9X9Pm', 'usuario'),
(53, 152, 56, 'Sosa01', '$2a$11$4LfLg0YnqZheuJ62izYs3ONGWnimvex4.n7d5GEUIE2WPdAb9X9Pm', 'usuario'),
(69, 69, 4, 'fer-hnndz', '$2a$11$4LfLg0YnqZheuJ62izYs3ONGWnimvex4.n7d5GEUIE2WPdAb9X9Pm', 'admin'),
(15, 15, 4, 'jomel', '$2a$11$4LfLg0YnqZheuJ62izYs3ONGWnimvex4.n7d5GEUIE2WPdAb9X9Pm', 'master');

--Usuario_Privilegio
INSERT INTO usuario_privilegio (id_usuario_privilegio, id_usuario, id_privilegio)
VALUES 
(27, 2, 10),
(28, 2, 2),
(29, 2, 3),
(30, 2, 5),
(31, 2, 6),
(32, 2, 8),
(33, 21, 2),
(34, 21, 3),
(35, 21, 4),
(36, 21, 6),
(37, 21, 5),
(38, 21, 8),
(39, 21, 9),
(40, 21, 10),
(61, 53, 5),
(62, 52, 5);



