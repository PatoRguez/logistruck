// variable global para almacenar los registros
let dataGlobal=[]

let totalPaginas; // almacena la cantida de paginas

let cantidad = 5 // cantidad de filas a mostrar en la tabla

let page = 1 // pagina en la que esta parado

// cambia de pagina
select_pag.addEventListener('change', e => {
	page=parseInt(select_pag.value)
    cambiarPagina(select_pag.value)
})

// cambiar el order de los registros( mas reciente o mas antiguo)
select_order.addEventListener('change', e => {
	const op = select_order.value=='true'? true : false
	ordenarTabla(op)
	cambiarPagina(page)
})

tablaData()

/**
 * 
 * Formulario Modal para el ingreso de un vehiculo
 * 
 * */
async function addVehiculo() {
	const acoplados = await fetchApi2('acoplado', 'getAcoplados')

	let formulario=`
	<div class="inputs-group">
		<div class="inputs">
			<label for="pat">Patente</label>
			<input type="text" name="patente" id="pat" class="input-error" min="0" required/>
			<span id="msg_error_form" class="msg-error-form"></span>
		</div>
		<div class="inputs">
			<label for="mar">Marca</label>
			<input type="text" name="marca" id="mar" required/>
		</div>
	</div>
	<div class="inputs-group">
		<div class="inputs">
			<label for="mod">Modelo</label>
			<input type="text"  name="modelo" id="mod" required/>
		</div>
		<div class="inputs">
			<label for="an">Año</label>
			<select name="anio" id="an" required>`

			//FOREACH para mostrar los años	  
			for (let i = 2024; i >= 1990; i--) {
			  	formulario +=`<option value="${i}"> ${i}</option>`;
			}

	formulario+=`
			</select>
		</div>
		<div class="inputs">
			<label for="vtv">VTV</label>
			<input type="date" name="vtv" id="vtv" required/>
		</div>
	</div>
	<div class="inputs-group">
		<div class="inputs">
			<label for="tara">Tara</label>
			<input type="number" step="0.01" name="tara" id="tara" min="0" required/>
		</div>
		<div class="inputs all">
			<label for="Acoplado">Acoplado</label>
			<select name="idAcoplado" id="Acoplado" required>`
	
		//FOREACH para recorrer el array y hacer las opciones del select	  
		acoplados.forEach(({ idAcoplado, nombre, capacidad , largo }) => {

			let cap=(nombre=="Acoplado")? `${capacidad} Kg` : `${capacidad} L`

			formulario +=`<option value="${idAcoplado}"> ${nombre} - ${cap} (${largo}m)</option>`;
		}); //FOREACH para recorrer el array y hacer las opciones del select

	formulario+=`
			</select>
		</div>
	</div>`

	// crea la alerta con el formulario
	create_modal_form({
		title: "Agregar Vehiculo",
		form: formulario,
		btnText: 'Agregar',
		btnName: 'btn-insert'
	})

	form_modal.addEventListener('submit', e => {
		e.preventDefault()// le quita al formulario el evento por defecto

		let form = new FormData(e.target)// obtiene los valores del formulario 

		console.log(form)

		// parametros de la peticion HTTP a la API
		const optionsRequest = {
			method: 'POST',
			body: form
		}

		// peticion  a la API
		fetchApi2('vehiculo',`insert`,optionsRequest).then(response => {
			console.log(response)

			page=1
			// muestra el mensaje
			mensajeError(response)
		})
	})
}

/**
 * 
 * Alerta para eliminar un vehiculo
 * 
 * */
function deleteVehiculo({patente}) {
	//FUNCION ALERTA DE ELIMINAR VEHICULO
	Swal.fire({
	  title: "Estas seguro de eliminar este Vehiculo?!!",
	  icon: "warning",
	  text: "¡¡No podras revertir esto!!!",
	  showCancelButton: true,
	  cancelButtonColor: "red",
	  confirmButtonText: "Si, eliminar!",
	  cancelButtonText: "Cancelar",
	  padding:'10px',
	}).then((result) => {
		//Si Presiona el boton 'Si,eliminar!'
		if (result.isConfirmed) {

			const params = new URLSearchParams({
				id: patente,
			}).toString()

			fetchApi2('vehiculo', `unsubscribe/?${params}`).then(response => {
				mensajeError(response)
			})

	  	} //Si Presiona el boton 'Si,eliminar!'
	});
}
  
