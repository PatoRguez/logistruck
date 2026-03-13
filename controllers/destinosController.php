<?php 	
	// incluye la clase Vehiculo
	include_once 'models/Vehiculo.php';

	// almacena el objeto de la variable de sesion
	$usuario=$_SESSION['logistruck']['usuario'];
	
	// carga la vista
	$tpl = new MotorMaster('destinos');

	// variables a reemplazar en la vista
	$vars = [
		"PROYECT_SECTION" => "Destinos",
		"NOM_ALERT" => $usuario->nombre,
		"EMAIL_ALERT" => $usuario->email,
	];
	
	// crea el objeto Vehiculo
	$vehiculo = new Vehiculo();

	$tpl->setVars($vars);

	$tpl->print();

 ?>