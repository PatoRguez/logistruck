<?php 

	if ($_SERVER['HTTP_REFERER']==null) {
		header("Location: ./panel");
	}

	// almacena el objeto de la variable de sesion
	$usuario=$_SESSION['logistruck']['usuario'];

	// carga la vista
	$tpl = new MotorMaster('informe');
	
	// variables a reemplazar en la vista
	$vars = [
		"PROYECT_SECTION" => 'Ver Informe',
		"NOM_ALERT" => $usuario->nombre,
		"EMAIL_ALERT" => $usuario->email,
		"BTN_VOLVER_URL" => $_SERVER['HTTP_REFERER'],
	];
	
	// reemplazo de variables en la vista
	$tpl->setVars($vars);

	// imprime la vista
	$tpl->print($tpl);
 ?>