<?php
	// almacena el objeto de la variable de sesion
	$usuario=$_SESSION['logistruck']['usuario'];

	// carga la vista
	$tpl = new MotorMaster('error404');

	// verifica que header cargar
	switch ($usuario->panel) {
		case 'admin':
			// carga el header del admin
			$tplHeader=file_get_contents('./views/headerAdmin.html');
			break;
		
		case 'user':
			// carga el header del empleado
			$tplHeader=file_get_contents('./views/headerUser.html');
			break;
	}
	
	// variables a reemplazar en la vista
	$vars = [
		"PROYECT_SECTION" => "Page not found",
		"HEADER" => $tplHeader,
		"NOM_ALERT" => $usuario->nombre,
		"EMAIL_ALERT" => $usuario->email,
	];
	
	// reemplazo de variables en la vista
	$tpl->setVars($vars);
	
	// imprime la vista
	$tpl->print($tpl);

 ?>