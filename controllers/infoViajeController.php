<?php 

	if ($_SERVER['HTTP_REFERER']==null) {
		header("Location: ./panel");
	}

	if ($_SERVER['HTTP_REFERER']=="http://localhost/tesis/panel" || $_SERVER['HTTP_REFERER']=="http://localhost/tesis/viajesE") {
		$_SESSION['urlRegreso'] = $_SERVER['HTTP_REFERER'];
	}

	// almacena el objeto de la variable de sesion
	$usuario=$_SESSION['logistruck']['usuario'];

	// carga la vista
	$tpl = new MotorMaster('infoViaje');
	
	// variables a reemplazar en la vista
	$vars = [
		"PROYECT_SECTION" => 'Info Viaje',
		"NOM_ALERT" => $usuario->nombre,
		"EMAIL_ALERT" => $usuario->email,
		"BTN_VOLVER_URL" => $_SESSION['urlRegreso'],
	];
	
	// reemplazo de variables en la vista
	$tpl->setVars($vars);

	// imprime la vista
	$tpl->print($tpl);
 ?>