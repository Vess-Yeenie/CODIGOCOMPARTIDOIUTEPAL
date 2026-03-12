-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-03-2026 a las 04:40:38
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
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `public_id` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `documentos`
--

INSERT INTO `documentos` (`id`, `nombre`, `url`, `public_id`, `usuario_id`, `fecha`) VALUES
(1, 'TRABAJO DE GRADO INFORMATICA.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773105497/vmlt20hf9stio13ukpan.pdf', 'vmlt20hf9stio13ukpan', 1, '2026-03-10 01:18:17'),
(2, 'TRABAJO DE GRADO INFORMATICA.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773106350/ywupyyodoocxhpemqfax.pdf', 'ywupyyodoocxhpemqfax', 1, '2026-03-10 01:32:30'),
(3, 'TRABAJO DE GRADO INFORMATICA.pdf', 'https://res.cloudinary.com/dbdeldijt/raw/upload/v1773106404/hzfik9sqyt5463m6grzz', 'hzfik9sqyt5463m6grzz', 1, '2026-03-10 01:33:24'),
(4, 'TRABAJO DE GRADO INFORMATICA.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773106631/rbt2gxs9svvu3wmbfelj.pdf', 'rbt2gxs9svvu3wmbfelj', 1, '2026-03-10 01:37:11'),
(5, 'estrategias_contables_para_la_optimizacion_de_la_gestion_presupuestaria_en_el_departamento_de_de_la.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773279988/dpijzhuya0ifibvgnm70.pdf', 'dpijzhuya0ifibvgnm70', 1, '2026-03-12 01:46:28'),
(6, 'estrategias_contables_para_la_optimizacion_de_la_gestion_presupuestaria_en_el_departamento_de_de_la.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773279989/lbka1vitmx7f9h29eoh2.pdf', 'lbka1vitmx7f9h29eoh2', 1, '2026-03-12 01:46:29'),
(7, 'LINEAS DE INVESTIGACION  3  2025, 1 2026, 2 2026.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773280103/bhzjzb9lkccoefhqdwbo.pdf', 'bhzjzb9lkccoefhqdwbo', 1, '2026-03-12 01:48:24'),
(8, 'ESTRATEGIAS GERENCIALES PARA OPTIMIZAR EL DESARROLLO LABORAL.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773280992/qalua1chk2onevwuebot.pdf', 'qalua1chk2onevwuebot', 1, '2026-03-12 02:03:13'),
(9, 'PLAN DE RECUPERACIÃN DE OPERATIVIDAD DE ASCENSORES.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773281081/nibkrtulr8otoxoivsky.pdf', 'nibkrtulr8otoxoivsky', 1, '2026-03-12 02:04:42'),
(10, 'LINEAS DE INVESTIGACION  3  2025, 1 2026, 2 2026.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773281265/vjveljmui6uotofqe552.pdf', 'vjveljmui6uotofqe552', 1, '2026-03-12 02:07:45'),
(11, 'MÃ©todo contable para el control del inventario en la empresa Andy Repuestos.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773281382/wgpyphfoya1zxf7dz9le.pdf', 'wgpyphfoya1zxf7dz9le', 1, '2026-03-12 02:09:42'),
(12, 'medidas_para_mejorar_las_condiciones_de_seguridad_y_salud_laboral_en_las_operaciones_de_la_empresa_c.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773281505/dzuofctqukeoyxoaly7c.pdf', 'dzuofctqukeoyxoaly7c', 1, '2026-03-12 02:11:47'),
(13, 'MÃ©todo contable para el control del inventario en la empresa Andy Repuestos.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773281583/v1ckagipldfqwxrr7y9a.pdf', 'v1ckagipldfqwxrr7y9a', 1, '2026-03-12 02:13:04'),
(14, 'TRABAJO DE GRADO MIXARI Y YOSMERY (1).pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773283866/rh65vts0vnduynvu8bum.pdf', 'rh65vts0vnduynvu8bum', 1, '2026-03-12 02:51:06'),
(15, 'TRABAJO DE GRADO INFORMATICA.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773283911/rgk9vugk3gwrpwogloib.pdf', 'rgk9vugk3gwrpwogloib', 1, '2026-03-12 02:51:52'),
(16, 'TG IUTEPAL EDUARDO BASTIDAS.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284025/w215454x9r8bmca0ldp3.pdf', 'w215454x9r8bmca0ldp3', 1, '2026-03-12 02:53:45'),
(17, 'TEG_Marbelis_PÃ©rez PRODUCCION INDUSTRIAL.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284087/wtibgnsvxy9lze0fpdgx.pdf', 'wtibgnsvxy9lze0fpdgx', 1, '2026-03-12 02:54:48'),
(18, 'PLAN DE RECUPERACIÃN DE OPERATIVIDAD DE ASCENSORES.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284139/nsbwig7zaqwxv3a94f98.pdf', 'nsbwig7zaqwxv3a94f98', 1, '2026-03-12 02:55:40'),
(19, 'TEG_Luis_MencÃ­as PRODUCCION INDUSTRAL.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284272/nwor3vy8aneskyyeojuf.pdf', 'nwor3vy8aneskyyeojuf', 1, '2026-03-12 02:57:53'),
(20, 'TEG_EdwinMedina PRODUCCION INDUSTRIAL.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284309/byf3jzx3yvpmlepoabjz.pdf', 'byf3jzx3yvpmlepoabjz', 1, '2026-03-12 02:58:29'),
(21, 'estrategias_contables_para_la_optimizacion_de_la_gestion_presupuestaria_en_el_departamento_de_de_la.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284397/ysk5yg6cpq5twxtry9uc.pdf', 'ysk5yg6cpq5twxtry9uc', 1, '2026-03-12 02:59:58'),
(22, 'ESTRATEGIAS ADMINISTRATIVAS PARA LA OPTIMIZACIÃN DE LA GESTIÃN.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284437/ivpme0crsc3ppdoekrmn.pdf', 'ivpme0crsc3ppdoekrmn', 1, '2026-03-12 03:00:37'),
(23, 'carrera_administracion_mencion_contabilidad_y_finanza_estrategias_administrativas_y_contables_para_d.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284516/uywx5pttwg304ppzbq3d.pdf', 'uywx5pttwg304ppzbq3d', 1, '2026-03-12 03:01:57'),
(24, 'ESTRATEGIAS ADMINISTRATIVAS PARA LA OPTIMIZACIÃN DE LA GESTIÃN.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284579/skbbsnab6ujtj9ajcc72.pdf', 'skbbsnab6ujtj9ajcc72', 1, '2026-03-12 03:02:59'),
(25, 'ESTRATEGIAS GERENCIALES PARA OPTIMIZAR EL DESARROLLO LABORAL.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284629/eoebbs4isbvwtmhnrzu3.pdf', 'eoebbs4isbvwtmhnrzu3', 1, '2026-03-12 03:03:49'),
(26, 'estrategias_contables_para_adecuar_los_gastos_en_la_empresa_agentes_aduanales_marieka_c_a_en_puerto.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284674/n2ujsyuuf8fxivkrfbjk.pdf', 'n2ujsyuuf8fxivkrfbjk', 1, '2026-03-12 03:04:34'),
(27, 'estrategias_gerenciales_para_optimizar_la_gestion_contable_en_la_empresa_sugar_fantasy_puerto_edo.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284720/lii0hkbgsqup0gq3n5gv.pdf', 'lii0hkbgsqup0gq3n5gv', 1, '2026-03-12 03:05:21'),
(28, 'estrategias_contables_para_el_fortalecimiento_de_la_gestion_administrativ_a_en_la_empresa_farinas_y.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284764/vhhct9pnhtt4bmdfhcow.pdf', 'vhhct9pnhtt4bmdfhcow', 1, '2026-03-12 03:06:05'),
(29, 'MÃ©todo contable para el control del inventario en la empresa Andy Repuestos.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284800/id6jsxrpaegh38r4ba0z.pdf', 'id6jsxrpaegh38r4ba0z', 1, '2026-03-12 03:06:40'),
(30, 'de_puerto_cabello_la_investigacion_se_enmarca_bajo_la_modalidad_de_proyecto_factible_con_el_fin_de_7.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284834/iuigoqyegnmguqe8eehj.pdf', 'iuigoqyegnmguqe8eehj', 1, '2026-03-12 03:07:15'),
(31, 'proporcionando_a_los_estudiantes_una_experiencia_de_aprendizaje_mas_completa_y_significativa_la_los.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284868/hrrarcrvig9dl32qu9fr.pdf', 'hrrarcrvig9dl32qu9fr', 1, '2026-03-12 03:07:48'),
(32, 'PLAN DE RECUPERACIÃN DE OPERATIVIDAD DE ASCENSORES.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284902/jt2vuzhf681mi0uybfjn.pdf', 'jt2vuzhf681mi0uybfjn', 1, '2026-03-12 03:08:23'),
(33, 'ampliacion_puerto_cabello_propuesta_para_la_implementacion_de_un_sistema_de_gestion_de_la_calidad_en.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284936/huqi9kxbifzbbcthd5zk.pdf', 'huqi9kxbifzbbcthd5zk', 1, '2026-03-12 03:08:57'),
(34, 'propuesta_de_un_programa_de_seguridad_y_salud_ocupacional_para_reducir_lesiones_y_enfermedades_en_el.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773284976/gxbt8bhdvnhtw2r2l9hb.pdf', 'gxbt8bhdvnhtw2r2l9hb', 1, '2026-03-12 03:09:36'),
(35, 'plan_de_mantenimiento_preventivo_a_maquina_jumbo_320c_en_la_empresa_multireciclajes_pc.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773285027/wk0oudxvkegcakzxg1js.pdf', 'wk0oudxvkegcakzxg1js', 1, '2026-03-12 03:10:28'),
(36, 'sistema_de_gestion_de_mantenimiento_preventivo_y_correctivo_a_las_maquinas_de_ensacado_de_urea_del.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773285069/yj7jftilihgxlfchoofr.pdf', 'yj7jftilihgxlfchoofr', 1, '2026-03-12 03:11:10'),
(37, 'medidas_para_mejorar_las_condiciones_de_seguridad_y_salud_laboral_en_las_operaciones_de_la_empresa_c.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773285099/w7gnicgvuvtoymsjy0pv.pdf', 'w7gnicgvuvtoymsjy0pv', 1, '2026-03-12 03:11:40'),
(38, 'evaluacion_del_sistema_de_ensacado_para_la_minimizacion_de_riesgos_laborales_de_la_empresa_ferro_ca.pdf', 'https://res.cloudinary.com/dbdeldijt/image/upload/v1773285175/hlfj5c91ivqzx2v0khfq.pdf', 'hlfj5c91ivqzx2v0khfq', 1, '2026-03-12 03:12:55');

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
(1, 2, '', NULL, '10-3-2026'),
(2, 2, '', NULL, '11-3-2026');

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
(1, 'Usuario Prueba', 'test@correo.com', '123456', 1),
(2, 'Elias', 'ejemplo@gmail.com', '123', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
