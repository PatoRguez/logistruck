<?php
	// incluye la Clase DBAbstract 
	include_once 'DBAbstract.php';

	include_once 'User.php';

	/**
	 * 
	 *	Clase para Trabajar con la tabla Acoplados
	 *
	 */
	class Viaje extends DBAbstract{
		
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
		 * Retorna los viajes de la tabla 'Viajes'
		 * @return array arreglo de la tabla viajes
		 * 
		 * */

		function getViajes(){

			$sql="SELECT viajes.idViaje, viajes.idDestino, viajes.idProducto,destinos.direccion,destinos.provincia,productos.nombre,viajes.cantidadCarga, date_format(viajes.fechaSalida,'%H:%i - %d / %m / %Y ') as fechaSalida, date_format(viajes.fechaLlegada,'%H:%i - %d / %m / %Y ') as fechaLlegada, viajes.estado, destinos.latitud, destinos.longitud, destinos.nombre_destino, destinos.departamento FROM `viajes` JOIN destinos ON viajes.idDestino=destinos.idDestino JOIN productos ON viajes.idProducto = productos.idProducto";
            
			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Retorna el viaje buscado por el Id 
		 * @return array arreglo de la tabla viajes
		 * @param int id del viaje
		 * 
		 * */
		function getByIdViaje($params){

			$sql="SELECT * FROM `viajes` WHERE idViaje = '$idviaje'";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}  

		/**
		 * 
		 * Agrega un nuevo viaje a la DB
		 * @return array arreglo de errores
		 * @param $provincia string de la provincia elegida
		 * @param $direccion string de la direccion ingresada
		 * @param $producto int id del producto elegido
		 * @param $cantidad int de cantidad de producto elegido
		 * @param $fechSal date de salida
		 * @param $fechLlega date de llegada
		 * 
		 * */
		function insert($params){
			$Destino= $params['idDestino'];
            $producto =$params['idProducto'];
			$cantidad =$params['cantidad'];
			$fechSal=$params['fechaSalida'];
			$fechLlega=$params['fechaLlegada'];
			$estado='disponible';

			// declara los mensages de error
			$vector_error=["error" => "", "errno" => 0];

			// busca el viaje en la tabla
			$result = false; 

			// si el viaje no existe en la tabla
			if ($result == false) {

				$sql="INSERT INTO viajes (idDestino, idProducto, cantidadCarga, fechaSalida, fechaLlegada, estado) VALUES ('$Destino','$producto','$cantidad','$fechSal','$fechLlega','$estado')";
				
				$result=$this->query($sql);

				$vector_error["error"]="Se guardo el viaje exitosamente";
				$vector_error["errno"]=200;

				return $vector_error;					
			}

			// si el viaje fue dado de baja y quiere agregarlo de devuelta
			if ($result[0]['delete_at']!='0000-00-00 00:00:00') {
				
				$vector_error['error']="Viaje eliminado anteriormente";
				$vector_error['errno']=201;
				$vector_error['ubi']=$result[0]['patente'];

				return $vector_error;
			}
			
			// si existe el viaje
			$vector_error["error"] = "Viaje ya existente";
			$vector_error["errno"] = 400;

			return $vector_error;
		}

		/**
		 * 
		 * modifica el viaje
		 * @return array arreglo de errores
		 * @param $params array formulario 
		 * 
		 * */
		function update($params){
			$id = $params['id'];
			$destino = $params['idDestino'];
			$producto = $params['idProducto'];
			$cantidad = $params['cantidad'];
			$fechaS = $params['fechaSalida'];
			$fechaL = $params['fechaLlegada'];
            $result=false;
              
			// si se puede modificar
			if ($result == false) {
				$sql="UPDATE viajes SET `idDestino`='$destino', `idProducto`='$producto', `cantidadCarga`='$cantidad', `fechaSalida`='$fechaS', `fechaLlegada`='$fechaL' WHERE viajes.idViaje='$id' ";

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
		 * Da de baja a el viaje
		 * @return array arreglo de errores
		 * @param $patente string patente del viaje
		 * 
		 * */

		function unsubscribe($params){
			$idViaje = $params['id'];

			$sql="DELETE FROM viajes WHERE `viajes`.`idViaje` ='$idViaje'";

			$result = $this->query($sql); 
			
			$vector_error["error"] = "Se Elimino con exito";
			$vector_error["errno"] = 200;

			return $vector_error;
		}

		/**
		 * 
		 * Modifica el estado de un viaje
		 * @return array arreglo de errores
		 * @param int id del viaje
		 * 
		 * */
		function updateState($params){
			$id = $params['id'];
			$estado = $params['estado'];

			$sql = "UPDATE viajes SET estado = '$estado' WHERE idViaje='$id'";

			$result = $this->query($sql);

			// si ya existe
			$vector_error["error"] = "Se modifico el estado con exito";
			$vector_error["errno"] = 200;

			return $vector_error;
		}
			
		/**
		 * 
		 * Busca un viaje por su destino, producto y estado del viaje
		 * @return array arreglo con los datos de la busqueda
		 * @param $busca string |int busqueda del viaje
		 * 
		 * */
		function getViajesAsignados() {

		    $sql = "SELECT av.idAViaje,v.patente, v.marca, v.modelo, v.anio, v.vtv, 
		                   vi.idViaje, vi.fechaSalida, vi.fechaLlegada, vi.estado, 
		                   date_format(av.fecha,'%H:%i - %d / %m / %Y ') AS fechaAsignacion 
		            FROM vehiculos AS v 
		            INNER JOIN asignarviaje AS av ON v.patente = av.patente 
		            INNER JOIN viajes AS vi ON av.idViaje = vi.idViaje 
		            WHERE v.delete_at = '0000-00-00 00:00:00' 
		            ORDER BY v.patente ";

		    $result = $this->query($sql);

		    if (count($result) == 0) {
		        return false;
		    }

		    return $result;
		}

		/**
		 * 
		 * Retorna los viajes asignados  segun la cantidad
		 * @return array arreglo con los datos del viaje
		 * 
		 * */
		function getViajeAsignadoById($params){
			include_once 'Vehiculo.php';

			$id = $params['id'];

			$sql="SELECT 
					av.patente,
					av.fecha as fechaAsignacion, 
					d.nombre_destino,
				    d.provincia,
				    d.departamento,
				    d.direccion,
				    date_format(va.fechaSalida,'%d / %m / %Y ') as fechaSalida, 
				    date_format(va.fechaLlegada,'%d / %m / %Y ') as fechaLlegada, 
				    d.km_recorridos,
				    d.tiempo_recorrido,
				    p.nombre as nombreProducto,
				    p.idProducto,
				    va.cantidadCarga,
				    va.estado,
				    va.idViaje
				FROM asignarviaje as av 
				INNER JOIN viajes as va ON av.idViaje=va.idViaje 
				INNER JOIN destinos as d ON va.idDestino=d.idDestino
				INNER JOIN productos as p ON va.idProducto=p.idProducto
				WHERE av.idAViaje='$id'";
			
			$resultViaje = $this->query($sql);

		    if (count($resultViaje) == 0) {
		        return false;
		    }

		    // crea el obejto Vehiulo
		    $objectVehiculo = new Vehiculo;

		    // busca el vehiculo por la patente
		    $resultVehiculo = $objectVehiculo->getVehiculoByPatente(['patente' => $resultViaje[0]['patente']]);

		    // combina el la busqueda del viajes asignado con el vehiculo
		 	$result=array_merge($resultViaje[0],$resultVehiculo[0]);

		    return $result;
		}

		/**
		 * 
		 * Retorna los viajes asignados de un empleado
		 * @return array arreglo con los datos del viaje
		 * 
		 * */
		function getViajesAsignadosByEmpleado($params){
			if (!isset($params['id'])) {
				if (isset($_SESSION['logistruck']['usuario'])) {
					$params['id'] = $_SESSION['logistruck']['usuario']->id;
				}
			}

			$empleado = $params['id'];

			$sql="SELECT 
				va.idViaje,
				ava.idAViaje,
			    ave.idEmpleado,
			    ava.patente,
			    date_format(va.fechaSalida,'%d / %m / %Y ') as fechaSalida,
			    d.nombre_destino,
			    va.estado
			FROM asignarvehiculo as ave
			INNER JOIN asignarviaje as ava ON ave.patente=ava.patente
			INNER JOIN viajes as va ON ava.idViaje=va.idViaje
			INNER JOIN destinos as d ON va.idDestino=d.idDestino
			WHERE ave.idEmpleado='$empleado'
			ORDER BY va.fechaSalida ASC";

			$result = $this->query($sql);

		    if (count($result) == 0) {
		        return false;
		    }

		    return $result;
		}

		/**
		 * 
		 * Asigna un  viaje a un vehiculo
		 * @return array arreglo de errores
		 * @param int id del viaje
		 * @param int patente del vehiculo
		 * 
		 * */
        function assign($params){
			// carga los parametros de la peticion HTTP
			$id_viaje = $params['viaje'];
			$patente = $params['vehiculo'];
             
			$sql="INSERT INTO `asignarviaje` (`patente`, `idViaje`) VALUES ('$patente', '$id_viaje')";
			$result = $this->query($sql);

	        $sql2="UPDATE `viajes` SET `estado` = 'asignado' WHERE `viajes`.`idViaje` = '$id_viaje'";
			$result2 = $this->query($sql2);

			$vector_error['errno'] = 200;
			$vector_error['error'] = "Viaje asignado corretamente";

			return $vector_error;
		}

		/**
		 * 
		 * Elimina la asignacion de un viaje  
		 * @return array arreglo de errores
		 * @param $params array parametros de la peticon HTTP
		 * 
		 * */
		function assignDelete($params){
			// carga los parametros de la peticion HTTP
			$id = $params['id'];

			$sql="DELETE FROM `asignarviaje` WHERE idAViaje='$id'";
	
			$result = $this->query($sql);

			$vector_error['errno'] = 200;
			$vector_error['error'] = "Se Elimino corretamente";

			return $vector_error;
		}

		/**
		 * 
		 * Modifica la asignacion de un viaje a un vehiculo 
		 * @return array arreglo de errores
		 * @param $params array parametros de la peticon HTTP
		 * 
		 * */
		function assignUpdate($params){
			// carga los parametros de la peticion HTTP
			$idViaje = $params['viaje'];
			$patente = $params['vehiculo'];
			$id = $params['id'];

			$sql="UPDATE `asignarviaje` SET patente='$patente', idViaje='$idViaje' WHERE idAViaje='$id'";
	
			$result = $this->query($sql);

			$vector_error['errno'] = 200;
			$vector_error['error'] = "Se actualizo los datos corretamente";

			return $vector_error;
		}
	}
 ?>