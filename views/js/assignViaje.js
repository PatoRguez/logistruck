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
 * Formulario Modal para la asignacion de un viaje
 * 
 * */
async function assignViaje() {
	const viajes = await fetchApi2('Viaje','getViajes')
	const vehiculos = await fetchApi2('vehiculo','getVehiculos')

	// carga el formulario
	let formulario = `
		<div class="inputs-group">		
			<div class="inputs all">
				<label for="select_vehiculo">Vehiculo</label>
				<select name="vehiculo" id="select_vehiculo" required>
					<option value="nada" disabled selected>Selecciona un vehiculo</option>
				`;
		
	//FOREACH para recorrer el array y hacer las opciones del select	  
	vehiculos.forEach(({ patente,marca, modelo,anio,nombre,largo,capacidad }) => {
		let cap = (nombre=='Acoplado')? `${capacidad} kg` : `${capacidad} L` 

 		formulario +=`<option value="${patente}" >${marca} ${modelo} (${anio}) - ${nombre} - ${cap} (${largo}m)</option>`;
	});

	formulario+=`
		  		</select>
		  		<span id="msg_error_form_vehiculo" class="msg-error-form"></span>
			</div>
		</div>


		<div class="inputs-group">		
			<div class="inputs all">
				<label for="select_viaje">Viaje</label>
				<select name="viaje" id="select_viaje" required>
					<option value="nada" disabled selected>Selecciona un viaje</option>
				`;
		
	//FOREACH para recorrer el array y hacer las opciones del select	  
	viajes.forEach(({ idViaje, provincia,direccion ,nombre, cantidadCarga, estado}) => {
		if (estado== "disponible") {
 		formulario +=`<option value="${idViaje}" > # ${idViaje} -- ${provincia}, ${direccion}, ${nombre}= ${cantidadCarga} </option>`;
	}
	});

	formulario+=`
		  		</select>
		  		<span id="msg_error_form_viaje" class="msg-error-form"></span>
			</div>
		</div>`
  	
	// crea la alerta con el formulario
	create_modal_form({
		title: "Asignar Viaje",
		form: formulario,
		btnText: 'Asignar',
		btnName: 'btn-update'
	})

	form_modal.addEventListener('submit', e => {
		e.preventDefault()// le quita al formulario el evento por defecto

		let form = new FormData(e.target)// obtiene los valores del formulario 
		// Si no selecciono un vehiculo
		if (form.get('vehiculo')==null) {
			select_vehiculo.style.borderColor='red'
			select_vehiculo.style.boxShadow='0px 0px 5px 1px rgb(255, 0, 0, .5)'	
			msg_error_form_vehiculo.style.paddingBottom='.5rem'
			msg_error_form_vehiculo.innerText="Selecciona un vehiculo"
			return
		}
		select_vehiculo.style='none'
		msg_error_form_vehiculo.style='none'
		msg_error_form_vehiculo.innerHTML=null

		// si no selecciono a un empleado
		if (form.get('viaje')==null) {
			select_viaje.style.borderColor='red'
			select_viaje.style.boxShadow='0px 0px 5px 1px rgb(255, 0, 0, .5)'
			msg_error_form_viaje.style.paddingBottom='.5rem'
			msg_error_form_viaje.innerText="Selecciona un viaje"
			return
		}
		select_viaje.style='none'
		msg_error_form_viaje.style='none'
		msg_error_form_viaje.innerHTML=null

		// parametros de la peticion HTTP a la API
		const optionsRequest = {
			method: 'POST',
			body: form
		}

		// peticion  a la API
		fetchApi2('viaje',`assign`,optionsRequest).then(response => {
			console.log(response)
			page=1

			// muestra el mensaje
			mensajeError(response)
		})
	})
}

/**
 * 
 * Formulario Modal para modificar la asignacion de un viaje
 * 
 * */
