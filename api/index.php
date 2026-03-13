<?php
	// incluye las variables de entorno
	include_once '../env.php';

	/*< se incluyen las librerias para el envio de correo electrónico*/
	include '../libs/Mailer/src/PHPMailer.php';
	include '../libs/Mailer/src/SMTP.php';
	include '../libs/Mailer/src/Exception.php';

	header("Content-Type: application/json;");

	/*< Captura el método por el cual se llamo a la API */
	$request_method = $_SERVER["REQUEST_METHOD"];

	/*< Quitamos /api/ de la url */
	$url=str_replace('/tesis/api/', '', $_SERVER['REQUEST_URI']);

	/*< Separa lo que hay en la url (modelo/metodo/)*/
	$url_result=explode('/', $url);

	// si no definio la variable modelo
	if (!isset($url_result[0])) {
		echo json_encode(["errno" => 404, "error" => "No se definio el modelo"]);
		exit();
	}

	// si la variable modelo esta vacia
	if ($url_result[0] == "") {
		echo json_encode(["errno" => 405, "error" => "Faltóa el valor del modelo"]);
		exit();
	}

	// captura el modelo 
	$model= ucfirst(strtolower($url_result[0]));

	// si no existe el archivo del modelo
	if (!file_exists('../models/'.$model.'.php')) {
		echo json_encode(["errno" => 406, "error" => "No existe el modelo ".$model]);
		exit();	
	}

	// incluye la clase segun el modelo
	include_once '../models/'.$model.'.php';

	// inicia o continua la sesión
	session_start();
	
	// crea el objeto 
	$object=new $model();

	// si no definio la variable metodo
	if (!isset($url_result[1])) {
		echo json_encode(["errno" => 404, "error" => "No se definio el metodo de la clase ".$model]);
		exit();
	}

	// si la variable metodo esta vacia
	if ($url_result[1] == "") {
		echo json_encode(["errno" => 405, "error" => "Falta el valor del metodo"]);
		exit();
	}

	// carga el metodo
	$method=$url_result[1];

	// si no existe el metodo en la clase
	if (!method_exists($object, $method)) {
		echo json_encode(["errno" => 406, "error" => "No existe el metodo -".$method."- en la clase ".$model ]);
		exit();
	}

	// captura los datos desde el vector de method correspondiente
	switch ($request_method) {
		case 'DELETE':
		case 'GET':
				$params = $_GET;
			break;
		
		case 'POST':
				$params = $_POST;
			break;
		case 'PUT':
				/*< las variables que se envian por método PUT viajan en el body */
				/*< se captura la petición y se pasan las variables al vector $_PUT */
				parse_str(file_get_contents("php://input"),$_PUT);
				$params = $_PUT;
			break;
	}

	/*< ejecuta el método con los parámetros correspondientes*/
	$result = $object->$method($params);

	/*< imprime el JSON en la página*/
	echo json_encode($result);
 ?>