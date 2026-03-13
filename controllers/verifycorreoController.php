<?php 
	
	// si no existe el codigo de verificacion
	if (!isset($_SESSION['codigo-veri'])) {
		header("Location: ./pass");// redireccion a recuperar pass
	}

	// cargo la nueva vista
	$tpl = new MotorMaster('verifyEmail');
	
	// variables a reemplazar en la vista
	$vars = [
		'PROYECT_SECTION' => 'Verificar Correo',
		'CORREO' => $_SESSION['email'],
	];

	// reemplazo de variables en la vista
	$tpl->setVars($vars);
			
	// imprime la vista
	$tpl->print($tpl);
	
 ?>