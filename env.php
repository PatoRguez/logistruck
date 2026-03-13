<?php

	/**
	 * 
	 * Lógica de cambio de modo de aplicación
	 * 
	 * */

	define("DEBUG",0);
	define("RELEASE",1);

	/*< Cambiar a RELEASE cuando la aplicación este lista para usar*/
	define('MODE', DEBUG);


	/*< Variables de entorno para el control de la app*/
	$_ENV["PROYECT_NAME"] = "LogisTruck";
	$_ENV["PROYECT_URL"] = "";
	$_ENV["PROYECT_DESCRIPTION"] = "Web dedicada a la automatizacion de tareas administrativas para empresas logisticas";
	$_ENV["PROYECT_AUTHOR"] = "Alumnos 7mo 3ra";
	$_ENV["PROYECT_EMAIL_AUTHOR"] = "logistruck77@gmail.com";
	$_ENV["PROYECT_KEYWORDS"] = "tareas administrativas";


	$_ENV["PROYECT_MODE"] = MODE ? "" : "?cache=".date('YmdHis').mt_rand(0, 1000);


	//==== Variables de entorno para conectar a la DB desarrollo
	$_ENV["DB_HOST"] = "localhost";
	$_ENV["DB_USER"] = "root";
	$_ENV["DB_PASS"] = "";
	$_ENV["DB_NAME"] = "logistica";
	$_ENV["DB_PORT"] = 3306;


	/*< Variables de entorno para el envio de correo electrónico*/

	$_ENV['MAILER_REMITENTE']= 'logistruck77@gmail.com'; // <===
	$_ENV['MAILER_NOMBRE']= 'LogisTruck'; // <===
	$_ENV['MAILER_PASSWORD']= 'fwam yvjm tgpv moph'; // <=== token

	$_ENV['MAILER_HOST']= 'smtp.gmail.com';
	$_ENV['MAILER_PORT']= '587';
	$_ENV['MAILER_SMTP_AUTH']= true;
	$_ENV['MAILER_SMTP_SECURE']= 'tls';
 ?>