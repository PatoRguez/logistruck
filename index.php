<?php 
	// Router con auto carga de controladores 
	
	// se incluyen las variables de entorno
	include_once 'env.php';

	// incluye la clase User
	include_once 'models/User.php';

	// se inicia o se continua con la sesion
	session_start();

	/*< se incluyen las librerias para el envio de correo electrónico*/
	include 'libs/Mailer/src/PHPMailer.php';
	include 'libs/Mailer/src/SMTP.php';
	include 'libs/Mailer/src/Exception.php';

	// incluimos el motor de plantillas
	include_once 'libs/motorMaster/MotorMaster.php';
	
	// por defecto seccion es el login
	$seccion = "login";

	// si existe slug por GET
	if(strlen($_GET['slug'])>0 ){
		// se reemplaza seccion por el valor de slug	
		$seccion = $_GET['slug'];
	}

	// si no existe el archivo del controlador
	if(!file_exists('controllers/'.$seccion.'Controller.php')){
		// seccion se carga con el controlador de error 404
		$seccion = "error404";
	}

	// si esta logueado el admin controladores permitidos
	$controller_admin_connected = ["panel", "viajes", "empleado", "estat", "acoplado", "vehiculo", "producto","MViajes","MVehiculos","destinos","assignviaje","assignvehiculo"];
	
	//si esta logueado el usuario controladores permitidos
	$controller_user_connected = ["panel", "infoViaje", "viajesE", "vehiculoE", "estatE"];

	// no esta logueado ni el admin y usuario controladores permitidos
	$controller_anonymous = ["login","pass","verifycorreo"];

	if (isset($_SESSION['codigo-veri']) && $seccion=="login") {
		session_unset();
	}

	// Si la sesion esta iniciada
	if(!empty($_SESSION['logistruck']['usuario'])){
		// var_dump($_SESSION);
		// si la sesion es del admin
		if ($_SESSION['logistruck']['usuario']->panel == "admin") {
			// los controladores de anonimo no estan permitidos
			$controller_test = $controller_anonymous;
			foreach ($controller_user_connected as $item) {
				array_push($controller_test, $item);
			}
		}
		// si la sesion es del empleado
		elseif ($_SESSION['logistruck']['usuario']->panel == "user") {
			// los controladores de anonimo no estan permitidos
			$controller_test = $controller_anonymous;
			foreach ($controller_admin_connected as $item) {
				array_push($controller_test, $item);
			}	
		}

		// por defecto se lleva a panel
		$default_seccion = "panel";	
	}else{ // sesión no iniciada
		// los controladores de conectado no estan permitidos
		$controller_test = $controller_admin_connected;
		foreach ($controller_user_connected as $ele) {
			array_push($controller_test, $ele);
		}
		// por defecto se lleva a loginView
		$default_seccion = "login";
	}

	// Se analiza cuales controladores estan permitidos
	foreach ($controller_test as $key => $value) {
		// si coincide con un controlador que no deberia solicitar 
	 	if($value == $seccion){
	 		// se manda al controlador por defecto
	 		$seccion = $default_seccion;
	 		break;
	 	}
	}

	// carga del controlador
	include 'controllers/'.$seccion.'Controller.php';
 ?>