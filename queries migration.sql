
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
    (3, 'Administrar Huespedes');

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

INSERT INTO lugar (id_lugar, codigo)
VALUES
    (1, 'TGU'),
    (2, 'SPS');

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

-- Personas
INSERT INTO persona (id_persona, id_ocupacion, municipio_id, id_lugar, dni, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion, telefono, genero, fecha_nacimiento)
VALUES
    (2, 1, 10,1, '0801-1975-00330', 'VINDA', 'ESTHER', 'SABILLON', 'CORRALES', 'COL. AMERICA', '9969-9021', 'FEMENINO', '1975-01-07'),
    (52, 12, 10, 2, '0801-1989-16375', 'CESAR', 'ROBERTO', 'CASTELLANOS', 'AGURCIA', 'TATUMBLA FM', '9858-0073', 'MASCULINO', '1989-09-26'),
    (53, 12, 10, 2, '0801-1989-16365', 'CESAR', 'ROBERTO', 'CASTELLANOS', 'AGURCIA', 'TATUMBLA FM', '9858-0073', 'MASCULINO', '1989-09-26'),
    (1, 2, 10, 1, '0801-1975-06770', 'RIGOBERTO', '', 'AGURCIA', 'ZELAYA', 'COLONIA AMERICA', '3322-0903', 'MASCULINO', '1975-11-13'),
    (118, 37, 45, 1, '0310-1984-00425', 'MARIO', 'SAUL', 'CABALLERO', 'BONILLA', 'ALDEA LA DEFENSA', '9566-4072', 'MASCULINO', '1984-10-01'),
    (119, 38, 45, 1, '0310-2012-00261', 'LICSA', 'YARELY', 'CABALLERO', 'BAIRES', 'ALDEA LA DEFENSA', '9202-5240', 'FEMENINO', '2012-06-11'),
    (120, 39, 45, 1, '0310-1986-00250', 'TERESA', '', 'BAIRES', 'OVIEDO', 'ALDEA LA DEFENSA', '9202-5240', 'FEMENINO', '1986-10-03'),
    (121, 40, 7, 1, '0107-1976-01399', 'PATRICIA', 'LIZZETH', 'FUENTES', 'PORTILLO', 'BARRIO EL RETIRO', '8860-0780', 'FEMENINO', '1976-05-19'),
    (54, 12, 10, 1, '1011-1992-00074', 'DEYBI', 'NOEL', 'RAMOS', 'SANTOS', 'SAN PEDRO SULA', '9988-3646', 'MASCULINO', '1992-08-26'),
    (122, 39, 33, 1, '0101-1961-01846', 'MARIA', 'ESPERANZA', 'RODRIGUEZ', '', 'ALDEA CUACAZONA', '9879-7456', 'FEMENINO', '1961-12-01'),
    (123, 37, 33, 1, '0209-1955-00081', 'CARLOS', 'SEBASTIAN', 'REYES', 'MEJIA', 'ALDEA CUACAZONA', '9651-0319', 'MASCULINO', '1995-09-25'),
    (151, 69, 79, 1, '0801-1979-10397', 'DEBBIE', 'ELAINY', 'BANEGAS', 'OSORIO', 'COLONIA FESITRANH, SAN PEDRO SULA', '3277-2367', 'FEMENINO', '1979-02-24'),
    (152, 69, 79, 1, '1801-1976-00571', 'CARMEN', 'AMERICA', 'SOSA', 'ESCOBAR', 'COLONIA FESITRANH, SAN PEDRO SULA', '9642-7401', 'FEMENINO', '1976-04-27'),
    (69, 1, 90, 1, '0505-2005-00577', 'Jorge', 'Fernando', 'Hernandez', 'Cruz', 'Pueblo Good Sight, Disco 2, Registro 4',  '9870-6238',  'MASCULINO',  '2005-08-28');

-- Hospital

INSERT INTO hospital (id_hospital, nombre, direccion)
VALUES
	(4, 'Centro Médico Concordia', 'Calle del Olmo 9'),
    (12, 'Seguro Social - IHSS', ''),
    (22, 'Fundacion Casa David', ''),
    (23, 'Hospital Club de Leones Fraternidad', 'San Pedro Sula'),
    (24, 'Hospital Mario Catarino Rivas', 'San Pedro Sula'),
    (56, 'Hospital Nacional Mario Catarino Rivas', 'San Pedro Sula');


INSERT INTO piso (id_piso, id_hospital, nombre_piso)
VALUES
    (14, 23, 'Ninguno'),
    (15, 12, 'Ninguno');

INSERT INTO sala (id_sala, id_piso, nombre_sala)
VALUES
    (19, 14, 'Ninguno'),
    (20, 15, 'Ninguno');

INSERT INTO habitacion (id_habitacion, id_lugar, nombre, genero, disponible)
VALUES
    (44, 1, 'Habitacion 1', 'FEMENINO', true),
    (45, 1, 'Habitacion 2', 'FEMENINO', true),
    (46, 1, 'Habitacion 3', 'FEMENINO', true),
    (47, 1, 'Habitacion 4', 'FEMENINO', true),
    (48, 1, 'Habitacion 5', 'FEMENINO', true),
    (49, 1, 'Habitacion 6', 'MASCULINO', true),
    (50, 1, 'Habitacion 7', 'MASCULINO', true);

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

