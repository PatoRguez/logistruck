<?php 
	// almacena el objeto de la variable de sesion
	$usuario=$_SESSION['logistruck']['usuario'];

	// carga la vista
	$tpl = new MotorMaster('estadisticasUser');

	// variables a reemplazar en la vista
	$vars = [
		"PROYECT_SECTION" => 'Estadisticas',
		"NOM_ALERT" => $usuario->nombre,
		"EMAIL_ALERT" => $usuario->email,
	]; 
	
	// cal_days_in_month(CAL_GREGORIAN, 12, date('Y'));

	// reemplazo de variables en la vista
	$tpl->setVars($vars);

	// imprime la vista
	$tpl->print($tpl);
 ?>