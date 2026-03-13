<?php

	// carga la vista
	$tpl = new MotorMaster('login');

	// variable a reemplazar
	$vars=['PROYECT_SECTION' => "Login"];

	// // si envia el formulario
	// if (isset($_POST['btn-login'])) {

	// 	// Crea el objeto User con el email y clave 
	// 	$usuario=new User($_POST['email'], $_POST['Clave']);

	// 	$response=$usuario->login();

	// 	// si el logueo es valido
	// 	if ($response['errno'] == 200) {

	// 		// guarda el objeto en la variable de sesion
	// 		$_SESSION['logistruck']['usuario']=$usuario;
			
	// 		// lo redirecciona al panel admin
	// 		header("Location: panel");
	// 	}

	// 	// en caso de que el logueo no se valide muestre un mensaje
	// 	$vars=['MSG_ERROR' => "<div class='alert-login'>
 //                <span>".$response['error']."</span>
 //            </div>"];
	// }

	// reemplaza las variables de la vista
	$tpl->setVars($vars);

	// imprime la vista
	$tpl->print($tpl);

 ?>