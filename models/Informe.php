<?php
	// incluye la Clase DBAbstract 
	include_once 'DBAbstract.php';

	/**
	 * 
	 *	Clase para Trabajar con la tabla Productos
	 *
	 */
	class Informe extends DBAbstract{
		
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
		 * Retorna los informes de la tabla 'informe'
		 * @return array arreglo de la tabla informe
		 * 
		 * */
		function getInformes(){

			$sql="SELECT i.estado,
					i.idInforme,
				    i.descripcion,
				    concat(em.nombre,' ',em.apellido) as empleado,
				 	em.foto,
				    (CASE 
				     WHEN datediff(i.create_at,CURRENT_TIMESTAMP) = 0 THEN date_format(i.create_at,'%H:%i') -- si el informe lo envio el mismo dia
				     WHEN datediff(i.create_at,CURRENT_TIMESTAMP) <= -365 THEN date_format(i.create_at,'%d/%m/%Y')-- si el informe lo envio hace un año
				     ELSE lower(date_format(i.create_at, '%d %b.'))-- si el informe lo envio hace mas de un dia
				    END) as fecha
				FROM informe as i 
				INNER JOIN empleados as em ON i.idEmpleado=em.idEmpleado
				ORDER BY i.create_at DESC";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Retorna un informe buscado por su id
		 * @return array arreglo de la tabla informe
		 * 
		 * */
		function getInformeById($params){
			$id = $params['id'];

			$sql = "SELECT i.estado,
					i.idInforme,
                    i.asunto,
                    i.problema,
				    i.descripcion,
				    concat(em.nombre,' ',em.apellido) as empleado,
				 	em.foto,
				 	concat(ve.marca,' ',ve.modelo,' (',ve.anio,')') as vehiculo,
                    datediff(i.create_at,CURRENT_TIMESTAMP)as tiempoTranscurrido,
                    date_format(i.create_at,'%d de %b. de %Y %H:%i')as fecha
				FROM informe as i 
				INNER JOIN empleados as em ON i.idEmpleado=em.idEmpleado
				INNER JOIN vehiculos as ve ON i.patente=ve.patente
				WHERE i.idInforme='$id'
				ORDER BY i.create_at DESC";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result[0];	
		}

		/**
		 * 
		 * Agrega un nuevo informe a la DB
		 * @return array arreglo de errores
		 * 
		 * */
		function insert($params){
			// carga los parametros de la peticion HTTP en variables
			$asunto = $params['asunto'];
			$problema = $params['problema'];
			$descripcion = $params['descripcion'];
			$idEmpleado = $params['empleado'];
			$patente = $params['vehiculo'];

			// consulta
			$sql="INSERT INTO informe (patente,idEmpleado,asunto,problema,descripcion) VALUES ('$patente','$idEmpleado','$asunto','$problema','$descripcion')";
			
			// ejecuta la consulta
			$result=$this->query($sql);

			$vector_error["error"]="Informe enviado correctamente exitosamente";
			$vector_error["errno"]=200;

			return $vector_error;
		
		}

		/**
		 * 
		 * Marca como leido o visto un informe
		 * @return array arreglo de errores
		 * 
		 * */
		function markAsRead($params){
			$id = $params['id'];

			$sql="UPDATE informe SET estado='leido' WHERE idInforme='$id'";

			// ejecuta la consulta
			$result=$this->query($sql);

			$vector_error["error"]="Informe marcado como leido";
			$vector_error["errno"]=200;

			return $vector_error;
		}
	}
 ?>