-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-10-2024 a las 22:33:50
-- Versión del servidor: 10.1.36-MariaDB
-- Versión de PHP: 7.0.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `logistica`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acoplado`
--

CREATE TABLE `acoplado` (
  `idAcoplado` int(30) NOT NULL,
  `idTipo` int(30) NOT NULL,
  `capacidad` double NOT NULL,
  `cantEjes` int(30) NOT NULL,
  `largo` double NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `acoplado`
--

INSERT INTO `acoplado` (`idAcoplado`, `idTipo`, `capacidad`, `cantEjes`, `largo`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 2, 90.05, 3, 100.02, '2024-08-23 00:54:46', '2024-10-06 17:01:33', '0000-00-00 00:00:00'),
(2, 1, 40.77, 1, 60, '2024-08-23 01:17:48', '2024-08-25 14:37:01', '0000-00-00 00:00:00'),
(3, 2, 20, 1, 34, '2024-08-23 01:17:57', '2024-08-23 01:17:57', '0000-00-00 00:00:00'),
(4, 1, 11.89, 1, 20, '2024-08-23 01:53:35', '2024-08-23 01:55:59', '0000-00-00 00:00:00'),
(5, 2, 25.08, 2, 90.01, '2024-08-23 01:55:20', '2024-09-11 13:39:00', '0000-00-00 00:00:00'),
(6, 2, 400, 2, 2, '2024-09-11 13:38:51', '2024-09-12 20:22:00', '0000-00-00 00:00:00'),
(7, 1, 10, 10, 10.3, '2024-09-12 20:00:09', '2024-09-12 20:21:44', '0000-00-00 00:00:00'),
(8, 2, 20.45, 2, 70.32, '2024-09-15 00:03:34', '2024-09-27 01:58:58', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `fechaIngreso` date NOT NULL,
  `telefono` int(11) NOT NULL,
  `email` text NOT NULL,
  `clave` text NOT NULL,
  `foto` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `admin`
--

INSERT INTO `admin` (`id`, `nombre`, `fechaNacimiento`, `fechaIngreso`, `telefono`, `email`, `clave`, `foto`) VALUES
(1, 'Admin', '1999-06-24', '2024-07-10', 1190235432, 'logistruck77@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', './views/img/avatars/admin.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignarvehiculo`
--

