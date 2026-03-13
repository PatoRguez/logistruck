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
 * Formulario Modal para el ingreso de un acoplado
 * 
 * */
async function addAcoplado() {

	const tiposAcoplados = await fetchApi2('Acoplado','getTipoAcoplados')
	let formulario=`
		<span id="msg_error_form" class="msg-error-form2"></span>
		<div class="inputs horizon">
			<label for="tipo">Tipo</label>
			<select  name="tipoAcoplado" id="tipo" class="input-error" required>`

	//FOREACH para recorrer el array y hacer las opciones del select
	tiposAcoplados.forEach(({idTipo,nombre}) => {
		formulario+=`<option value="${idTipo}">${nombre}</option>`
	});//FOREACH para recorrer el array y hacer las opciones del select	

	formulario+=`
			</select>
		</div>
		<div class="inputs horizon">
			<label for="capa">Capacidad</label>
			<input type="number" step="0.01" name="capacidad" id="capa" class="input-error" min="1" required>
		</div>
		<div class="inputs horizon">
			<label for="eje">Cantidad de Ejes</label>
			<input type="number" name="cantidadEjes" id="eje" class="input-error" min="1" required>
		</div>
		<div class="inputs horizon">
			<label for="lar">Largo</label>
			<input type="number" min="1" max="99999999" step="0.01" name="largo" id="lar" class="input-error" required>
		</div>
	`

	// crea la alerta con el formulario
	create_modal_form({
		title: "Agregar Acoplado",
		form: formulario,
		btnText: 'Agregar',
		btnName: 'btn-insert'
	})	

	form_modal.addEventListener('submit', e => {
		e.preventDefault()// le quita al formulario el evento por defecto

		let form = new FormData(e.target)// obtiene los valores del formulario 

		// parametros de la peticion HTTP a la API
		const params = {
			method: 'POST',
			body: form
		}

		// peticion a la API
		fetchApi2('acoplado',`insert`,params).then(response => {
			console.log(response)
			page=1
			// muesra el mensaje
			mensajeError(response)
		})
	})

}

/**
 * 
 * Alerta para eliminar un acoplado
 * 
 * */
function deleteAcoplado({idAcoplado}) {
	Swal.fire({
		title: "Estas seguro de eliminar este Acoplado?!!",
		icon: "warning",
		text: "¡¡No podras revertir esto!!!",
		showCancelButton: true,
		cancelButtonColor: "red",
		confirmButtonText: "Si, eliminar!",
		cancelButtonText: "Cancelar",
		padding:'10px',
	}).then((result)=>{
		if (result.isConfirmed) {//Si Presiona el boton 'Si,eliminar!'

			let params = new URLSearchParams({
				id: idAcoplado,
			}).toString()

			fetchApi2('Acoplado',`unsubscribe/?${params}`).then(response=>{
				// muestra en mensaje la respuesta
				mensajeError(response)
			})
		}//Si Presiona el boton 'Si,eliminar!'
	})
}

/**
 * 
 * Formulario Modal para modificar un producto
 * 
 * */
async function editAcoplado({idAcoplado,idTipo,nombre,capacidad,cantEjes,largo}) {

	const tiposAcoplados = await fetchApi2('acoplado','getTipoAcoplados')
	let tipo = idTipo

	let formulario=`
		<span id="msg_error_form" class="msg-error-form2"></span>
		<div class="inputs horizon">
			<label for="tipo">Tipo</label>
			<select  name="tipoAcoplado" id="tipo" class="input-error" required>`

	//FOREACH para recorrer el array y hacer las opciones del select
	tiposAcoplados.forEach(({idTipo,nombre}) => {
		if (tipo == idTipo) {//If para selecionar el tipoacopladoque ingreso
			formulario+=`<option value="${idTipo}" selected>${nombre}</option>`
		}//If para selecionar el tipoacopladoque ingreso
		else{
			formulario+=`<option value="${idTipo}">${nombre}</option>`
		}
	});//FOREACH para recorrer el array y hacer las opciones del select	

	formulario+=`
			</select>
		</div>
		<div class="inputs horizon">
			<label for="capa">Capacidad</label>
			<input type="number" value="${capacidad}" step="0.01" name="capacidad" id="capa" class="input-error" min="1" required>
		</div>
		<div class="inputs horizon">
			<label for="eje">Cantidad de Ejes</label>
			<input type="number" value="${cantEjes}" name="cantidadEjes" id="eje" class="input-error" min="1" required>
		</div>
		<div class="inputs horizon">
			<label for="lar">Largo</label>
			<input type="number" value="${largo}" min="1" max="99999999" step="0.01" name="largo" id="lar" class="input-error"  required>
		</div>
		<input type="hidden" name="id" value="${idAcoplado}">
	`

	// crea la alerta con el formulario
	create_modal_form({
		title: "Editar Acoplado",
		form: formulario,
		iconTitle: 'edit',
		btnText: 'Modificar',
		btnName: 'btn-update'
	})	

	form_modal.addEventListener('submit', e => {
		e.preventDefault()// le quita al formulario el evento por defecto

		let form = Object.fromEntries(new FormData(e.target))// obtiene los valores del formulario

		const urlParams = new URLSearchParams(form).toString()

		// console.log(form)

		// const params = {
		// 	method: 'POST',
		// 	body: JSON.stringify(form),
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// }

		// peticion a la API
		fetchApi2('acoplado',`update/?${urlParams}`).then(response => {
			console.log(response)

			// muestra el mensaje
			mensajeError(response)
		})
	})	

}

/**
 * 
 * Obtiene la data de la tabla 'acoplado'
 * 
 * */
async function tablaData() {

	const data = await fetchApi2('Acoplado',`getAcoplados`)

	// si la tabla esta vacia
	if (data == false) {
		buscador.style.display="none"
		div_select_pag.style.display="none"
		contenido_tablas.style.display="none"

		// añade un mensaje
		section_control.append("* No hay Acoplados Ingresados")
	}
	else{
        // le cargo a la variable global los registros
        dataGlobal=data
        
        paginar()
		ordenarTabla(true)

		if (data.length == 1) {
			buscador.style.display="block"
			div_select_pag.style.display="block"
			contenido_tablas.style.display="block"
		}

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
	// console.log(datos)
	tabla_content.innerHTML=''
	
	// si no encontro resultados
	if ( datos == false ) {
		tabla_content.innerHTML = `
		<tr>
			<td colspan='6' style='text-align:center'>No se encontraron resultados</td>
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

			clon.querySelector('.tpl-col-tipoA').innerHTML = column.nombre
			clon.querySelector('.tpl-col-capa').innerHTML = cap
			clon.querySelector('.tpl-col-ejes').innerHTML = column.cantEjes
			clon.querySelector('.tpl-col-largo').innerHTML = `${column.largo}m`
			clon.querySelector('.btn-edit').onclick = ()=>{editAcoplado(column)};
			clon.querySelector('.btn-delete').onclick = ()=>{deleteAcoplado(column)} 

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
				const {nombre,cantEjes,capacidad} = column

				// si encuentra alguna coincidencia
				if (nombre.toLowerCase().startsWith(busqueda) || cantEjes.toLowerCase().startsWith(busqueda) || capacidad.toLowerCase().startsWith(busqueda)) {
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
		const dateA = a.idAcoplado;
	    const dateB = b.idAcoplado;
	    return isRecent ? dateB - dateA : dateA - dateB;
	});
}
