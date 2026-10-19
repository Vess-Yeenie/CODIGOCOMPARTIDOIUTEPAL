-- ======================================================================
-- BASE DE DATOS INSTITUCIONAL IUTEPAL (MYSQL / MARIADB)
-- Exportado automáticamente: 2026-10-19T14:45:28.010Z
-- Total Usuarios : 5
-- Total Trabajos : 25 (Con URLs activas en Cloudinary)
-- Total Logs     : 17
-- ======================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `document_upload` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `document_upload`;

-- ----------------------------------------------------------------------
-- Estructura y Datos de la tabla 'usuario'
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `esIutepalista` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `usuario` (`id`, `nombre`, `email`, `password`, `esIutepalista`) VALUES
  (0, 'Admin', 'admin', '123', 1),
  (1, 'Usuario Prueba', 'test@correo.com', '123456', 1),
  (2, 'Elias', 'ejemplo@gmail.com', '123', 1),
  (3, 'Prueba', 'otro@gmail.com', '123', 0),
  (4, 'Elias', 'eliascuriel06@gmail.com', '123', 1);

-- ----------------------------------------------------------------------
-- Estructura y Datos de la tabla 'trabajos' (URLs Cloudinary)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `trabajos`;
CREATE TABLE `trabajos` (
  `id` varchar(50) NOT NULL,
  `nombre` text DEFAULT NULL,
  `carrera` varchar(50) DEFAULT NULL,
  `ano` int(11) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `pdf_url` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `trabajos` (`id`, `nombre`, `carrera`, `ano`, `tipo`, `pdf_url`) VALUES
  ('t1773284579834', 'Estrategias Administrativas Para La Optimización De La Gestión Contable De La Empresa F. Stanzione, S.A. Puerto Cabello - Estado Carabobo', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420761/trabajos_iutepal/pctqgnorvcbfydo251a0.pdf'),
  ('t1773284437724', 'Estrategias Administrativas Y Contables Para Mejorar El Modo De Cobranza En La Empresa Servicio De D G M De Puerto Cabello', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420760/trabajos_iutepal/sxigi0omejrzppm6ieb3.pdf'),
  ('t1773284674864', 'Estrategias Contables Para Adecuar Los Gastos En La Empresa Agentes Aduanales Marieka C.A, En Puerto Cabello, Edo. Carabobo', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420763/trabajos_iutepal/ydztswo5zix6jb1o9f92.pdf'),
  ('t1773284765309', 'Estrategias Contables Para El Fortalecimiento De La Gestión Administrativa En La Empresa Fariñas Y Colina, C.A., Agente De Aduanas', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420765/trabajos_iutepal/vb6qrxota4euapzopidy.pdf'),
  ('t1773284398298', 'Estrategias Contables Para La Optimización De La Gestión Presupuestaria En El Departamento De Repuesto De La Empresa Toyoprimium, C.A. Puerto Cabello Estado Carabobo', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420759/trabajos_iutepal/cdzndfdqjaq8b87hgofg.pdf'),
  ('t1773284629667', 'Estrategias Gerenciales Para Optimizar El Desarrollo Laboral De Los Trabajadores En La Agencia Aduanal Marguani C.A Puerto Cabello Estado Carabobo.', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420762/trabajos_iutepal/eseci3j0m8jndupvsjyx.pdf'),
  ('t1773284721639', 'Estrategias Gerenciales Para Optimizar La Gestión Contable En La Empresa Sugar Fantasy Puerto Cabello Edo. Carabobo', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420764/trabajos_iutepal/sivbeembqndpjnwkhx2p.pdf'),
  ('t1773285175914', 'Evaluación Del Sistema De Ensacado Para La Minimización De Riesgos Laborales De La Empresa Ferro Aluminio CA', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420773/trabajos_iutepal/zgw4d1wvp5avyynpdsam.pdf'),
  ('t1773284835329', 'Implementación De Prácticas De Laboratorio En Microcontroladores Y Plc Para Electrónica', 'ELECTRONICA', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420766/trabajos_iutepal/mdw15wc5vpwyxmx3e13j.pdf'),
  ('t1773285100423', 'Medidas Para Mejorar Las Condiciones De Seguridad Y Salud Laboral En Las Operaciones De La Empresa Supercines Costa Mar C.A.', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420772/trabajos_iutepal/xqhgxnlvt9njjet8fa3g.pdf'),
  ('t1773284273206', 'Mejora Estructural Del Sistema De Cribas En La Unidad De Granulación De La Planta De Urea.', 'PRODUCCION', 2024, 'trabajo', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420752/trabajos_iutepal/m3ofgim6az5c2yiqgexm.pdf'),
  ('t1773284800756', 'Método Contable Para El Control Del Inventario En La Empresa Andy Repuestos F.P, Puerto Cabello Estado Carabobo', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420765/trabajos_iutepal/fgzylrdpzgkp5qvgnjr4.pdf'),
  ('t1773285028276', 'Plan De Mantenimiento Preventivo A Máquina Jumbo 320C En La Empresa Multireciclajes PC', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420770/trabajos_iutepal/jvtl68pvnam3gdd1aldk.pdf'),
  ('t1773284309522', 'Plan De Mantenimiento Preventivo A Una Máquina Jumbo 320 C En La Empresa Multireciclajes PC.CA', 'PRODUCCION', 2024, 'trabajo', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420758/trabajos_iutepal/sdnfxhyq3nensvcjtg5h.pdf'),
  ('t1773284903066', 'Plan De Recuperación De Operatividad De Ascensores Del Instituto Universitario De Tecnología Juan Pablo Pérez Alfonzo - Ampliación Puerto Cabello', 'ELECTRONICA', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420767/trabajos_iutepal/a98zk3wqnxxx6zz0lvnu.pdf'),
  ('t1773284868724', 'Propuesta De Implementación De Prácticas De Laboratorio En Máquinas Eléctricas Para Electrónica', 'ELECTRONICA', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420767/trabajos_iutepal/d6maeyfqf0wi8ors0j0l.pdf'),
  ('t1773284976978', 'Propuesta De Un Programa De Seguridad Y Salud Ocupacional Para Reducir Lesiones Y Enfermedades Laborales En El Área De Soldadura Dirigida A Los Trabajadores De La Asociación Cooperativa Fabrisol RL. Ubicado En El Municipio Juan Jose Mora.', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420769/trabajos_iutepal/vklmztxnte4ebpl22mya.pdf'),
  ('t1773284937416', 'Propuesta Para La Implementación De Un Sistema De Gestión De La Calidad, Basado En La Norma ISO 9001:2015, Para La Empresa Industrias Alimenticias Cocoa, C.A.', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420768/trabajos_iutepal/at4jelhsyqrughktmajx.pdf'),
  ('t1773284517249', 'Sistema Contable Administrativo Para Adecuar La Información Financiera De La Empresa Inversiones Halcones C.A Estado Carabobo, Puerto Cabello 2024', 'CONTABILIDAD', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420761/trabajos_iutepal/yhwcmeb1lmqt2vfp80ul.pdf'),
  ('t1773284088340', 'Sistema De Gestión De Mantenimiento Preventivo Y Correctivo A Las Máquinas De Ensacado De Urea Del Complejo Petroquímico Hugo Chávez, Morón- Carabobo.', 'PRODUCCION', 2024, 'trabajo', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420747/trabajos_iutepal/o5w8mqkxy7ysbjvhuhzt.pdf'),
  ('t1773285070090', 'Sistema De Gestión De Mantenimiento Preventivo Y Correctivo A Las Máquinas De Ensacado De Urea Del Complejo Petroquímico Hugo Chávez, Morón- Carabobo.', 'PRODUCCION', 2024, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420771/trabajos_iutepal/t9puezn7rjtcddupalvb.pdf'),
  ('t1773284025846', 'Estrategias Motivacionales Para La Mejora De La Satisfacción Laboral De Los Empleados En La Empresa Martínez Reyes Aduana S.R.L.', 'ADMINISTRACION', 2021, 'trabajo', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420745/trabajos_iutepal/zo949vlvfc0d1snfvgwl.pdf'),
  ('t1773283912947', 'Diseño De Un Sistema Automatizado Que Registre Y Controle La Matrícula De Los Alumnos De La Escuela Básica Nacional “Taborda”, Ubicada En Puerto Cabello, Estado Carabobo.', 'INFORMATICA', 2018, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420743/trabajos_iutepal/llqxkruquabbedgnobkl.pdf'),
  ('t1', 'Estrategias Para El Mejoramiento En El Proceso De Cálculo, Pago Y Retención Del Impuesto Al Valor Agregado (I.V.A.) En La Empresa Rectificadora De Motores J&D C.A. De Morón Estado Carabobo', 'ADMINISTRACION', 2018, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420742/trabajos_iutepal/elncxcn0wstord7skufj.pdf'),
  ('t1773284140263', 'Plan De Recuperación De Operatividad De Ascensores Del Instituto Universitario De Tecnología Juan Pablo Pérez Alfonzo - Ampliación Puerto Cabello', 'PRODUCCION', 2018, 'resumen', 'https://res.cloudinary.com/tnivyock/image/upload/v1792420748/trabajos_iutepal/yyfwyma4bzvx2hauoxwc.pdf');

-- ----------------------------------------------------------------------
-- Estructura y Datos de la tabla 'logs'
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `action` varchar(50) NOT NULL,
  `doc_id` varchar(50) DEFAULT NULL,
  `fecha` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_logs_usuario` (`usuario_id`),
  KEY `fk_logs_doc` (`doc_id`),
  CONSTRAINT `fk_logs_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_logs_doc` FOREIGN KEY (`doc_id`) REFERENCES `trabajos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  (19, 4, '', NULL, '16-7-2026'),
  (20, 0, 'view', 't1773284088340', '2026-10-18T02:23:24.575Z'),
  (21, 0, 'view', NULL, '2026-10-18T02:23:54.722Z');

SET FOREIGN_KEY_CHECKS = 1;