CREATE TABLE `asignarvehiculo` (
  `idAVehiculo` int(11) NOT NULL,
  `patente` varchar(25) NOT NULL,
  `idEmpleado` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `asignarvehiculo`
--

INSERT INTO `asignarvehiculo` (`idAVehiculo`, `patente`, `idEmpleado`, `fecha`) VALUES
(1, '1re60t', 1, '2024-09-30 00:00:00'),
(2, '1re90s', 3, '2024-09-30 23:00:00'),
(4, '1re60p', 2, '2024-10-11 05:00:00'),
(5, '1re90p', 2, '2024-10-01 14:13:53'),
(6, '20m22e', 1, '2024-10-11 11:54:26'),
(7, '2th8re', 3, '2024-10-18 03:25:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignarviaje`
--

CREATE TABLE `asignarviaje` (
  `idAViaje` int(11) NOT NULL,
  `patente` varchar(25) NOT NULL,
  `idViaje` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `asignarviaje`
--

INSERT INTO `asignarviaje` (`idAViaje`, `patente`, `idViaje`, `fecha`) VALUES
(1, '1re60t', 1, '2024-10-11 01:32:35'),
(3, '1re90p', 2, '2024-10-19 15:03:46'),
(4, '1re90p', 4, '2024-10-20 02:54:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destinos`
--

CREATE TABLE `destinos` (
  `idDestino` int(30) NOT NULL,
  `nombre_destino` varchar(500) NOT NULL,
  `provincia` varchar(50) NOT NULL,
  `departamento` varchar(500) NOT NULL,
  `direccion` text NOT NULL,
  `latitud` double NOT NULL,
  `longitud` double NOT NULL,
  `km_recorridos` double NOT NULL,
  `tiempo_recorrido` double NOT NULL,
  `delete_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `destinos`
--

INSERT INTO `destinos` (`idDestino`, `nombre_destino`, `provincia`, `departamento`, `direccion`, `latitud`, `longitud`, `km_recorridos`, `tiempo_recorrido`, `delete_at`) VALUES
(1, 'Fabrica Tortuguitas', 'Buenos Aires', 'Malvinas Argentinas', '5162 LISANDRO DE LA TORRE 3002', -34.47422548501172, -58.77708992997166, 3.1, 263.6, '0000-00-00 00:00:00'),
(2, 'Fabrica Entre rios', 'Entre Rios', 'Colon', 'CIUDAD DE COLON', -32.226183253618046, -58.15623376683995, 291.2, 12275.6, '0000-00-00 00:00:00'),
(3, 'Fabrica tortuguitas 2', 'Buenos Aires', 'Malvinas Argentinas', '5162 LISANDRO DE LA TORRE 300', -34.473918373683745, -58.77733029726368, 3.1, 267.2, '0000-00-00 00:00:00'),
(4, 'Fabrica formosa', 'Formosa', 'Formosa', 'HUMBERTO F PALMENTER', -26.1516700713754, -58.144334497206, 1075.6, 45371.5, '0000-00-00 00:00:00'),
(5, 'Fabrica cordoba', 'Cordoba', 'General Roca', 'AV C PELLEGRINI', -34.82409532373765, -64.58739412432595, 611.9, 26648.8, '0000-00-00 00:00:00'),
(6, 'tortu', 'Buenos Aires', 'Malvinas Argentinas', '1359 COLOMBIA 89', -34.47731962452337, -58.75443894699195, 1.7, 202, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `idEmpleado` int(25) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `apellido` varchar(25) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `DNI` int(25) NOT NULL,
  `telefono` int(20) NOT NULL,
  `direccion` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `foto` text NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`idEmpleado`, `nombre`, `apellido`, `fechaNacimiento`, `DNI`, `telefono`, `direccion`, `email`, `foto`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 'Facundo', 'Sandoval', '2004-12-30', 47091648, 12345, 'Brasil 1970', 'facundosandoval376@gmail.com', './views/img/avatars/1.png', '2024-08-25 23:03:53', '2024-09-27 02:05:11', '0000-00-00 00:00:00'),
(2, 'Juan', 'Perez', '2021-12-31', 213, 234, '3dsf', 'juanperez@gmail.com', './views/img/system/usuario2.png', '2024-09-27 02:28:48', '2024-09-27 15:37:27', '0000-00-00 00:00:00'),
(3, 'Leandro', 'Lopez', '2019-12-01', 213, 231, 'fds', 'leanlopez@gmail.com', './views/img/system/usuario2.png', '2024-09-27 02:30:37', '2024-09-27 15:37:46', '0000-00-00 00:00:00'),
(4, 'Kiko', 'Gil', '2002-12-12', 213, 231, '21', 'kiko@gmail.com', './views/img/system/usuario2.png', '2024-09-27 02:37:10', '2024-09-27 15:38:13', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `informe`
--

CREATE TABLE `informe` (
  `idInforme` int(11) NOT NULL,
  `patente` varchar(30) NOT NULL,
  `idEmpleado` int(11) NOT NULL,
  `asunto` varchar(500) NOT NULL,
  `problema` varchar(500) NOT NULL,
  `descripcion` text NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `idProducto` int(20) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`idProducto`, `nombre`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 'litio', '2024-08-22 15:48:39', '2024-09-27 02:00:02', '0000-00-00 00:00:00'),
(2, 'diamante', '2024-08-22 15:48:51', '2024-10-06 15:52:42', '0000-00-00 00:00:00'),
(3, 'nitrogeno', '2024-08-22 18:48:41', '2024-08-22 18:48:41', '0000-00-00 00:00:00'),
(4, 'soja', '2024-08-23 00:46:43', '2024-08-23 00:46:43', '0000-00-00 00:00:00'),
(5, 'boro', '2024-08-27 23:32:59', '2024-10-20 21:57:57', '0000-00-00 00:00:00'),
(6, 'Helio', '2024-08-30 18:37:21', '2024-08-30 18:37:21', '0000-00-00 00:00:00'),
(7, 'Arroz', '2024-08-30 18:37:29', '2024-08-30 18:37:29', '0000-00-00 00:00:00'),
(8, 'madera', '2024-09-02 14:05:44', '2024-09-02 14:05:44', '0000-00-00 00:00:00'),
(9, 'hierro', '2024-09-02 14:05:52', '2024-09-02 14:05:52', '0000-00-00 00:00:00'),
(10, 'galio', '2024-09-02 14:06:09', '2024-09-02 14:06:09', '0000-00-00 00:00:00'),
(11, 'petrolio', '2024-09-02 14:06:53', '2024-09-02 16:32:05', '0000-00-00 00:00:00'),
(12, 'petroleo', '2024-09-02 16:31:43', '2024-09-02 16:31:43', '0000-00-00 00:00:00'),
(13, 'paja', '2024-09-10 01:54:39', '2024-09-12 15:38:44', '0000-00-00 00:00:00'),
(14, 'fosforo', '2024-09-10 01:55:04', '2024-09-10 01:55:04', '0000-00-00 00:00:00'),
(15, 'uranio', '2024-09-15 00:05:50', '2024-09-15 00:05:50', '0000-00-00 00:00:00'),
(16, 'sodio', '2024-09-15 14:37:06', '2024-10-20 02:22:42', '0000-00-00 00:00:00'),
(17, 'sd', '2024-10-01 03:10:06', '2024-10-20 02:22:52', '0000-00-00 00:00:00'),
(18, 'garbanzo', '2024-10-20 21:18:01', '2024-10-20 21:18:14', '0000-00-00 00:00:00'),
(19, 'bor', '2024-10-20 21:57:40', '2024-10-20 21:58:07', '2024-10-20 21:58:07'),
(20, 'ff', '2024-10-20 22:46:17', '2024-10-20 22:46:17', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `remitos`
--

CREATE TABLE `remitos` (
  `idRemito` int(11) NOT NULL,
  `idViaje` int(30) NOT NULL,
  `patente` varchar(30) NOT NULL,
  `idAcoplado` int(30) NOT NULL,
  `idProducto` int(30) NOT NULL,
  `indicadorAntes` int(30) NOT NULL,
  `indicadorDespues` int(30) NOT NULL,
  `CantAFacturar` int(30) NOT NULL,
  `pesoInicial` int(30) NOT NULL,
  `pesoFinal` int(30) NOT NULL,
  `CantEntPeso` int(30) NOT NULL,
  `FactorDeConversion` int(30) NOT NULL,
  `CantAFacturarBas` int(30) NOT NULL,
  `trailerSal` int(30) NOT NULL,
  `trailerReg` int(30) NOT NULL,
  `volEntregado` int(30) NOT NULL,
  `volResidual` int(30) NOT NULL,
  `cantEntregadaAFacturar` int(30) NOT NULL,
  `idEmpleado` int(30) NOT NULL,
  `firma` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipoacoplado`
--

CREATE TABLE `tipoacoplado` (
  `idTipo` int(30) NOT NULL,
  `nombre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipoacoplado`
--

INSERT INTO `tipoacoplado` (`idTipo`, `nombre`) VALUES
(1, 'Cisterna'),
(2, 'Acoplado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `email` varchar(30) NOT NULL,
  `clave` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`email`, `clave`) VALUES
('facundosandoval376@gmail.com', '419747ebab9e181eeaff48b09ccf3726'),
('juanperez@gmail.com', 'bbe8dd03ec8e57b60552d532e3d50c1f'),
('kiko@gmail.com', 'b3e1927794f0ed29d6104df2772e91f5'),
('leanlopez@gmail.com', 'c753a5d825cffc67924261c829d1bcbb');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE `vehiculos` (
  `patente` varchar(30) NOT NULL,
  `idAcoplado` int(30) NOT NULL,
  `marca` varchar(30) NOT NULL,
  `modelo` varchar(30) NOT NULL,
  `anio` int(4) NOT NULL,
  `vtv` date NOT NULL,
  `tara` int(30) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `vehiculos`
--

INSERT INTO `vehiculos` (`patente`, `idAcoplado`, `marca`, `modelo`, `anio`, `vtv`, `tara`, `create_at`, `update_at`, `delete_at`) VALUES
('1re60p', 4, 'Scania', 'z9', 2024, '2024-08-31', 92, '2024-08-23 01:28:49', '2024-09-29 00:59:52', '0000-00-00 00:00:00'),
('1re60t', 1, 'Renault', 'de', 2010, '2025-11-01', 232, '2024-09-19 23:51:36', '2024-09-28 23:14:59', '0000-00-00 00:00:00'),
('1re90p', 1, 'Mercedez', 'sd', 2023, '2025-12-01', 2, '2024-08-23 17:46:04', '2024-09-27 01:20:03', '0000-00-00 00:00:00'),
('1re90s', 3, 'Mercedez', 'le33', 2014, '2024-09-06', 5, '2024-08-23 02:25:06', '2024-09-01 13:29:15', '0000-00-00 00:00:00'),
('20m22e', 1, 'Mercedes', 'cup', 2022, '2034-01-03', 34, '2024-09-15 00:08:55', '2024-09-15 00:08:55', '0000-00-00 00:00:00'),
('2th8re', 1, 'Renault', 'r5', 2024, '2027-02-21', 90, '2024-09-28 23:14:19', '2024-09-28 23:14:19', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `viajes`
--

CREATE TABLE `viajes` (
  `idViaje` int(30) NOT NULL,
  `idDestino` int(30) NOT NULL,
  `idProducto` int(30) NOT NULL,
  `cantidadCarga` int(25) NOT NULL,
  `fechaSalida` datetime NOT NULL,
  `fechaLlegada` datetime NOT NULL,
  `estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `viajes`
--

INSERT INTO `viajes` (`idViaje`, `idDestino`, `idProducto`, `cantidadCarga`, `fechaSalida`, `fechaLlegada`, `estado`) VALUES
(1, 1, 3, 10, '2024-10-17 13:59:00', '2024-10-31 13:59:00', 'remito pendiente'),
(2, 2, 8, 50, '2024-11-01 00:00:00', '2024-11-02 11:55:00', 'asignado'),
(3, 5, 12, 123, '2024-11-01 00:29:00', '2024-11-04 00:29:00', 'disponible'),
(4, 6, 7, 200, '2024-11-09 00:37:00', '2024-11-10 00:37:00', 'asignado'),
(5, 7, 5, 231, '2024-11-08 02:51:00', '2024-11-09 02:51:00', 'disponible');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `acoplado`
--
ALTER TABLE `acoplado`
  ADD PRIMARY KEY (`idAcoplado`),
  ADD KEY `idTipo` (`idTipo`);

--
-- Indices de la tabla `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `asignarvehiculo`
--
ALTER TABLE `asignarvehiculo`
  ADD PRIMARY KEY (`idAVehiculo`),
  ADD KEY `patente` (`patente`),
  ADD KEY `idEmpleado` (`idEmpleado`);

--
-- Indices de la tabla `asignarviaje`
--
ALTER TABLE `asignarviaje`
  ADD PRIMARY KEY (`idAViaje`),
  ADD KEY `patente` (`patente`),
  ADD KEY `idViaje` (`idViaje`);

--
-- Indices de la tabla `destinos`
--
ALTER TABLE `destinos`
  ADD PRIMARY KEY (`idDestino`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`idEmpleado`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `informe`
--
ALTER TABLE `informe`
  ADD PRIMARY KEY (`idInforme`),
  ADD KEY `patente` (`patente`),
  ADD KEY `idEmpleado` (`idEmpleado`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`idProducto`);

--
-- Indices de la tabla `remitos`
--
ALTER TABLE `remitos`
  ADD PRIMARY KEY (`idRemito`),
  ADD KEY `idViaje` (`idViaje`),
  ADD KEY `patente` (`patente`),
  ADD KEY `idAcoplado` (`idAcoplado`),
  ADD KEY `producto` (`idProducto`),
  ADD KEY `idEmpleado` (`idEmpleado`);

--
-- Indices de la tabla `tipoacoplado`
--
ALTER TABLE `tipoacoplado`
  ADD PRIMARY KEY (`idTipo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`email`),
  ADD KEY `email` (`email`);

--
-- Indices de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD PRIMARY KEY (`patente`),
  ADD KEY `idAcoplado` (`idAcoplado`);

--
-- Indices de la tabla `viajes`
--
ALTER TABLE `viajes`
  ADD PRIMARY KEY (`idViaje`),
  ADD KEY `idDestino` (`idDestino`),
  ADD KEY `idProducto` (`idProducto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `acoplado`
--
ALTER TABLE `acoplado`
  MODIFY `idAcoplado` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `asignarvehiculo`
--
ALTER TABLE `asignarvehiculo`
  MODIFY `idAVehiculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `asignarviaje`
--
ALTER TABLE `asignarviaje`
  MODIFY `idAViaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `destinos`
--
ALTER TABLE `destinos`
  MODIFY `idDestino` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `idEmpleado` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `idProducto` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `remitos`
--
ALTER TABLE `remitos`
  MODIFY `idRemito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `informe`
--
ALTER TABLE `informe`
  MODIFY `idInforme` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `viajes`
--
ALTER TABLE `viajes`
  MODIFY `idViaje` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `acoplado`
--
ALTER TABLE `acoplado`
  ADD CONSTRAINT `acoplado_ibfk_2` FOREIGN KEY (`idTipo`) REFERENCES `tipoacoplado` (`idTipo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `asignarvehiculo`
--
ALTER TABLE `asignarvehiculo`
  ADD CONSTRAINT `asignarvehiculo_ibfk_1` FOREIGN KEY (`patente`) REFERENCES `vehiculos` (`patente`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `asignarvehiculo_ibfk_2` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`);

--
-- Filtros para la tabla `asignarviaje`
--
ALTER TABLE `asignarviaje`
  ADD CONSTRAINT `asignarviaje_ibfk_1` FOREIGN KEY (`patente`) REFERENCES `vehiculos` (`patente`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `asignarviaje_ibfk_2` FOREIGN KEY (`idViaje`) REFERENCES `viajes` (`idViaje`);

--
-- Filtros para la tabla `informe`
--
ALTER TABLE `informe`
  ADD CONSTRAINT `informe_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`),
  ADD CONSTRAINT `informe_ibfk_2` FOREIGN KEY (`patente`) REFERENCES `vehiculos` (`patente`);

--
-- Filtros para la tabla `remitos`
--
ALTER TABLE `remitos`
  ADD CONSTRAINT `remitos_ibfk_1` FOREIGN KEY (`idViaje`) REFERENCES `viajes` (`idViaje`),
  ADD CONSTRAINT `remitos_ibfk_2` FOREIGN KEY (`patente`) REFERENCES `vehiculos` (`patente`),
  ADD CONSTRAINT `remitos_ibfk_3` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`),
  ADD CONSTRAINT `remitos_ibfk_4` FOREIGN KEY (`idAcoplado`) REFERENCES `acoplado` (`idAcoplado`),
  ADD CONSTRAINT `remitos_ibfk_5` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`email`) REFERENCES `empleados` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD CONSTRAINT `vehiculos_ibfk_1` FOREIGN KEY (`idAcoplado`) REFERENCES `acoplado` (`idAcoplado`);

--
-- Filtros para la tabla `viajes`
--
ALTER TABLE `viajes`
  ADD CONSTRAINT `viajes_ibfk_5` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`),
  ADD CONSTRAINT `viajes_ibfk_6` FOREIGN KEY (`idDestino`) REFERENCES `destinos` (`idDestino`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