/**
 * 
 * Formulario Modal para el modificar un vehiculo
 * 
 * */
async function editVehiculo({patente,marca,modelo,anio,vtv,tara,acoplado}) {

	const acoplados = await fetchApi2('acoplado', 'getAcoplados')

	let formulario=`
	<div class="inputs-group">
		<div class="inputs">
			<label for="pat">Patente</label>
			<input type="text" name="patente" id="pat" class="input-error" min="0" value="${patente}" required/>
			<span id="msg_error_form" class="msg-error-form"></span>
		</div>
		<div class="inputs">
			<label for="mar">Marca</label>
			<input type="text" name="marca" id="mar" value="${marca}" required/>
		</div>
	</div>
	<div class="inputs-group">
		<div class="inputs">
			<label for="mod">Modelo</label>
			<input type="text"  name="modelo" id="mod" value="${modelo}" required/>
		</div>
		<div class="inputs">
			<label for="an">Año</label>
			<select name="anio" id="an" required>`

			//FOREACH para mostrar los años	  
			for (let i = 2024; i >= 1990; i--) {
				if (anio == i) {
					formulario +=`<option value="${i}" selected> ${i}</option>`;
				}
			  	else{
			  		formulario +=`<option value="${i}"> ${i}</option>`;
			  	}
			}

	formulario+=`
			</select>
		</div>
		<div class="inputs">
			<label for="vtv">VTV</label>
			<input type="date" name="vtv" id="vtv" value="${vtv}" required/>
		</div>
	</div>
	<div class="inputs-group">
		<div class="inputs">
			<label for="tara">Tara</label>
			<input type="number" step="0.01" name="tara" id="tara" min="0" value="${tara}" required/>
		</div>
		<div class="inputs all">
			<label for="Acoplado">Acoplado</label>
			<select name="idAcoplado" id="Acoplado" required>`
	
		//FOREACH para recorrer el array y hacer las opciones del select	  
		acoplados.forEach(({ idAcoplado, nombre, capacidad , largo }) => {

			let cap=(nombre=="Acoplado")? `${capacidad} Kg` : `${capacidad} L`

			if (acoplado == idAcoplado) {
				//If para selecionar el tipoacopladoque ingreso
				formulario +=`<option value="${idAcoplado}" selected> ${nombre} - ${cap} (${largo}m)</option>`;
			} //If para selecionar el tipoacopladoque ingreso
			else {
				formulario +=`<option value="${idAcoplado}"> ${nombre} - ${cap} (${largo}m)</option>`;
			}
		}); //FOREACH para recorrer el array y hacer las opciones del select

	formulario+=`
			</select>
		</div>
		<input type="hidden" name="id" value="${patente}">
	</div>`

	// crea la alerta con el formulario
	create_modal_form({
		title: "Editar Vehiculo",
		form: formulario,
		iconTitle: 'edit',
		btnText: 'Modificar',
		btnName: 'btn-update'
	})

	form_modal.addEventListener('submit', e => {
		e.preventDefault()// le quita al formulario el evento por defecto

		let form = Object.fromEntries(new FormData(e.target))// obtiene los valores del formulario 

		const urlParams = new URLSearchParams(form).toString()

		console.log(form)

		// const params = {
		// 	method: 'POST',
		// 	body: JSON.stringify(form),
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// }

		// peticion a la API
		fetchApi2('vehiculo',`update/?${urlParams}`).then(response => {
			console.log(response)

			// muestra el mensaje
			mensajeError(response)
		})
	})	
}

/**
 * 
 * Obtiene la data de la tabla 'vehiculos'
 * 
 * */
async function tablaData() {

	// obtiene todos los vehiculos
	const data = await fetchApi2('vehiculo',`getVehiculos`)
	
	// si la tabla esta vacia
	if (data == false) {
		// remueve la tabla y el buscador
		 buscador.style.display="none"
        div_select_pag.style.display="none"
        contenido_tablas.style.display="none"

		// añade un mensaje
		section_control.append('*No hay Vehiculos ingresados')
	}
	else{
		// le cargo a la variable global los registros
        dataGlobal=data
        
        paginar()
		ordenarTabla(true)

		// inserta la tabla al HTML
		cambiarPagina(page)
		buscadorTabla()
	}
}

/**
 * 
 * Hace la estructura de la tabla y la inserta en el documento
 * 
 * */
