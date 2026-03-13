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
 * Formulario Modal para el ingreso de un Viaje
 * 
 * */
async function addViajes() {
	const destinos = await fetchApi2('destinos', 'getDestinos')

	const productos = await fetchApi2('producto', 'getProductos')
	
	let formulario=`
		<div class="inputs all">
			<label for="destinos">Destino</label>
			<select name="idDestino" id="destinos" required>`
	
		//FOREACH para recorrer el array y hacer las opciones del select	  
		destinos.forEach(({ idDestino, direccion, provincia }) => {
			formulario +=`<option value="${idDestino}"> ${direccion}, ${provincia} </option>`;
		}); //FOREACH para recorrer el array y hacer las opciones del select

	formulario+=`
			</select>
	<div class="inputs-group">
		<div class="inputs ">
			<label for="producto">Producto</label>
			<select name="idProducto" id="producto" required>`
	
		//FOREACH para recorrer el array y hacer las opciones del select	  
		productos.forEach(({ idProducto, nombre }) => {
			formulario +=`<option value="${idProducto}"> ${nombre}</option>`;
		}); //FOREACH para recorrer el array y hacer las opciones del select

	formulario+=`
			</select>
		</div>
		<div class="inputs">
			<label for="can">Cantidad</label>
			<input type="number"  name="cantidad" id="can" min="1" required/>
		</div>
	</div>



	<div class="inputs-group">
		<div class="inputs">
			<label for="FechS">Fecha de Salida</label>
			<input type="datetime-local" name="fechaSalida" id="FechS" required/>
		</div>
		<div class="inputs">
				<label for="FechL">Fecha de Llegada</label>
				<input type="datetime-local" name="fechaLlegada" id="FechL" required/>
			</div>
		</div>
	</div>



	`

	// crea la alerta con el formulario
	create_modal_form({
		title: "Agregar Viaje",
		form: formulario,
		btnText: 'Agregar',
		btnName: 'btn-insert'
	})

	form_modal.addEventListener('submit', e => {
		e.preventDefault()

		let form = new FormData(e.target)

		console.log(form)

		const optionsRequest = {
			method: 'POST',
			body: form
		}

		fetchApi2('viaje',`insert`,optionsRequest).then(response => {
			console.log(response)
			page=1
			mensajeError(response)
		})
	})
}
 
/**
 * 
 * Alerta para eliminar un viaje
 * 
 * */
function deleteViajes(id) {
	Swal.fire({
	  title: "Estas seguro de eliminar este Viaje?!!",
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
				id: id,
			}).toString()

			fetchApi2('viaje', `unsubscribe/?${params}`).then(response => {
				mensajeError(response)
			})

	  	} //Si Presiona el boton 'Si,eliminar!'
	});
}

/**
 * 
 * Formulario Modal para modificar un viaje
 * 
 * */
async function editViaje(id,direccion,provincia,cantidadCarga,fechaLlegada,fechaSalida,nombre,estado) {

	const destinos = await fetchApi2('destinos', 'getDestinos')
	const productos = await fetchApi2('producto', 'getProductos')

	let formulario=`
	<div class="inputs-group">
		<div class="inputs ">
			<label for="destinos">Destino</label>
			<select name="idDestino" id="destinos" required>`
	
		//FOREACH para recorrer el array y hacer las opciones del select	  
		destinos.forEach(({ idDestino, direccion, provincia }) => {
			formulario +=`<option value="${idDestino}"> ${direccion} ${provincia} </option>`;
		}); //FOREACH para recorrer el array y hacer las opciones del select

	formulario+=`
			</select>
		</div>


		<div class="inputs ">
			<label for="producto">Producto</label>
			<select name="idProducto" id="producto" required>`
	
	//FOREACH para recorrer el array y hacer las opciones del select	  
	productos.forEach(({ idProducto, nombre }) => {
		formulario +=`<option value="${idProducto}"> ${nombre}</option>`;
	}); //FOREACH para recorrer el array y hacer las opciones del select


	const [horaS, fechaS] = fechaSalida.split(' - ');
	// Crear un objeto Date a partir de la fecha y hora
	const [diaS, mesS, añoS] = fechaS.split('/');
	const fechaSalidaViaje = formatearFecha(new Date(añoS, mesS - 1, diaS, ...horaS.split(':')));
	
	const [horaL, fechaL] = fechaLlegada.split(' - ');
	// Crear un objeto Date a partir de la fecha y hora
	const [diaL, mesL, añoL] = fechaL.split('/');
	const fechaLlegadaViaje = formatearFecha(new Date(añoL, mesL - 1, diaL, ...horaL.split(':')));
	
	formulario+=`
			</select>
		</div>
	</div>

	<input type="hidden" name="id" value="${id}">

	<div class="inputs-group">
		<div class="inputs">
			<label for="can">Cantidad</label>
			<input type="text"  name="cantidad" id="can" value="${cantidadCarga}" required/>
		</div>
		<div class="inputs">
			<label for="FechS">Fecha de Salida</label>
			<input type="datetime-local" name="fechaSalida" id="FechS" value="${fechaSalidaViaje}" required/>
		</div>
	</div>

	<div class="inputs">
			<label for="FechL">Fecha de Llegada</label>
			<input type="datetime-local" name="fechaLlegada" id="FechL" value="${fechaLlegadaViaje}" required/>
		</div>
	</div>


	`

	// crea la alerta con el formulario
	create_modal_form({
		title: "Editar Viaje",
		form: formulario,
		iconTitle: 'edit',
		btnText: 'Modificar',
		btnName: 'btn-update'
	})

	form_modal.addEventListener('submit', e => {
		e.preventDefault()

		let form = Object.fromEntries(new FormData(e.target))

		const urlParams = new URLSearchParams(form).toString()
   
		console.log(form)

		// const params = {
		// 	method: 'POST',
		// 	body: JSON.stringify(form),
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// }

		fetchApi2('Viaje',`update/?${urlParams}`).then(response => {
			console.log(response)

			mensajeError(response)
		})
	})	
}