INSERT INTO causa_visita (id_causa_visita, causa)
VALUES
    (35, 'Quebradura de Un Hueso'),
    (36, 'Quemaduras'),
    (37, 'Examenes Clinicos'),
    (38, 'Cirugia programada');


INSERT INTO huesped (id_huesped, id_persona, activo, reingreso)
VALUES
    (61, 118, true, false),
    (62, 119, true, false),
    (63, 120, true, false),
    (64, 121, true, false),
    (65, 122, true, false),
    (66, 123, true, false);
    
INSERT INTO paciente (id_paciente, id_hospital, id_piso, id_sala, observacion, id_person, id_causa_visita)
VALUES
    (76, 23, 14, 19, 'CITA EN OFTALMOLOGIA PEDIATRICA', 119, 35),
    (77, 23, 14, 19, 'CITA EN OFTALMMOLOGIA PEDIATRICA', 119, 35),
    (78, 23, 14, 19, 'CITA EN OFTALMOLOGIA PEDIATRICA', 119, 35),
    (79, 12, 15, 20, 'REALIZARSE BIOPSIA', 121, 37),
    (80, 23, 14, 19, 'Paciente viene para revision y operacion de su ojo izquierdo', 123, 38);

INSERT INTO paciente_huesped (id_paciente_huesped, id_paciente, id_huesped, parentesco_paciente)
VALUES
    (99, 76, 61, 'Hija'),
    (100, 77, 62, 'No Aplica'),
    (101, 78, 63, 'Hija'),
    (102, 79, 64, 'No Aplica'),
    (103, 80, 65, 'Conyugue'),
    (104, 80, 66, 'Conyugue');

INSERT INTO reservacion (id_reservacion, id_paciente_huesped, id_cama, id_hospital, activa, fecha_entrada, fecha_salida, becado)
VALUES
    (52, 99, 116, 23, false, '2024-10-16', '2024-10-17', false),
    (53, 100, 90, 23, false, '2024-10-16', '2024-10-17', false),
    (54, 101, 93, 23, false, '2024-10-16', '2024-10-17', false),
    (55, 102, 104, 12, false, '2024-10-16', '2024-10-17', false),
    (56, 104, 111, 23, true, '2024-10-18', '2024-10-19', false),
    (57, 103, 85, 23, true, '2024-10-18', '2024-10-19', false);

INSERT INTO afiliado (id_afiliado, condicion, dni, nombre)
VALUES
    (9, '', '0107-1976-01399', 'PATRICIA LIZZETH FUENTES PORTILLO');

INSERT INTO afiliado_reservacion (id_afiliado_reservacion, id_afiliado, id_reservacion)
VALUES (7, 9, 55);

INSERT INTO ofrenda (id_ofrenda, id_reservacion, valor, fecha)
VALUES 
(30, 52, 50.0, '2024-10-17'),
(31, 53, 50.0, '2024-10-17'),
(32, 54, 50.0, '2024-10-17'),
(33, 55, 50.0, '2024-10-17'),
(34, 57, 50.0, '2024-10-18');

INSERT INTO usuario (id_usuario, id_persona, id_hospital, nickname, contrasena, rol)
VALUES 
(2, 2, 22, 'vsabillon', '$2b$10$SaXndcvveHT4KaRu6e61x.ReZHQ1IO5D79Ajmf5otdujXThXLjdxm', 'usuario'),
(19, 52, 22, 'ccastellanos01', '$2b$10$HLL4/JFtv5HJWIicdU.gSOKmDoUJRypMB4OXb3kF3j9jrgcJsdLIm', 'admin'),
(20, 53, 22, 'ccastellanos', '$2b$10$GZx/8n7WZpc3RMYZrPMQROiJiveCdcyuhY2TgZmP2Zme8oqw8BqLO', 'usuario'),
(1, 1, 4, 'ragurcia', '$2b$10$gC1RaIJAn4dmhcV1dDKn4uqM306/4kzWhU5Vkek45WlUep89PBJMa', 'admin'),
(21, 54, 22, 'dramos01', '$2b$10$ghXWJPLPb8wVc4KARQ6ZJezD4oX9WWxF3nifCa4tORoejqjxLmY4m', 'usuario'),
(52, 151, 56, 'Banegas01', '$2b$10$CqMJ3UNEfxjEGjEGv3y2uu/0ghAPitwstLleXrC7MGMo2a8.Z/i56', 'usuario'),
(53, 152, 56, 'Sosa01', '$2b$10$lqNL1zsU88ErHCo3H/ewLORy7vjCqsCYVmPry4s90SFB8cAhWfSu.', 'usuario'),
(69, 69, 4, 'fer-hnndz', '$2a$12$ZW23mYxnttwAc2VduPXhEOUKf3BEG8X1k0jFGYhQ0.Yibdk5Rm.Um', 'admin');

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



