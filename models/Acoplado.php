<?php
	// incluye la Clase DBAbstract 
	include_once 'DBAbstract.php';

	/**
	 * 
	 *	Clase para Trabajar con la tabla Acoplados
	 *
	 */
	class Acoplado extends DBAbstract{
		
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
		 * Retorna los Acoplados de la tabla 'Acoplados'
		 * @return array arreglo de la tabla acoplado
		 * 
		 * */
		function getAcoplados(){

			$sql="SELECT acoplado.idAcoplado,acoplado.idTipo,tipoacoplado.nombre,acoplado.capacidad,acoplado.cantEjes,acoplado.largo FROM `acoplado` JOIN tipoacoplado ON acoplado.idTipo=tipoacoplado.idTipo WHERE delete_at = '0000-00-00 00:00:00' ORDER BY acoplado.idAcoplado";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Retorna los tipos de Acoplados de la tabla 'tipoacoplado'
		 * @return array arreglo de la tabla tipoacoplado
		 * 
		 * */
		function getTipoAcoplados(){

			$sql="SELECT * FROM tipoacoplado";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Busca un acoplado por TCCL(Tipo,Capacidad,Cantidad de Ejes,Largo)
		 * @return array|bool arreglo con los datos del acoplado|si no lo encontro false
		 * @param $idTipo int id del tipo de acoplado
		 * @param $capacidad int capacidad del acoplado
		 * @param $cantEjes int cantidad de ejes del acoplado
		 * @param $largo int largo del acoplado
		 * 
		 * */
		function getAcopladoByTCCL($params){
			$idTipo = $params['tipoAcoplado'];
			$capacidad = $params['capacidad'];
			$cantEjes = $params['cantidadEjes'];
			$largo = $params['largo'];

			$sql="SELECT * FROM acoplado WHERE idTipo = '".$idTipo."' AND capacidad = '".$capacidad."' AND cantEjes = '".$cantEjes."' AND largo = '".$largo."' ";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Agrega un nuevo acoplado a la DB
		 * @return array arreglo de errores
		 * @param $idTipo int id del tipo de acoplado
		 * @param $capacidad int capacidad del acoplado
		 * @param $cantEjes int cantidad de ejes del acoplado
		 * @param $largo int largo del acoplado
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
			
			$idTipo = $params['tipoAcoplado'];
			$capacidad = $params['capacidad'];
			$cantEjes = $params['cantidadEjes'];
			$largo = $params['largo'];

			// declara los mensages de error
			$vector_error=["error" => "", "errno" => 0];

			// busca el acoplado en la tabla
			$result = $this->getAcopladoByTCCL($params); 

			// si el acoplado no existe en la tabla
			if ($result == false) {

				$sql="INSERT INTO acoplado (idTipo,capacidad,cantEjes,largo,delete_at) VALUES ('$idTipo','$capacidad','$cantEjes','$largo','0000-00-00 00:00:00')";
				
				$result=$this->query($sql);

				$vector_error["error"]="Se guardo el acoplado exitosamente";
				$vector_error["errno"]=200;

				return $vector_error;					
			}

			// si el acoplado fue dado de baja y quiere agregarlo de devuelta
			if ($result[0]['delete_at']!='0000-00-00 00:00:00') {
				
				$vector_error['error']="acoplado eliminado anteriormente";
				$vector_error['errno']=201;
				$vector_error['ubi']=$result[0]['idAcoplado'];

				return $vector_error;
			}
			
			// si existe el acoplado
			$vector_error["error"] = "acoplado ya existente";
			$vector_error["errno"] = 400;

			return $vector_error;
		}

		/**
		 * 
		 * modifica el acoplado
		 * @return array arreglo de errores
		 * @param $id int id del acoplada
		 * @param $idTipo int id del tipo de acoplado
		 * @param $capacidad int capacidad del acoplado
		 * @param $cantEjes int cantidad de ejes del acoplado
		 * @param $largo int largo del acoplado
		 * 
		 * */
		function update($params){
			$idTipo = $params['tipoAcoplado'];
			$capacidad = $params['capacidad'];
			$cantEjes = $params['cantidadEjes'];
			$largo = $params['largo'];
			$id = $params['id'];

			$result=$this->getAcopladoByTCCL($params);

			// si se puede modificar
			if ($result == false) {
				$sql="UPDATE acoplado SET idTipo='".$idTipo."', capacidad='".$capacidad."', cantEjes='".$cantEjes."', largo='".$largo."' WHERE idAcoplado='$id'";

				$result = $this->query($sql); 
				
				$vector_error["error"] = "Se actualizo los datos con exito";
				$vector_error["errno"] = 200;

				return $vector_error;	
			}

			// si ya existe
			$vector_error["error"] = "Datos en uso";
			$vector_error["errno"] = 400;

			return $vector_error;
		}

		/**
		 * 
		 * Da de baja a el acoplado
		 * @return array arreglo de errores
		 * @param $id int id del acoplado
		 * 
		 * */
		function unsubscribe($params){
			$id = $params['id'];

			$sql="UPDATE acoplado SET delete_at=CURRENT_TIMESTAMP WHERE idAcoplado = '$id'";

			$result = $this->query($sql); 
			
			$vector_error["error"] = "Se Elimino con exito";
			$vector_error["errno"] = 200;

			return $vector_error;
		}

		/**
		 * 
		 * Restaura el acoplado dado de baja
		 * @return array arreglo de errores
		 * @param $id string id del acoplado
		 * 
		 * */
		function restore($params){
			$id = $params['id'];

			$sql="UPDATE acoplado SET delete_at='0000-00-00 00:00:00' WHERE idAcoplado='$id'";

			$result = $this->query($sql);

			$vector_error["error"] = "Se restauro el acoplado exitosamente";
			$vector_error["errno"] = 200;

			return $vector_error;
		}
	}
 ?>