async function editAssignViaje({idAViaje,patente,idViaje}) {
	const vehiculos = await fetchApi2('vehiculo','getVehiculos')
	const viajes = await fetchApi2('viaje','getViajes')
	let VehiculoP = patente
	let viajesI = idViaje

	// carga el formulario
	let formulario = `
		<div class="inputs-group">		
			<div class="inputs all">
				<label for="Vehiculo">Vehiculo</label>
				<select name="vehiculo" id="Vehiculo" required>
					<option value="nada" disabled>Selecciona un vehiculo</option>
				`;
		
	//FOREACH para recorrer el array y hacer las opciones del select	  
	vehiculos.forEach(({ patente,marca, modelo,anio,nombre,largo,capacidad }) => {
		let cap = (nombre=='Acoplado')? `${capacidad} kg` : `${capacidad} L` 
		if (VehiculoP == patente) {
	 		formulario +=`<option value="${patente}" selected>${marca} ${modelo} (${anio}) - ${nombre} - ${cap} (${largo}m)</option>`;
		}
		else{
	 		formulario +=`<option value="${patente}" >${marca} ${modelo} (${anio}) - ${nombre} - ${cap} (${largo}m)</option>`;
		}
	});

	formulario+=`
		  		</select>
			</div>
		</div>
		<div class="inputs-group">		
			<div class="inputs all">
				<label for="Viajes">Viajes</label>
				<select name="viaje" id="viaje" required>
					<option value="nada" disabled>Selecciona un viaje</option>
				`;
		
	//FOREACH para recorrer el array y hacer las opciones del select	  
	viajes.forEach(({ idViaje, provincia,direccion ,nombre, cantidadCarga, estado }) => {
		if (viajesI == idViaje) {
 			formulario +=`<option value="${idViaje}" selected    > # ${idViaje} -- ${provincia}, ${direccion}, ${nombre}= ${cantidadCarga} </option>`;
		}
		else{
 			formulario +=`<option value="${idViaje}" > # ${idViaje} -- ${provincia}, ${direccion}, ${nombre}= ${cantidadCarga} </option>`;
		}
	});

	formulario+=`
		  		</select>
		  		<span id="msg_error_form" class="msg-error-form"></span>
			</div>
		</div>
		<input type="hidden" name="id" value="${idAViaje}" />
	`;
  	
	// crea la alerta con el formulario
	create_modal_form({
		title: "Editar Asignación",
		form: formulario,
		iconTitle: 'edit',
		btnText: 'Modificar',
		btnName: 'btn-update'
	})

	form_modal.addEventListener('submit', e => {
		e.preventDefault()// le quita al formulario el evento por defecto

		let form =new FormData(e.target)// obtiene los valores del formulario
		
		// parametros de la peticion HTTP a la API
		const optionsRequest = {
			method: 'POST',
			body: form
		}

		// peticion  a la API
		fetchApi2('viaje',`assignUpdate`,optionsRequest).then(response => {
			console.log(response)

			// muestra el mensaje
			mensajeError(response)
		})
	})
}

/**
 * 
 * Alerta para eliminar un viaje asignado
 * 
 * */
function deleteAssignViaje({idAViaje}) {
	Swal.fire({
		title: "Estas seguro de eliminar esta asignación?!!",
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
				id: idAViaje,
			}).toString()

			fetchApi2('viaje',`assignDelete/?${params}`).then(response=>{
				// muestra en mensaje la respuesta
				mensajeError(response)
			})
		}//Si Presiona el boton 'Si,eliminar!'
	})
}

/**
 * 
 * Obtiene la data de la tabla 'asignarviaje'
 * 
 * */
async function tablaData() {

	// obtiene todos los vehiculos
	const data = await fetchApi2('viaje',`getViajesAsignados`)

	// si la tabla esta vacia
	if (data == false) {
		// remueve la tabla y el buscador
		 buscador.style.display="none"
        div_select_pag.style.display="none"
        contenido_tablas.style.display="none"

		// añade un mensaje
		section_control.append('*No hay Viajes asignados')
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
			clon.querySelector('.tpl-col-vehiculo').innerHTML = `${column.patente}`
			clon.querySelector('.tpl-col-viaje').innerHTML = `${column.idViaje}`
			clon.querySelector('.tpl-col-fecha').innerHTML = `${column.fechaAsignacion}`
			clon.querySelector('.btn-edit').onclick = ()=>{editAssignViaje(column)};
			clon.querySelector('.btn-delete').onclick = ()=>{deleteAssignViaje(column)} 
			
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
				const {patente,idViaje} = column

				// si encuentra alguna coincidencia
				if (patente.toLowerCase().startsWith(busqueda) || idViaje.toLowerCase().startsWith(busqueda) ) {
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
		const [horaA, fechaA] = a.fechaAsignacion.split(' - ');
		const [diaA, mesA, añoA] = fechaA.split('/');
		const dateA = new Date(añoA, mesA - 1, diaA, ...horaA.split(':'));

		const [horaB, fechaB] = b.fechaAsignacion.split(' - ');
		const [diaB, mesB, añoB] = fechaB.split('/');
		const dateB = new Date(añoB, mesB - 1, diaB, ...horaB.split(':'));
	    return isRecent ? dateB - dateA : dateA - dateB;
	});
}