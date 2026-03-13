<?php 
	// incluye la clase para conectar con la DB
	include_once 'DBAbstract.php';
		
	// incluye la clase para el envio de correo electronico
	include_once 'Mailer.php';

	/**
	 * 
	 *	Clase para trabajar con los usuarios del sistema	
	 *
	 */
	class User extends DBAbstract{	


		/**
		 * 
		 * Crea el objeto
		 * @param $email string email del usuario
		 * @param $password string contraseña del usuario
		 *
		 * */
		function __construct(){
			parent::__construct();
		}

		/**
		 * 
		 * Auto carga de los atributos del objeto
		 * @param $params array parametros
		 *
		 * */
		function setAtributtes($params){
			$this->email = $params['email'];
			$this->password = $params['pass'];
		}

		/**
		 * 
		 * Registra el empleado en el tabla usuarios
		 * @return array arreglo de errores
		 *
		 * */
		function register($params){
			// si la peticion HTTP no es POST
			if ($_SERVER["REQUEST_METHOD"]!="POST") {
				echo json_encode([
					'errno' => 407,
					'error' => "error Peticion incorrecta!!."
				]);
				exit();
			}

			// genera contraseña random
			$params['pass']=$this->generatePassword([ 'length' => mt_rand(5,7)]);

			// carga los atributos
			$this->setAtributtes($params);

			$email=$this->email;
			$password=md5($this->password);

			// carga el usuario en la tabla
			$sql="INSERT INTO usuarios (email,clave) VALUES ('$email','$password')";

			// ejecuta la consulta
			$result=$this->query($sql);

			// crea el objeto Mailer
			$objetoMailer = new Mailer();

			// informacion del corre
			$motivo="Bienevenido a Logistruck";

			// variables a reemplazar de la plantilla
			$vars=[
				'EMAIL' => $this->email,
				'PASS' => $this->password,
				'NOMBRE' => $params['empleado']
			];

			// carga la plantilla del correo
			$contenido=file_get_contents('../views/registerCorreo.html');

			foreach ($vars as $key => $value) {
				$contenido = str_replace("{{".$key."}}", $value, $contenido);
			}

			// vector asociativo para el metodo send de la clase Mailer
			$email_form=[
				'destinatario' => $this->email,
				'motivo' => $motivo,
				'contenido' => $contenido
			];

			// envia el correo electonico
			$objetoMailer->send($email_form);

			$vector_error['error']="Empleado agregado existosamente";
			$vector_error['errno']=200;

			return $vector_error;
		}

		/**
		 * 
		 * Busca si la contraseña ya existe
		 * @return array arreglo de errores
		 * @param $pass string contraseña á buscar
		 *
		 * */
		function passExist($pass){
			$password=md5($pass);

			$sql="SELECT * FROM usuarios WHERE clave='$password'";

			$result=$this->query($sql);

			if (count($result) == 0) {
				return false;
			}

			return $result[0];
		}

		/**
		 * 
		 * Valida el email y la contraseña
		 * @return array arreglo de errores
		 *
		 * */
		function login($params){
			// carga los atributos
			$this->setAtributtes($params);

			$email=$this->email;
			$password=md5($this->password);

			// busca a el empleado
			$sql="SELECT empleados.idEmpleado,usuarios.email,empleados.nombre,empleados.apellido FROM `empleados` JOIN usuarios ON empleados.email=usuarios.email WHERE (usuarios.email='$email' AND usuarios.clave='$password') AND empleados.delete_at='0000-00-00 00:00:00'";

			$result=$this->query($sql);

			// si no es el empleado
			if (count($result) == 0) {

				// busca si el admin
				$sql="SELECT * FROM admin WHERE email='".$email."' AND clave='".$password."' ";

				$result=$this->query($sql);

				// Si el logueado es el admin
				if (count($result)>0) {
					// si no se equivoco
					$vector_error['errno']=200;
					$vector_error['error']="Bienvenido ADMIN";
					$vector_error['panel']="admin";

					$this->panel="admin";
					$this->nombre="Admin";

					// guarda el objeto en la variable de sesion
					$_SESSION['logistruck']['usuario']=$this;

					return $vector_error;
				}
			}

			// si el logueado es un empleado
			if (count($result)>0) {
				$vector_error['errno']=200;
				$vector_error['error']="Bienvenido ".$result[0]['nombre']." ".$result[0]['apellido'];
				$vector_error['panel']="user";

				$this->panel="user";
				$this->nombre=$result[0]['nombre']." ".$result[0]['apellido'];
				$this->id=$result[0]['idEmpleado'];

				// guarda el objeto en la variable de sesion
				$_SESSION['logistruck']['usuario']=$this;

				return $vector_error;
			}

			// si se equivoco
			$vector_error['error']="Email y/o Contraseña invalido/s";
			$vector_error['errno']=400;

			return $vector_error;
		}

		/**
		 * 
		 * Modifica los datos del admin
		 * @return array arreglo de errores
		 *
		 * */
		function update($params){
			$nombre = $params['nombre'];
			$fechaN = $params['fechaN'];
			$telefono = $params['telefono'];
			$email = $params['email'];
			$password = $params['pass'];
			$foto = $_FILES['foto'];

			// si el usuario es el admin
			if ($_SESSION['logistruck']['usuario']->panel=="admin") {
					
				// si modifica la contraseña
				if ($password!=$_SESSION['logistruck']['usuario']->password) {
					// la guarda en la variable de session
					$_SESSION['logistruck']['usuario']->password = $password; 
				}

				// ruta de la foto por defecto
				$URLfoto =$this->getUser()[0]['foto'];

				// si agrego una foto el ususario
				if (!empty($foto['tmp_name'])) {
					// si no existe el directorio 'avatars'
					if (!is_dir("../views/img/avatars")) {
						// crea el directorio 
						mkdir("../views/img/avatars", 0777);
					}

					// divido el nombre del archivo en 2(nombre y extension)
					$renameFoto=explode('.', $foto['name']);

					// ruta de la foto agregada por el usuario
					$URLfoto="../views/img/avatars/admin.".$renameFoto[1];

					// guarda la foto en la carpeta avatars
					move_uploaded_file($foto['tmp_name'], $URLfoto);

					// borra el primer caracter(porque sino no encuentra la imagen a la hora de mostrar la tabla)
					$URLfoto=substr($URLfoto, 1);
				}

				// consulta
				$sql = "UPDATE admin SET nombre='$nombre',fechaNacimiento='$fechaN',telefono='$telefono',email='$email',clave='".md5($password)."', foto='$URLfoto' ";

				$result = $this->query($sql);

				$vector_error['errno']=200;
				$vector_error['error']="Se actualizaron los datos correctamente";

				return $vector_error;
			}		

			$vector_error['errno']=400;
			$vector_error['error']="Error Metodo Restringuido";

			return $foto;
		}

		/**
		 * 
		 * Verifica la contraseña del admin o usuario
		 * @return array arreglo de errores
		 *
		 * */
		function verifyPass($params){
			// si no esta iniciada ninguna sesion
			if (!isset($_SESSION['logistruck']['usuario'])) {
				return [ 
					'error' => 'No se inicio sesion',
					'errno' => '404'
				];
			}

			// carga la contraseña y la encripta
			$password = md5($params['pass']);
			$panel = $_SESSION['logistruck']['usuario']->panel;

			switch ($panel) {
				case 'admin':
					$sql = "SELECT * FROM admin WHERE clave='$password'";
					
					$result = $this->query($sql);

					if (count($result)>0) {
						$vector_error['errno']=200;
						$vector_error['error']="Contraseña correcta";
						
						return $vector_error;
					}	

					$vector_error['errno']=400;
					$vector_error['error']="Contraseña incorrecta";
					
					return $vector_error;		
					break;

				case 'user':
					$email = $_SESSION['logistruck']['usuario']->email;

					$sql="SELECT empleados.idEmpleado,usuarios.email,empleados.nombre,empleados.apellido FROM `empleados` JOIN usuarios ON empleados.email=usuarios.email WHERE (usuarios.email='$email' AND usuarios.clave='$password') AND empleados.delete_at='0000-00-00 00:00:00'";
					$result = $this->query($sql);

					if (count($result)>0) {
						$vector_error['errno']=200;
						$vector_error['error']="Contraseña correcta";
						
						return $vector_error;
					}	

					$vector_error['errno']=400;
					$vector_error['error']="Contraseña incorrecta";
					
					return $vector_error;	
					break;
				
				default:
					$vector_error['errno']=450;
					$vector_error['error']="No existe otro usuario";
					
					return $vector_error;	
					break;
			}
		}

		/**
		 * 
		 * Obtiene los datos del usuario logueado admin | user
		 * @return array arreglo con los datos del usuario
		 *
		 * */
		function getUser(){

			// si no esta iniciada ninguna sesion
			if (!isset($_SESSION['logistruck']['usuario'])) {
				return [ 
					'error' => 'No se inicio sesion',
					'errno' => '404'
				];
			}

			$panel = $_SESSION['logistruck']['usuario']->panel;

			switch ($panel) {
				case 'admin':
					$sql="SELECT * FROM admin";

					$result=$this->query($sql);

					return $result;
					break;
				
				case 'user':
					$this->email = $_SESSION['logistruck']['usuario']->email;

					$sql="SELECT idEmpleado, nombre, apellido, fechaNacimiento, DNI, telefono, direccion, email, CONVERT(create_at, date) AS fechaIngreso, foto FROM empleados WHERE email= '".$this->email."'";

					$result=$this->query($sql);

					return $result;

					break;
			}
		}

		/**
		 * 
		 * Cierra la sesión del usuario
		 * 
		 * */
		function logout(){
			session_unset();
			session_destroy();
		}

		/**
		 * 
		 * Genera una contraseña
		 * @return string contraseña generada
		 * @param $length int tamaño de la contrase a generar 
		 *
		 * */
		function generatePassword($params){
			$length = $params['length'];
			$passExist=true;

			$n=0;
			while ($passExist) {
				$key = "";
			    $pattern = "1234567890abcdefghijklmnopqrstuvwxyz";
			    $max = strlen($pattern)-1;
			    for($i = 0; $i < $length; $i++){
			        $key .= substr($pattern, mt_rand(0,$max), 1);
			    }
			    $passExist=$this->passExist($key);

			    $n++;
			}
		    
		    return $key;
		}
		
		/**
		 * 
		 * Busca si existe el email del admin \ user
		 * @return string contraseña generada
		 * @param $length int tamaño de la contrase a generar 
		 *
		 * */
		function verifyEmail($params){
			$email = $params['email'];

			$sql = "SELECT * FROM empleados WHERE email='$email' AND delete_at='0000-00-00 00:00:00'";

			$result = $this->query($sql);

			// si no es un empleado
			if (count($result) == 0) {
				$sql = "SELECT * FROM admin WHERE email='$email'";

				$result2 = $this->query($sql);

				// si el admin
				if (count($result2)>0) {
					// carga el codigo de verificacion
					$_SESSION['codigo-veri']=mt_rand(1,1000);

					// almaceno el mail de verifcacion en la variable $_SESSION['email']
					$_SESSION['email']=$email;
					$_SESSION['nombre']=$result[0]['nombre'];
					
					// crea el objeto Mailer
					$objectMailer = new Mailer();

					// variables a reemplazar de la plantilla del correo
					$varsCorreo=[
						'NOMBRE' => $_SESSION['nombre'],
						'CODE' => $_SESSION['codigo-veri']
					];

					// contenido del mail de verificacion
					$contenido=file_get_contents('../views/verifyCorreo.html');
					foreach ($varsCorreo as $key => $value) {
						$contenido = str_replace("{{".$key."}}", $value, $contenido);
					}

					// vector asociativo para el metodo send de la clase Mailer
					$params = [
						'destinatario' => $email,
						'motivo' => "Verificación de Correo",
						'contenido' => $contenido,
					];

					// envia el codigo de verificación al email
					$objectMailer->send($params); 	

					$vector_error['errno']=200;
					$vector_error['error']="Correo correcto";

					return $vector_error;	
				}
			}

			// si es un empleado
			if (count($result) > 0) {
				// carga el codigo de verificacion
				$_SESSION['codigo-veri']=mt_rand(1,1000);

				// almaceno el mail de verifcacion en la variable $_SESSION['email']
				$_SESSION['email']=$email;
				$_SESSION['nombre']=$result[0]['nombre']." ".$result[0]['apellido'];
				
				// crea el objeto Mailer
				$objectMailer = new Mailer();

				// variables a reemplazar de la plantilla del correo
				$varsCorreo=[
					'NOMBRE' => $_SESSION['nombre'],
					'CODE' => $_SESSION['codigo-veri']
				];

				// contenido del mail de verificacion
				$contenido=file_get_contents('../views/verifyCorreo.html');
				foreach ($varsCorreo as $key => $value) {
					$contenido = str_replace("{{".$key."}}", $value, $contenido);
				}

				// vector asociativo para el metodo send de la clase Mailer
				$params = [
					'destinatario' => $email,
					'motivo' => "Verificación de Correo",
					'contenido' => $contenido,
				];

				// envia el codigo de verificación al email
				$objectMailer->send($params); 	

				$vector_error['errno']=200;
				$vector_error['error']="Correo correcto";

				return $vector_error;

			}
			$vector_error['errno']=400;
			$vector_error['error']="Correo inextistente";

			return $vector_error;
		}	

		/**
		 * 
		 * Restablece la contraseña del admin\user si ingresan el cod correctamente
		 * @return string contraseña generada
		 * @param $length int tamaño de la contrase a generar 
		 *
		 * */
		function restorePass($params){
			$codigo = $params['codigo'];
			$email = $_SESSION['email'];

			// si el codigo es correcto
			if ($_SESSION['codigo-veri'] == $codigo) {
				
				$sql = "SELECT * FROM admin WHERE email='$email'";

				$result = $this->query($sql);

				// genera una contraseña aleatoria
				$passwordNueva=$this->generatePassword(['length' => mt_rand(5,7)]);

				// si es un empleado
				if (count($result)==0) {
					$sql = "UPDATE usuarios SET clave='".md5($passwordNueva)."' WHERE email='$email'";
				}

				// si es el admin
				if (count($result)>0) {
					$sql = "UPDATE admin SET clave='".md5($passwordNueva)."' WHERE email='$email'";	
				}
				
				$result2 = $this->query($sql);

				// crea el objeto Mailer
				$objectMailer = new Mailer();

				// variables a reemplazar de la plantilla del correo
				$varsCorreo=[
					'NOMBRE' => $_SESSION['nombre'],
					'PASS_NUEVA' => $passwordNueva
				];

				// contenido del mail de verificacion
				$contenido=file_get_contents('../views/recoverypassCorreo.html');
				foreach ($varsCorreo as $key => $value) {
					$contenido = str_replace("{{".$key."}}", $value, $contenido);
				}

				// vector asociativo para el metodo send de la clase Mailer
				$params = [
					'destinatario' => $email,
					'motivo' => "Nueva Contraseña",
					'contenido' => $contenido,
				];

				// envia el codigo de verificación al email
				$objectMailer->send($params); 	

				$vector_error['errno']=200;
				$vector_error['error']="Codigo correcto";
				$vector_error['email']=$email;

				return $vector_error;	
			}

			$vector_error['errno']=400;
			$vector_error['error']="Codigo incorrecto";

			return $vector_error;	
		}
	}
 ?>