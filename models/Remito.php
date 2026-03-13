<?php
	// incluye la Clase DBAbstract 
	include_once 'DBAbstract.php';

	include_once 'User.php';

	/**
	 * 
	 *	Clase para Trabajar con la tabla remito
	 *
	 */
	class Remito extends DBAbstract{
		
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
		 * Retorna los remitos de la tabla 'remitos'
		 * @return array arreglo de la tabla remitos
		 * 
		 * */
		function getRemitos(){

			$sql="SELECT * FROM remitos";

			$result = $this->query($sql);

			if (count($result)==0) {
				return false;
			}

			return $result;
		}

		/**
		 * 
		 * Agrega un nuevo remito a la DB
		 * @return array arreglo de errores
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
			
			if (isset($_SESSION['logistruck']['usuario'])) {
				$idEmpleado = $_SESSION['logistruck']['usuario']->id;
			}

			// carga los parametros de la peticion HTTP
			$idViaje = $params['idViaje'];
			$patente = $params['patente'];
			$idAcoplado = $params['idAcoplado'];
			$idProducto = $params['idProducto'];
			
			$indicadorDesp = $params['indicadorDesp'];
			$indicadorAnt = $params['indicadorAnt'];
			$cantFacturarI = $params['cantFacturarI'];

			$pesoFinalB = $params['pesoFinalB'];
			$pesoInicialB = $params['pesoInicialB'];
			$cantEntPesoB = $params['cantEntPesoB'];
			$factorConversion = $params['factorConversion'];
			$cantFacturarB = $params['cantFacturarB'];
			
			$volEntregado = $params['volEntregado'];
			$volResidual = $params['volResidual'];
			$cantEntreFact = $params['cantEntreFact'];

			// declara los mensages de error
			$vector_error=["error" => "", "errno" => 0];

			$sql="INSERT INTO remitos (idViaje,patente,idAcoplado,idProducto,indicadorAntes,indicadorDespues,CantAFacturar,pesoInicial,pesoFinal,CantEntPeso,FactorDeConversion,CantAFacturarBas,trailerSal,trailerReg,volEntregado,volResidual,cantEntregadaAFacturar,idEmpleado) VALUES ('$idViaje','$patente','$idAcoplado','$idProducto','$indicadorAnt','$indicadorDesp','$cantFacturarI','$pesoInicialB','$pesoFinalB','$cantEntPesoB','$factorConversion','$cantFacturarB','0','0','$volEntregado','$volResidual','$cantEntreFact','$idEmpleado')";
			
			$result=$this->query($sql);

			$vector_error["error"]="Remito enviado con éxito";
			$vector_error["errno"]=200;

			return $vector_error;					
		}
	}
 ?>