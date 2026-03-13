<?php 
	// almacena el objeto de la variable de sesion
	$usuario=$_SESSION['logistruck']['usuario'];

	// carga la vista
	$tpl = new MotorMaster('perfil');

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

	// obtiene los datos del usuario
	$response=$usuario->getUser();
	
	// variables a reemplazar en la vista
	$vars = [
		"PROYECT_SECTION" => 'Perfil',
		"HEADER" => $tplHeader,
		"NOM_ALERT" => $usuario->nombre,
		"EMAIL_ALERT" => $usuario->email,
		"NOMBRE_USER" => $usuario->nombre, 
		"EMAIL_USER" => $usuario->email, 
		"TEL_USER" => $response[0]['telefono'], 
		"FECN_USER" => $response[0]['fechaNacimiento'], 
		"FECI_USER" => $response[0]['fechaIngreso'], 
		"FOTO_USER" => $response[0]['foto'],
		"PASS_USER" => $usuario->password, 
	];
	// reemplazo de variables en la vista
	$tpl->setVars($vars);

	// imprime la vista
	$tpl->print($tpl);
	// var_dump($_SESSION);
 ?>