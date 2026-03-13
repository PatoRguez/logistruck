<?php
	// incluye la Clase DBAbstract 
	include_once 'DBAbstract.php';

	/**
	 * 
	 *	Clase para Trabajar con la tabla Productos
	 *
	 */
	class Producto extends DBAbstract{
		
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
		function getProductos(){

			$sql="SELECT * FROM productos WHERE delete_at = '0000-00-00 00:00:00'";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Busca un producto por su nombre
		 * @return array|bool arreglo con los datos del producto|si no lo encontro false
		 * @param $nombre string nombre del producto
		 * 
		 * */
		function getProductoByNombre($params){
			$nombre = $params['nombre'];

			$sql="SELECT * FROM productos WHERE nombre = '".$nombre."'";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Agrega un nuevo producto a la DB
		 * @return array arreglo de errores
		 * @param $nombre string nombre del producto
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
			
			$nombre = $params['nombre'];

			// declara los mensages de error
			$vector_error=["error" => "", "errno" => 0];

			// busca el producto en la tabla
			$result = $this->getProductoByNombre($params); 

			// si el producto no existe en la tabla
			if ($result == false) {

				$sql="INSERT INTO productos (nombre,delete_at) VALUES ('$nombre','0000-00-00 00:00:00')";
				
				$result=$this->query($sql);

				$vector_error["error"]="Se guardo el producto exitosamente";
				$vector_error["errno"]=200;

				return $vector_error;					
			}

			// si el producto fue dado de baja y quiere agregarlo de devuelta
			if ($result[0]['delete_at']!='0000-00-00 00:00:00') {
				
				$vector_error['error']="Producto eliminado anteriormente";
				$vector_error['errno']=201;
				$vector_error['ubi']=$result[0]['idProducto'];

				return $vector_error;
			}
			
			// si existe el producto
			$vector_error["error"] = "Producto ya existente";
			$vector_error["errno"] = 400;

			return $vector_error;
		}

		/**
		 * 
		 * modifica el producto
		 * @return array arreglo de errores
		 * @param $nombre string nombre del producto
		 * @param $id int id del producto
		 * 
		 * */
		function update($params){
			$id = $params['id'];
			$nombre = $params['nombre'];

			$result=$this->getProductoByNombre($params);

			// si nombre que modifica no existe
			if ($result == false) {
				$sql="UPDATE productos SET nombre='".$nombre."' WHERE idProducto = '$id'";

				$result = $this->query($sql); 
				
				$vector_error["error"] = "Se actualizo los datos con exito";
				$vector_error["errno"] = 200;

				return $vector_error;	
			}

			// si el nombre ya existe
			$vector_error["error"] = "Nombre en uso";
			$vector_error["errno"] = 400;

			return $vector_error;
		}

		/**
		 * 
		 * Da de baja a el producto
		 * @return array arreglo de errores
		 * @param $id int id del producto
		 * 
		 * */
		function unsubscribe($params){
			$id = $params['id'];

			$sql="UPDATE productos SET delete_at=CURRENT_TIMESTAMP WHERE idProducto = '$id'";

			$result = $this->query($sql); 
			
			$vector_error["error"] = "Se Elimino con exito";
			$vector_error["errno"] = 200;

			return $vector_error;
		}

		/**
		 * 
		 * Restaura el producto dado de baja
		 * @return array arreglo de errores
		 * @param $id int id del producto
		 * 
		 * */
		function restore($params){
			$id = $params['id'];

			$sql="UPDATE productos SET delete_at='0000-00-00 00:00:00' WHERE idProducto='$id'";

			$result = $this->query($sql);

			$vector_error["error"] = "Se restauro el producto exitosamente";
			$vector_error["errno"] = 200;

			return $vector_error;
		}
	}
 ?>