<?php 
	// almacena el objeto de la variable de sesion
	$usuario=$_SESSION['logistruck']['usuario'];

	// carga la vista
	$tpl = new MotorMaster('empleado');

	// variables a reemplazar en la vista
	$vars = [
		"PROYECT_SECTION" => "Empleados",
		"NOM_ALERT" => $usuario->nombre,
		"EMAIL_ALERT" => $usuario->email,
	];
	
	// reemplazo de variables en la vista
	$tpl->setVars($vars);

	// imprime la vista
	$tpl->print($tpl);
 ?>