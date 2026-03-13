<?php 
	// almacena el objeto de la variable de sesion
	$usuario=$_SESSION['logistruck']['usuario'];

	// verifica que header cargar
	switch ($usuario->panel) {
		case 'admin':
			// carga la vista
			$tpl = new MotorMaster('admin');
			break;
		
		case 'user':
			// carga la vista
			$tpl = new MotorMaster('user');

			break;
	}

	// variables a reemplazar en la vista
	$vars = [ 
		"PROYECT_SECTION" => "Panel",
		"NOM_ALERT" => $usuario->nombre,
		"EMAIL_ALERT" => $usuario->email,
	];
	
	// reemplazo de variables en la vista
	$tpl->setVars($vars);

	// imprime la vista
	$tpl->print();

 ?>