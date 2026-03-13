<?php
	// incluye la Clase DBAbstract 
	include_once 'DBAbstract.php';

	include_once 'User.php';

	/**
	 * 
	 *	Clase para Trabajar con la tabla vehiculos
	 *
	 */
	class Vehiculo extends DBAbstract{
		
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
		 * Retorna los Vehiculos de la tabla 'Vehiculos'
		 * @return array arreglo de la tabla vehiculo
		 * 
		 * */
		function getVehiculos(){

			$sql="SELECT v.create_at,v.patente, v.marca, v.modelo, v.anio, v.vtv, v.tara, a.idAcoplado, ta.nombre, a.largo, a.capacidad FROM vehiculos as v INNER JOIN acoplado as a ON v.idAcoplado=a.idAcoplado INNER JOIN tipoacoplado as ta ON a.idTipo= ta.idTipo  WHERE v.delete_at='0000-00-00 00:00:00' ORDER BY v.patente";

			// SELECT v.patente, v.marca, v.modelo, v.anio, v.vtv, v.tara, a.idAcoplado, ta.nombre, a.largo, a.capacidad, av.idEmpleado, concat(e.nombre,' ',e.apellido,' (',e.DNI,')') as empleado, av.fecha as fechaAsignacion FROM vehiculos as v INNER JOIN acoplado as a ON v.idAcoplado=a.idAcoplado INNER JOIN tipoacoplado as ta ON a.idTipo= ta.idTipo LEFT JOIN asignarvehiculo as av ON v.patente=av.patente LEFT JOIN empleados as e ON av.idEmpleado=e.idEmpleado WHERE v.delete_at='0000-00-00 00:00:00' ORDER BY v.patente
			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Retorna al vehiculo buscado por la patente
		 * @return array arreglo de la tabla vehiculo
		 * @param patente string patente del vehiculo
		 * 
		 * */
		function getVehiculoByPatente($params){
			$patente = $params['patente'];

			$sql="SELECT v.patente, v.marca, v.modelo, v.anio, v.vtv, v.tara, a.idAcoplado, ta.nombre, a.largo, a.capacidad, a.cantEjes FROM vehiculos as v INNER JOIN acoplado as a ON v.idAcoplado=a.idAcoplado INNER JOIN tipoacoplado as ta ON a.idTipo= ta.idTipo WHERE v.patente = '$patente'";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Agrega un nuevo vehiculo a la DB
		 * @return array arreglo de errores
		 * @param $param array formulario de ingreso
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
			
			$patente = $params['patente'];
			$idA = $params['idAcoplado'];
			$marca = $params['marca'];
			$modelo = $params['modelo'];
			$anio = $params['anio'];
			$vtv = $params['vtv'];
			$tara = $params['tara'];

			// declara los mensages de error
			$vector_error=["error" => "", "errno" => 0];

			// busca el vehiculo en la tabla
			$result = $this->getVehiculoByPatente([ 'patente' => $patente]); 

			// si el vehiculo no existe en la tabla
			if ($result == false) {

				$sql="INSERT INTO vehiculos (patente,idAcoplado,marca,modelo,anio,vtv,tara,delete_at) VALUES ('$patente','$idA','$marca','$modelo','$anio','$vtv','$tara','0000-00-00 00:00:00')";
				
				$result=$this->query($sql);

				$vector_error["error"]="Se guardo el vehiculo exitosamente";
				$vector_error["errno"]=200;

				return $vector_error;					
			}

			// si el vehiculo fue dado de baja y quiere agregarlo de devuelta
			if ($result[0]['delete_at']!='0000-00-00 00:00:00') {
				
				$vector_error['error']="Vehiculo eliminado anteriormente";
				$vector_error['errno']=201;
				$vector_error['ubi']=$result[0]['patente'];

				return $vector_error;
			}
			
			// si existe el vehiculo
			$vector_error["error"] = "Patente ya existente";
			$vector_error["errno"] = 400;

			return $vector_error;
		}

		/**
		 * 
		 * modifica el vehiculo
		 * @return array arreglo de errores
		 * @param $params array formulario 
		 * 
		 * */
		function update($params){
			$patente = $params['patente'];
			$idA = $params['idAcoplado'];
			$marca = $params['marca'];
			$modelo = $params['modelo'];
			$anio = $params['anio'];
			$vtv = $params['vtv'];
			$tara = $params['tara'];
			$id = $params['id']; 

			// si quiere modificar la patente
			if ($id != $patente) {
				// averigua sise puede modificar
				$result=$this->getVehiculoByPatente($patente);
			}
			// si quiere modificar lo demas menos la patente
			else{
				$result = false;
			}

			// si se puede modificar
			if ($result == false) {
				$sql="UPDATE vehiculos SET patente='$patente',`idAcoplado`='$idA', `marca`='$marca', `modelo`='$modelo', `anio`='$anio', `vtv`='$vtv', `tara`='$tara' WHERE vehiculos.patente='$id' ";

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
		 * Da de baja a el vehiculo
		 * @return array arreglo de errores
		 * @param $patente string patente del vehiculo
		 * 
		 * */
		function unsubscribe($params){
			$patente = $params['id'];

			$sql="UPDATE vehiculos SET delete_at=CURRENT_TIMESTAMP WHERE patente = '$patente'";

			$result = $this->query($sql); 
			
			$vector_error["error"] = "Se Elimino con exito";
			$vector_error["errno"] = 200;

			return $vector_error;
		}

		/**
		 * 
		 * Restaura el vehiculo dado de baja
		 * @return array arreglo de errores
		 * @param $patente string patente del vehiculo
		 * 
		 * */
		function restore($params){
			$patente = $params['id'];

			$sql="UPDATE vehiculos SET delete_at='0000-00-00 00:00:00' WHERE patente='$patente'";

			$result = $this->query($sql);

			$vector_error["error"] = "Se restauro el vehiculo exitosamente";
			$vector_error["errno"] = 200;

			return $vector_error;
		}

		/**
		 * 
		 * Retorna los Vehiculos asignados de la tabla 'asignarvehiculo'
		 * @return array arreglo de la tabla vehiculo
		 * 
		 * */
		function getVehiculosAsignados(){

			$sql="SELECT v.patente, v.marca, v.modelo, v.anio, v.vtv, v.tara, a.idAcoplado, ta.nombre, a.largo, a.capacidad, av.idEmpleado, concat(e.nombre,' ',e.apellido,' (',e.DNI,')') as empleado, date_format(av.fecha,'%H:%i - %d / %m / %Y ') as fechaAsignacion, av.idAVehiculo FROM vehiculos as v INNER JOIN acoplado as a ON v.idAcoplado=a.idAcoplado INNER JOIN tipoacoplado as ta ON a.idTipo= ta.idTipo INNER JOIN asignarvehiculo as av ON v.patente=av.patente INNER JOIN empleados as e ON av.idEmpleado=e.idEmpleado WHERE v.delete_at='0000-00-00 00:00:00' ORDER BY av.idAVehiculo";
			
			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}
		/**
		 * 
		 * Retorna los Vehiculos que no fueron asignados
		 * @return array arreglo con los vehiculos
		 * 
		 * */
		function getVehiculosSinAsignar($params){
			$sql="SELECT av.idAVehiculo,v.patente, v.marca, v.modelo, v.anio, v.vtv, v.tara, a.idAcoplado, ta.nombre, a.largo, a.capacidad FROM vehiculos as v INNER JOIN acoplado as a ON v.idAcoplado=a.idAcoplado INNER JOIN tipoacoplado as ta ON a.idTipo= ta.idTipo LEFT JOIN asignarvehiculo as av ON v.patente=av.patente  WHERE v.delete_at='0000-00-00 00:00:00' AND av.idAVehiculo IS NULL";
		
			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Asigna un empleado a un vehiculo 
		 * @return array arreglo de errores
		 * @param $params array parametros de la peticon HTTP
		 * 
		 * */
		function assign($params){
			// carga los parametros de la peticion HTTP
			$id_empleado = $params['empleado'];
			$patente = $params['vehiculo'];

			$sql="INSERT INTO `asignarvehiculo` (`patente`, `idEmpleado`) VALUES ('$patente', '$id_empleado')";
	
			$result = $this->query($sql);


			$vector_error['errno'] = 200;
			$vector_error['error'] = "Empleado asignado corretamente";

			return $vector_error;
		}

		/**
		 * 
		 * Modifica la asignacion de un empleado a un vehiculo 
		 * @return array arreglo de errores
		 * @param $params array parametros de la peticon HTTP
		 * 
		 * */
		function assignUpdate($params){
			// carga los parametros de la peticion HTTP
			$id_empleado = $params['empleado'];
			$patente = $params['vehiculo'];
			$id = $params['id'];

			$sql="UPDATE `asignarvehiculo` SET patente='$patente', idEmpleado='$id_empleado' WHERE idAVehiculo='$id'";
	
			$result = $this->query($sql);

			$vector_error['errno'] = 200;
			$vector_error['error'] = "Se actualizo los datos corretamente";

			return $vector_error;
		}

		/**
		 * 
		 * Elimina la asignacion de un empleado a un vehiculo 
		 * @return array arreglo de errores
		 * @param $params array parametros de la peticon HTTP
		 * 
		 * */
		function assignDelete($params){
			// carga los parametros de la peticion HTTP
			$id = $params['id'];

			$sql="DELETE FROM `asignarvehiculo` WHERE idAVehiculo='$id'";
	
			$result = $this->query($sql);

			$vector_error['errno'] = 200;
			$vector_error['error'] = "Se Elimino corretamente";

			return $vector_error;
		}

		/**
		 * 
		 * Obtine un vehiculo asignado por empleado
		 * @return array arreglo con los datos de la busqueda
		 * @param $empleado int id del empleado
		 * 
		 * */
		function getVehiculoAsignadoByEmpleado($params){

			if (!isset($params['id'])) {
				if (isset($_SESSION['logistruck']['usuario'])) {
					$params['id'] = $_SESSION['logistruck']['usuario']->id;
				}
			}

			$empleado = $params['id'];

			$sql="SELECT v.patente, v.marca, v.modelo, v.anio, v.vtv, v.tara, a.idAcoplado, ta.nombre, a.largo, a.capacidad, a.cantEjes, av.idEmpleado, av.fecha as fechaAsignacion, av.idAVehiculo FROM vehiculos as v INNER JOIN acoplado as a ON v.idAcoplado=a.idAcoplado INNER JOIN tipoacoplado as ta ON a.idTipo= ta.idTipo INNER JOIN asignarvehiculo as av ON v.patente=av.patente INNER JOIN empleados as e ON av.idEmpleado=e.idEmpleado WHERE v.delete_at='0000-00-00 00:00:00' AND av.idEmpleado='$empleado'";

			$result = $this->query($sql); 

			if (count($result)==0) {
				return false;
			}
			
			return $result;	
		}
	}
 ?>