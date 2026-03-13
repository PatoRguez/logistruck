<?php
	// incluye la Clase DBAbstract 
	include_once 'DBAbstract.php';

	/**
	 * 
	 *	Clase para Trabajar con la tabla Empleados
	 *
	 */
	class Empleado extends DBAbstract{
		
		/**
		 * 
		 * Crea el objeto
		 * 
		 * */
		function __construct(){
			parent::__construct();
		}

		/**
		 * 
		 * Retorna el ultimo id de la tabla 'empleados'
		 * @return int ultimo id de la empleados
		 * 
		 * */
		function getEmpleadoLastId(){
			$sql="SELECT MAX(idEmpleado) as lastId FROM `empleados`";

			$result=$this->query($sql);

			if ($result[0]['lastId'] == null) {
				return 0;
			}

			return $result[0]['lastId'];
		}

		/**
		 * 
		 * Retorna los empleados de la tabla 'empleados'
		 * @return array arreglo de la tabla empleados
		 * 
		 * */
		function getEmpleados(){
			$sql="SELECT idEmpleado, nombre, apellido, date_format(fechaNacimiento,'%d / %m / %Y') as fechaNacimiento, DNI, telefono, direccion, email, date_format(create_at,'%d / %m / %Y') AS fechaIngreso, foto FROM `empleados` WHERE delete_at = '0000-00-00 00:00:00'";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Retorna al empleado buscado por el email
		 * @return array arreglo de la tabla empleado
		 * @param email string email del empleado
		 * 
		 * */
		function getEmpleadoByEmail($params){
			$email = $params['email'];

			$sql="SELECT * FROM `empleados` WHERE email = '$email'";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Retorna al empleado buscado por el id
		 * @return array arreglo de la tabla empleado
		 * @param id int id del empleado
		 * 
		 * */
		function getEmpleadoById($params){
			$id = $params['id'];

			$sql="SELECT * FROM `empleados` WHERE idEmpleado = '$id'";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Agrega un nuevo empleado a la DB
		 * @return array arreglo de errores
		 * @param $params array recibe la variable $_POST
		 * 
		 * */
		function insert($params){

			// si la peticion HTTP no es POST
			if ($_SERVER["REQUEST_METHOD"]!="POST") {
				echo json_encode([
					'errno' => 407,
					'error' => "error Peticion incorrecta!!."
				]);
				exit();
			}
			
			// carga los parametros de POST en variables
			$nombre = $params['nombre'];// string nombre del empleado
			$apellido = $params['apellido'];// apellido del empleado
			$fechaN = $params['fechaN'];// fecha de nacimiento del empleado
			$dni = $params['dni'];// dni del empleaod
			$telefono = $params['telefono'];// telefono del empleado
			$direccion = $params['direccion'];// direccion del empleado
			$email = $params['email'];// email del empleado
			$img = $_FILES['foto'];// contenido de la foto

			// busca el email en la tabla
			$result = $this->getEmpleadoByEmail([ 'email' => $email]); 

			// si el empleado no existe en la tabla
			if ($result == false) {

				// ruta de la foto por defecto
				$URLfoto='./views/img/system/usuario2.png';

				// si agrego una foto el ususario
				if (!empty($img['tmp_name'])) {
					// si no existe el directorio 'avatars'
					if (!is_dir("../views/img/avatars")) {
						// crea el directorio 
						mkdir("../views/img/avatars", 0777);
					}

					// divido el nombre del archivo en 2(nombre y extension)
					$renameFoto=explode('.', $img['name']);

					// obtiene el ultimo id de la tabla empleados
					$lastId=$this->getEmpleadoLastId()+1;

					// ruta de la foto agregada por el usuario
					$URLfoto="../views/img/avatars/".$lastId.".".$renameFoto[1];

					// guarda la foto en la carpeta avatars
					move_uploaded_file($img['tmp_name'], $URLfoto);

					// borra el primer caracter(porque sino no encuentra la imagen a la hora de mostrar la tabla)
					$URLfoto=substr($URLfoto, 1);
				}

				$sql="INSERT INTO `empleados` (`nombre`, `apellido`, `fechaNacimiento`,`DNI`, `telefono`, `direccion`, `email`,`foto`,`delete_at`) VALUES ('$nombre','$apellido','$fechaN','$dni', '$telefono', '$direccion', '$email', '$URLfoto', '0000-00-00 00:00:00')";

				$result=$this->query($sql);

				$vector_error["error"]="Se guardo el empleado exitosamente";
				$vector_error["errno"]=200;
				$vector_error['email']=$email;
				$vector_error['empleado']=$nombre.' '.$apellido;

				return $vector_error;					
			}

			// si el empleado fue dado de baja y quiere agregarlo de devuelta
			if ($result[0]['delete_at']!='0000-00-00 00:00:00') {
				
				$vector_error['error']="Empleado eliminado anteriormente";
				$vector_error['errno']=201;
				$vector_error['ubi']=$result[0]['idEmpleado'];

				return $vector_error;
			}
			
			// si existe el empleado
			$vector_error["error"] = "Email en uso";
			$vector_error["errno"] = 400;

			return $vector_error;
		}

		/**
		 * 
		 * modifica el empleado
		 * @return array arreglo de errores
		 * @param $id int id del empleado
		 * @param $nombre string nombre del empleado
		 * @param $apellido string apellido del empleado
		 * @param $fechaN date fecha de nacimiento del empleado
		 * @param $dni int dni del empleaod
		 * @param $telefono int telefono del empleado
		 * @param $direccion string direccion del empleado
		 * @param $email string email del empleado
		 * @param $img array contenido de la foto
		 * 
		 * */
		function update($params){
			// si la peticion HTTP no es POST
			if ($_SERVER["REQUEST_METHOD"]!="POST") {
				echo json_encode([
					'errno' => 407,
					'error' => "error Peticion incorrecta!!."
				]);
				exit();
			}

			$nombre = $params['nombre'];
			$apellido = $params['apellido'];
			$fechaN = $params['fechaN'];
			$dni = $params['dni'];
			$telefono = $params['telefono'];
			$direccion = $params['direccion'];
			$email = $params['email'];
			$img = $_FILES['foto'];
			$id = $params['id'];

			$res=$this->getEmpleadoById(['id' => $id]);

			// si quiere modificar el email
			if ($res[0]['email'] != $email) {
				// busca si el email existe
				$result=$this->getEmpleadoByEmail([ 'email' => $email]);
			}	
			// si quiere modificar lo demas menos el email
			else{
				$result=false;
			}
			

			// si se puede modificar
			if ($result == false) {	

				$ssql=" ";
				// si agrego una foto el ususario
				if (!empty($img['tmp_name'])) {
					// si no existe el directorio 'avatars'
					if (!is_dir('../views/img/avatars')) {
						// crea el directorio 
						mkdir('../views/img/avatars', 0777);
					}

					// divido el nombre del archivo en 2(nombre y extension)
					$renameFoto=explode('.', $img['name']);

					// obtiene el ultimo id de la tabla empleados
					$lastId=$id;

					// ruta de la foto agregada por el usuario
					$URLfoto='../views/img/avatars/'.$lastId.'.'.$renameFoto[1];

					// guarda la foto en la carpeta avatars
					move_uploaded_file($img['tmp_name'], $URLfoto);

					// borra el primer caracter(porque sino no encuentra la imagen a la hora de mostrar la tabla)
					$URLfoto=substr($URLfoto, 1);

					$ssql=",`foto`='$URLfoto'";
				}

				$sql="UPDATE empleados SET `nombre`='$nombre', `apellido`='$apellido', `fechaNacimiento`='$fechaN', `DNI`='$dni',`telefono`='$telefono', `direccion`='$direccion', `email`='$email'".$ssql." WHERE empleados.idEmpleado='$id'";

				$result = $this->query($sql); 
				
				$vector_error["error"] = "Se actualizo los datos con exito";
				$vector_error["errno"] = 200;

				return $vector_error;	
			}

			// si ya existe
			$vector_error["error"] = "Email en uso";
			$vector_error["errno"] = 400;

			return $vector_error;
		}

		/**
		 * 
		 * Da de baja a el empleado
		 * @return array arreglo de errores
		 * @param $id int id del empleado
		 * 
		 * */
		function unsubscribe($params){
			$id = $params['id'];

			$sql="UPDATE empleados SET delete_at=CURRENT_TIMESTAMP WHERE idEmpleado = '$id'";

			$result = $this->query($sql); 
			
			$vector_error["error"] = "Se Elimino con exito";
			$vector_error["errno"] = 200;

			return $vector_error;
		}

		/**
		 * 
		 * Restaura el empleado dado de baja
		 * @return array arreglo de errores
		 * @param $id int id del empleado
		 * 
		 * */
		function restore($params){
			$id = $params['id'];

			$sql="UPDATE empleados SET delete_at='0000-00-00 00:00:00' WHERE idEmpleado='$id'";

			$result = $this->query($sql);

			$vector_error["error"] = "Se restauro el Empleado exitosamente";
			$vector_error["errno"] = 200;

			return $vector_error;
		}
	}
 ?>