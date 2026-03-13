<?php 
	// almacena el objeto de la variable de sesion
	$usuario=$_SESSION['logistruck']['usuario'];

	// carga la vista
	$tpl = new MotorMaster('menuVe');
	
	// variables a reemplazar en la vista
	$vars = [
		"PROYECT_SECTION" => "Vehiculos",
		"NOM_ALERT" => $usuario->nombre,
		"EMAIL_ALERT" => $usuario->email,
	];
	
	// reemplazo de variables en la vista
	$tpl->setVars($vars,$tpl);

	// imprime la vista
	$tpl->print($tpl);
 ?>