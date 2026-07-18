-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-07-2026 a las 00:19:33
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `document_upload`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `esIutepalista` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `email`, `password`, `esIutepalista`) VALUES
(0, 'Admin', 'admin', '123', 1),
(1, 'Usuario Prueba', 'test@correo.com', '123456', 1),
(2, 'Elias', 'ejemplo@gmail.com', '123', 1),
(3, 'Prueba', 'otro@gmail.com', '123', 0),
(4, 'Elias', 'eliascuriel06@gmail.com', '123', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajos`
--

CREATE TABLE `trabajos` (
  `id` varchar(50) NOT NULL,
  `nombre` text DEFAULT NULL,
  `carrera` varchar(50) DEFAULT NULL,
  `ano` int(11) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `pdf_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `trabajos`
--

INSERT INTO `trabajos` (`id`, `nombre`, `carrera`, `ano`, `tipo`, `pdf_url`) VALUES
('t1', 'Estrategias Para El Mejoramiento En El Proceso De Cálculo, Pago Y Retención Del Impuesto Al Valor Agregado (I.V.A.) En La Empresa Rectificadora De Motores J&D C.A. De Morón Estado Carabobo', 'ADMINISTRACION', 2018, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773283866/rh65vts0vnduynvu8bum.pdf'),
('t1773283912947', 'Diseño De Un Sistema Automatizado Que Registre Y Controle La Matrícula De Los Alumnos De La Escuela Básica Nacional “Taborda”, Ubicada En Puerto Cabello, Estado Carabobo.', 'INFORMATICA', 2018, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773283911/rgk9vugk3gwrpwogloib.pdf'),
('t1773284025846', 'Estrategias Motivacionales Para La Mejora De La Satisfacción Laboral De Los Empleados En La Empresa Martínez Reyes Aduana S.R.L.', 'ADMINISTRACION', 2021, 'trabajo', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284025/w215454x9r8bmca0ldp3.pdf'),
('t1773284088340', 'Sistema De Gestión De Mantenimiento Preventivo Y Correctivo A Las Máquinas De Ensacado De Urea Del Complejo Petroquímico Hugo Chávez, Morón- Carabobo.', 'PRODUCCION', 2024, 'trabajo', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284087/wtibgnsvxy9lze0fpdgx.pdf'),
('t1773284140263', 'Plan De Recuperación De Operatividad De Ascensores Del Instituto Universitario De Tecnología Juan Pablo Pérez Alfonzo - Ampliación Puerto Cabello', 'PRODUCCION', 2018, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284139/nsbwig7zaqwxv3a94f98.pdf'),
('t1773284273206', 'Mejora Estructural Del Sistema De Cribas En La Unidad De Granulación De La Planta De Urea.', 'PRODUCCION', 2024, 'trabajo', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284272/nwor3vy8aneskyyeojuf.pdf'),
('t1773284309522', 'Plan De Mantenimiento Preventivo A Una Máquina Jumbo 320 C En La Empresa Multireciclajes PC.CA', 'PRODUCCION', 2024, 'trabajo', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284309/byf3jzx3yvpmlepoabjz.pdf'),
('t1773284398298', 'Estrategias Contables Para La Optimización De La Gestión Presupuestaria En El Departamento De Repuesto De La Empresa Toyoprimium, C.A. Puerto Cabello Estado Carabobo', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284397/ysk5yg6cpq5twxtry9uc.pdf'),
('t1773284437724', 'Estrategias Administrativas Y Contables Para Mejorar El Modo De Cobranza En La Empresa Servicio De D G M De Puerto Cabello', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284437/ivpme0crsc3ppdoekrmn.pdf'),
('t1773284517249', 'Sistema Contable Administrativo Para Adecuar La Información Financiera De La Empresa Inversiones Halcones C.A Estado Carabobo, Puerto Cabello 2024', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284516/uywx5pttwg304ppzbq3d.pdf'),
('t1773284579834', 'Estrategias Administrativas Para La Optimización De La Gestión Contable De La Empresa F. Stanzione, S.A. Puerto Cabello - Estado Carabobo', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284579/skbbsnab6ujtj9ajcc72.pdf'),
('t1773284629667', 'Estrategias Gerenciales Para Optimizar El Desarrollo Laboral De Los Trabajadores En La Agencia Aduanal Marguani C.A Puerto Cabello Estado Carabobo.', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284629/eoebbs4isbvwtmhnrzu3.pdf'),
('t1773284674864', 'Estrategias Contables Para Adecuar Los Gastos En La Empresa Agentes Aduanales Marieka C.A, En Puerto Cabello, Edo. Carabobo', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284674/n2ujsyuuf8fxivkrfbjk.pdf'),
('t1773284721639', 'Estrategias Gerenciales Para Optimizar La Gestión Contable En La Empresa Sugar Fantasy Puerto Cabello Edo. Carabobo', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284720/lii0hkbgsqup0gq3n5gv.pdf'),
('t1773284765309', 'Estrategias Contables Para El Fortalecimiento De La Gestión Administrativa En La Empresa Fariñas Y Colina, C.A., Agente De Aduanas', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284764/vhhct9pnhtt4bmdfhcow.pdf'),
('t1773284800756', 'Método Contable Para El Control Del Inventario En La Empresa Andy Repuestos F.P, Puerto Cabello Estado Carabobo', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284800/id6jsxrpaegh38r4ba0z.pdf'),
('t1773284835329', 'Implementación De Prácticas De Laboratorio En Microcontroladores Y Plc Para Electrónica', 'ELECTRONICA', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284834/iuigoqyegnmguqe8eehj.pdf'),
('t1773284868724', 'Propuesta De Implementación De Prácticas De Laboratorio En Máquinas Eléctricas Para Electrónica', 'ELECTRONICA', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284868/hrrarcrvig9dl32qu9fr.pdf'),
('t1773284903066', 'Plan De Recuperación De Operatividad De Ascensores Del Instituto Universitario De Tecnología Juan Pablo Pérez Alfonzo - Ampliación Puerto Cabello', 'ELECTRONICA', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284902/jt2vuzhf681mi0uybfjn.pdf'),
('t1773284937416', 'Propuesta Para La Implementación De Un Sistema De Gestión De La Calidad, Basado En La Norma ISO 9001:2015, Para La Empresa Industrias Alimenticias Cocoa, C.A.', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284936/huqi9kxbifzbbcthd5zk.pdf'),
('t1773284976978', 'Propuesta De Un Programa De Seguridad Y Salud Ocupacional Para Reducir Lesiones Y Enfermedades Laborales En El Área De Soldadura Dirigida A Los Trabajadores De La Asociación Cooperativa Fabrisol RL. Ubicado En El Municipio Juan Jose Mora.', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284976/gxbt8bhdvnhtw2r2l9hb.pdf'),
('t1773285028276', 'Plan De Mantenimiento Preventivo A Máquina Jumbo 320C En La Empresa Multireciclajes PC', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773285027/wk0oudxvkegcakzxg1js.pdf'),
('t1773285070090', 'Sistema De Gestión De Mantenimiento Preventivo Y Correctivo A Las Máquinas De Ensacado De Urea Del Complejo Petroquímico Hugo Chávez, Morón- Carabobo.', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773285069/yj7jftilihgxlfchoofr.pdf'),
('t1773285100423', 'Medidas Para Mejorar Las Condiciones De Seguridad Y Salud Laboral En Las Operaciones De La Empresa Supercines Costa Mar C.A.', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773285099/w7gnicgvuvtoymsjy0pv.pdf'),
('t1773285175914', 'Evaluación Del Sistema De Ensacado Para La Minimización De Riesgos Laborales De La Empresa Ferro Aluminio CA', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773285175/hlfj5c91ivqzx2v0khfq.pdf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `action` varchar(50) NOT NULL,
  `doc_id` varchar(50) DEFAULT NULL,
  `fecha` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `logs`
--

INSERT INTO `logs` (`id`, `usuario_id`, `action`, `doc_id`, `fecha`) VALUES
(5, 0, 'view', NULL, '2026-04-13T17:59:31.670Z'),
(6, 0, 'view', 't1773284437724', '2026-04-13T18:26:16.680Z'),
(7, 0, 'view', 't1773284976978', '2026-04-14T02:43:20.804Z'),
(8, 0, 'view', 't1773284273206', '2026-04-14T02:43:34.066Z'),
(9, 0, 'view', 't1773284273206', '2026-04-14T02:44:39.558Z'),
(10, 0, 'view', NULL, '2026-04-14T02:45:30.669Z'),
(11, 0, 'view', NULL, '2026-04-14T03:34:43.193Z'),
(12, 0, 'view', NULL, '2026-04-14T03:36:10.507Z'),
(13, 0, 'view', 't1773284273206', '2026-07-08T15:23:36.645Z'),
(14, 0, 'view', 't1773284088340', '2026-07-08T15:25:09.002Z'),
(15, 0, 'view', 't1773284674864', '2026-07-08T15:52:13.959Z'),
(16, 0, 'view', 't1773284579834', '2026-07-08T15:52:18.939Z'),
(17, 4, '', NULL, '15-7-2026'),
(18, 4, 'view', 't1773284517249', '2026-07-16T02:37:27.124Z'),
(19, 4, '', NULL, '16-7-2026');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `doc_id` (`doc_id`);

--
-- Indices de la tabla `trabajos`
--
ALTER TABLE `trabajos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `fk_logs_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_logs_trabajos` FOREIGN KEY (`doc_id`) REFERENCES `trabajos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
