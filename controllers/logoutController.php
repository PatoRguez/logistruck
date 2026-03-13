<?php 
	// almacena el objeto de la variable de sesion
	$usuario=$_SESSION['logistruck']['usuario'];

	// cierra la sesion
	$usuario->logout();

	// redireccion a login
	header("Location: ./");
 ?>