function tableStruct(datos) {
	tabla_content.innerHTML=''

	// si no encontro resultados
	if ( datos == false ) {
		tabla_content.innerHTML=`
		<tr>
			<td colspan='8' style='text-align:center'>No se encontraron resultados</td>
		</tr>`
	}
	// si encontro resutados
	else{
		datos.forEach( column =>{

			/*< captuta la plantilla*/
			const tpl = tpl_row_table.content
			/*< clona la plantilla como un nodo completo*/
			const clon = tpl.cloneNode(true);

			let cap = (column.nombre=='Acoplado')? `${column.capacidad} kg` : `${column.capacidad} L` 

			clon.querySelector('.tpl-col-patente').innerHTML = column.patente
			clon.querySelector('.tpl-col-marca').innerHTML = column.marca
			clon.querySelector('.tpl-col-modelo').innerHTML = column.modelo
			clon.querySelector('.tpl-col-anio').innerHTML = column.anio
			clon.querySelector('.tpl-col-vtv').innerHTML = column.vtv
			clon.querySelector('.tpl-col-tara').innerHTML = `${column.tara} kg`
			clon.querySelector('.tpl-col-acoplado').innerHTML = `${column.nombre} - ${cap} (${column.largo}m)`
			clon.querySelector('.btn-edit').onclick = ()=>{editVehiculo(column)};
			clon.querySelector('.btn-delete').onclick = ()=>{deleteVehiculo(column)} 
			
			// inserta el clon en la tabla
			tabla_content.appendChild(clon)
		})
	}
}

/*
 *
 *  Calcula el total de paginas
 *
 **/
function paginar() {
    // calcula el total de paginas
    totalPaginas = Math.ceil(dataGlobal.length / cantidad)
    
    // formateo el select
    select_pag.innerHTML=''

    // carga el total de pag. en el select
    for (let i = 1; i <= totalPaginas; i++){
        const option = document.createElement('option')
        option.innerHTML=i
        
        select_pag.append(option)   
    }
}

/*
 *
 *  Cambia a la siguiente pagina
 *
 **/
btn_next_page.addEventListener('click', e =>{
    if (totalPaginas>1) {
        page++
        
        if (page>totalPaginas) { page=1 }

        cambiarPagina(page)
    }
})

/*
 *
 *  Cambia a la anterior pagina
 *
 **/
btn_last_page.addEventListener('click', e =>{
    if (totalPaginas>1) {
        page--
        
        if (page<1) { page=totalPaginas }

        cambiarPagina(page)
    }
})

/*
 *
 *  Cambia de pagina segun el numero de pagina
 *  @param pageActive int numero de la pagina
 *
 **/
function cambiarPagina(pageActive = 1) {
    select_pag.value=page

    const inicio = (pageActive-1)*cantidad // inicio de la pagina
    const final = inicio+cantidad // final de la pagina
    const contentPagina = dataGlobal.slice(inicio,final) // obtiene los registros de la pagina

    tableStruct(contentPagina)
}

/*
 *
 *	Buscador de la tabla
 *
 **/
function buscadorTabla() {
	buscador.addEventListener('keyup', () => {
		const busqueda=buscador.value.toLowerCase()// obtiene el valor del input

		let resultSearch = [] // carga las coincidencias de la busqueda
		
		// si el input no esta vacio
		if (busqueda) {
			// recorre los registros cargados
			dataGlobal.forEach( column =>{
				const {nombre,marca,patente} = column

				// si encuentra alguna coincidencia
				if (nombre.toLowerCase().startsWith(busqueda) || marca.toLowerCase().startsWith(busqueda) || patente.toLowerCase().startsWith(busqueda)) {
					// carga la columna a un array 
					resultSearch.push(column)
				}
			})

			// muestra el resultado de la busqueda en la tabla
			tableStruct(resultSearch)

			return// termina la ejecucion
		}

		// vuelve a la pagina 1
		cambiarPagina(page)
	})	
}

/*
 *
 *	Ordena la tabla segun la fecha del registro
 *	@param isRecent boolean 
 *
 **/
 function ordenarTabla(isRecent) {
	select_order.value=isRecent

	dataGlobal.sort((a, b) => {
		const dateA = new Date(a.create_at);
	    const dateB = new Date(b.create_at);
	    return isRecent ? dateB - dateA : dateA - dateB;
	});
}
