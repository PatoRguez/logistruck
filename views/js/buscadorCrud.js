/*******************************************
*
*
*		BUSCADOR POR CRUD
*
*
***********************************************/

const title = btn_agregar.innerText.split("Agregar ")[1].toString()

// console.log(title)
$(document).ready(function() {	
	buscador.addEventListener('keyup', () => {
		var busqueda=buscador.value

		let params = new URLSearchParams({
			busca: busqueda, 
		})	

		if (busqueda!='') {
			fetchApi2(title,`search/?${params}`).then(datos=>{
				// inserta la tabla al HTML
				tableStruct(datos)
			})	
		}else{
			tablaData()
		}
		
	});
});