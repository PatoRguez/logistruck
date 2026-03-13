<?php 
	// incluye la clase DBAbstract
	include_once 'DBAbstract.php';

	// año actual
	define('YEAR', date('Y'));
	
	/**
	 * 
	 *	CLase para obtener las estaditicas de queda CRUD
	 *	
	 */
	class Estadistica extends DBAbstract{
		
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
		 * Retorna la cantidad de ingresos en el año de una tabla
		 * @return array arreglo de datos 
		 * @param $tabla string nombre de la tabla
		 * */
		function getEstadisticaByTabla($params){
			$tabla = $params['tabla'];
			$anio = $params['anio'];
			date_default_timezone_set("AMerica/Argentina/Buenos_Aires");

			$sql="SELECT CONVERT(create_at, date) as fecha, CONVERT(create_at, time) as horario FROM ".$tabla." WHERE delete_at='0000-00-00 00:00:00'";

			$result=$this->query($sql);

			// datos por defectos de los meses
			$data=[0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0, 0, 0, 0];

			foreach ($result as $item) {

				//divide en un array el año,mes y dia
				$fecha=explode('-', $item['fecha']);

				// si la año coincide
				if ($fecha[0] == $anio) {
					// var_dump($fecha);

					// Cantidad de Meses
					for ($i=0; $i < 12; $i++) { 
						// si coincide con el mes
						if (($i+1) == $fecha[1]) {
							// suma la cantidad 
							$data[$i]++;
						}
					}

				}
			}

			return $data;	
		}

		/**
		 * 
		 * Retorna la cantidad de ingresos en el año de una tabla segun la optcion
		 * @return array arreglo de datos 
		 * @param $tabla string nombre de la tabla
		 * */
		function getEstadistica($params){
			$anio = $params['anio'];
			$option = $params['option'];

			switch ($option) {
				case 'General':
					return [
						$this->getEstadisticaByTabla(['tabla' => "empleados",'anio' => $anio]),
						$this->getEstadisticaByTabla(['tabla' => "vehiculos",'anio' => $anio]),
						$this->getEstadisticaByTabla(['tabla' => "acoplado",'anio' => $anio]),
						$this->getEstadisticaByTabla(['tabla' => "productos",'anio' => $anio]),
						[0, 4, 1, 4, 0, 3, 0, 2, 7, 5, 1, 0],
					];
					break;
				// obtiene todos los ingresos del año de la tabla empleados
				case 'Empleados':
					return $this->getEstadisticaByTabla(['tabla' => "empleados",'anio' => $anio]);
					break;

				// obtiene todos los ingresos del año de la tabla vehiculos
				case 'Vehiculos':
					return $this->getEstadisticaByTabla(['tabla' => "vehiculos",'anio' => $anio]);
					break;

				// obtiene todos los ingresos del año de la tabla acoplado
				case 'Acoplados':
					return $this->getEstadisticaByTabla(['tabla' => "acoplado",'anio' => $anio]);
					break;

				// obtiene todos los ingresos del año de la tabla productos
				case 'Productos':
					return $this->getEstadisticaByTabla(['tabla' => "productos",'anio' => $anio]);
					break;
				default:
					return "No se selecciono una tabla";
					break;
			}			
		}
	}
	
 ?>