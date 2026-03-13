<?php
	// incluye la Clase DBAbstract 
	include_once 'DBAbstract.php';

	/**
	 * 
	 *	Clase para Trabajar con la tabla Productos
	 *
	 */
	class Destinos extends DBAbstract{
		
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
		 * Retorna los productos de la tabla 'productos'
		 * @return array arreglo de la tabla producto
		 * 
		 * */
		function getdestinos(){

			$sql="SELECT * FROM destinos  WHERE delete_at='0000-00-00 00:00:00'";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Busca un destino por su direccion
		 * @return array|bool arreglo con los datos del destino|si no lo encontro false
		 * @param $nombre string nombre del destino
		 * 
		 * */
		function getDestinosByDireccion($params){
			$direccion = $params['direccion'];

			$sql="SELECT * FROM destinos WHERE direccion = '".$direccion."'";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Agrega un nuevo destino a la DB
		 * @return array arreglo de errores
		 * @param $nombre string nombre del destino
		 * 
		 * */
		function insert($params){
			// carga los parametros de la peticion HTTP en variables
			$nombre = $params['nombre_destino'];
			$provincia = $params['provincia'];
			$departamento = $params['departamento'];
			$direccion = $params['nomenclatura'];
			$latitud = $params['latitud'];
			$longitud = $params['longitud'];
			$tiempo = $params['tiempo'];
			$km = $params['km'];

			// busca si el destino ya existe
			$result = $this->getDestinosByDireccion([ 'direccion' => $direccion]);

			// si el destino no existe
			if ($result == false) {
				// consulta
				$sql="INSERT INTO destinos (nombre_destino,provincia,departamento,direccion,latitud,longitud,km_recorridos,tiempo_recorrido,delete_at) VALUES ('$nombre','$provincia','$departamento','$direccion','$latitud','$longitud','$km','$tiempo','0000-00-00 00:00:00')";
				
				// ejecuta la consulta
				$result=$this->query($sql);

				$vector_error["error"]="Se guardo el destino exitosamente";
				$vector_error["errno"]=200;

				return $vector_error;
			}

			$vector_error["error"] = "Destino ya existente";
			$vector_error["errno"] = 400;

			return $vector_error;
		}

		/**
		 * 
		 * Modifica un destino
		 * @return array arreglo de errores
		 * @param $id int id del destino
		 * 
		 * */
		function update($params){
			$id = $params['id'];
			$nombre = $params['nombre_destino'];
			$provincia = $params['provincia'];
			$departamento = $params['departamento'];
			$direccion = $params['nomenclatura'];
			$latitud = $params['latitud'];
			$longitud = $params['longitud'];
			$tiempo = $params['tiempo'];
			$km = $params['km'];

			
			$sql="UPDATE destinos SET nombre_destino='$nombre',provincia='$provincia',departamento='$departamento',direccion='$direccion',latitud='$latitud',longitud='$longitud',tiempo_recorrido='$tiempo',km_recorridos='$km' WHERE idDestino = '$id'";

			$result = $this->query($sql); 
			
			$vector_error["error"] = "Se actualizo los datos con exito";
			$vector_error["errno"] = 200;

			// si el nombre ya existe
			// $vector_error["error"] = "Nombre en uso";
			// $vector_error["errno"] = 400;

			return $vector_error;
		}

		/**
		 * 
		 * Da de baja a un destino
		 * @return array arreglo de errores
		 * @param $id int id del producto
		 * 
		 * */
		function unsubscribe($params){
			$id = $params['id'];

			$sql="UPDATE destinos SET delete_at=CURRENT_TIMESTAMP WHERE idDestino = '$id'";

			$result = $this->query($sql); 
			
			$vector_error["error"] = "Se Elimino con exito";
			$vector_error["errno"] = 200;

			return $vector_error;
		}

		/**
		 * 
		 * Restaura un destino dado de baja
		 * @return array arreglo de errores
		 * @param $id int id del destino
		 * 
		 * */
		function restore($params){
			$id = $params['id'];

			$sql="UPDATE destinos SET delete_at='0000-00-00 00:00:00' WHERE idDestino='$id'";

			$result = $this->query($sql);

			$vector_error["error"] = "Se restauro el Destino exitosamente";
			$vector_error["errno"] = 200;

			return $vector_error;
		}
	}
 ?>