/**
 * 
 * Obtiene la data de la tabla 'viajes'
 * 
 * */
async function tablaData() {

	// obtiene todos los vehiculos
	const data = await fetchApi2('viaje',`getViajes`)

	// si la tabla esta vacia
	if (data == false) {
		// remueve la tabla y el buscador
		buscador.style.display="none"
		div_select_pag.style.display="none"
		contenido_tablas.style.display="none"
		// muestra mensaje
		section_control.append("* No hay Viajes Ingresados")
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
		datos.forEach( ({idViaje,direccion,provincia,cantidadCarga,fechaLlegada,fechaSalida,nombre,estado}) =>{

			/*< captuta la plantilla*/
			const tpl = tpl_row_table.content
			/*< clona la plantilla como un nodo completo*/
			const clon = tpl.cloneNode(true);
             
			clon.querySelector('.tpl-col-numViaje').innerHTML = idViaje
			clon.querySelector('.tpl-col-destino').innerHTML = `${direccion} ${provincia}`
			clon.querySelector('.tpl-col-producto').innerHTML = nombre
			clon.querySelector('.tpl-col-cantidad').innerHTML = cantidadCarga
			clon.querySelector('.tpl-col-fechaSalida').innerHTML = fechaSalida
			clon.querySelector('.tpl-col-fechaLlegada').innerHTML = fechaLlegada
			clon.querySelector('.tpl-col-estado').innerHTML = estado
			if (estado=="disponible") clon.querySelector('.tpl-col-estado').style.backgroundColor='grey'
			if (estado=="asignado") clon.querySelector('.tpl-col-estado').style.backgroundColor='blue'
			if (estado=="en proceso") clon.querySelector('.tpl-col-estado').style.backgroundColor='yellow'
			if (estado=="remito pendiente") clon.querySelector('.tpl-col-estado').style.backgroundColor='orange'
			if (estado=="finalizado") clon.querySelector('.tpl-col-estado').style.backgroundColor='green'
			
			clon.querySelector('.btn-edit').onclick = ()=>{editViaje(idViaje, direccion,provincia,cantidadCarga,fechaLlegada,fechaSalida,nombre)};
			clon.querySelector('.btn-delete').onclick = ()=>{deleteViajes(idViaje)} 

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
				const {direccion,nombre,provincia,cantidadCarga} = column

				// si encuentra alguna coincidencia
				if (direccion.toLowerCase().startsWith(busqueda) || nombre.toLowerCase().startsWith(busqueda) || provincia.toLowerCase().startsWith(busqueda) || cantidadCarga.toLowerCase().startsWith(busqueda)) {
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
		const dateA = a.idViaje;
	    const dateB = b.idViaje;
	    return isRecent ? dateB - dateA : dateA - dateB;
	});
}

/*
 *
 *	Formatea una fecha(Fri Nov 01 2024 00:29:00 GMT-0300 (hora estándar de Argentina)) 
 *	a yyyy-MM-ddThh:mm
 *
 **/
const formatearFecha = (fecha) => {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const dia = String(fecha.getDate()).padStart(2, '0');
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${anio}-${mes}-${dia}T${horas}:${minutos}`;
};