<?php 

	// carga la vista
	$tpl = new MotorMaster('passRecovery');

	// variables a reemplazar en la vista
	$vars = [
		"PROYECT_SECTION" => 'Recuperar Contraseña',
	];

	// reemplazo de variables en la vista
	$tpl->setVars($vars);

	// imprime la vista
	$tpl->print($tpl);
	
 ?>
