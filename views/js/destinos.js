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
 * Muestra la tabla
 * 
 * */
btn_tabla.addEventListener('click', e=>{
	content_mapa.style.display='none'
	section_control.style.display='flex'
	contenido_tablas.style.display='block'
	page=1
	ordenarTabla(true)
	cambiarPagina(page)
})

/**
 * 
 * Muestra el mapa
 * 
 * */
const btns = document.querySelectorAll('#btn_mapa') 
btns.forEach( item => {
	item.addEventListener('click', e=>{
		section_control.style.display='none'
		contenido_tablas.style.display='none'
		select_provincia.value='nada'
		cargarDepartamentos(select_provincia.value)
		input_direccion.value=' '
		cargarDirecciones(input_direccion.value)
		title_form_destinos.innerText='Buscar Dirección'
		btn_agregar.innerText='Agregar Destino'	
		nombre_destino_div.style.display='none'
		content_mapa.style.display='block'
		crearMapa()
	})
})

// Obtiene todas las provincias de Argentina
georefApi('provincias?orden=id').then( ({provincias}) =>{
	let op='<option value="nada" disabled selected>Selecciona una Provincia</option>'
 	  
	provincias.forEach(({ id,nombre}) => {
        // almacena las provincias
 		op +=`<option>${nombre}</option>`;
	});

	// carga las provincias en el select
	select_provincia.innerHTML=op
})

// Si secciona una provincia carge los departamentos
select_provincia.addEventListener('change', e =>{
	cargarDepartamentos(e.target.value)
})

select_departamento.addEventListener('change', e =>{
	cargarDirecciones(input_direccion.value)
})

// cada que escribe muestra las direcciones que encontro
input_direccion.addEventListener('keyup', e => {
	if (e.target.value) {
		cargarDirecciones(e.target.value)
	}
})

/**
 * 
 * Formulario para el ingreso de un destino
 * 
 * */
form_destinos.addEventListener('submit', e => {
	e.preventDefault()// le quita al formulario el evento por defecto

	let form = new FormData(e.target)// obtiene los valores del formulario 

	// Si no selecciono un provincia
	if (!form.get('provincia')) {
		select_provincia.style.borderColor='red'
		select_provincia.style.boxShadow='0px 0px 5px 1px rgb(255, 0, 0, .5)'	
		msg_error_form_provincia.style.paddingBottom='.5rem'
		msg_error_form_provincia.innerText="Selecciona una provincia"
		return
	}
	select_provincia.style='none'
	msg_error_form_provincia.style='none'
	msg_error_form_provincia.innerHTML=null

	// si no selecciono a un departamento
	if (!form.get('departamento')) {
		select_departamento.style.borderColor='red'
		select_departamento.style.boxShadow='0px 0px 5px 1px rgb(255, 0, 0, .5)'
		msg_error_form_departamento.style.paddingBottom='.5rem'
		msg_error_form_departamento.innerText="Selecciona un departamento"
		return
	}
	select_departamento.style='none'
	msg_error_form_departamento.style='none'
	msg_error_form_departamento.innerHTML=null

	// si no ingreso la direccion de referencia
	if (!form.get('direccion')) {
		input_direccion.style.borderColor='red'
		input_direccion.style.boxShadow='0px 0px 5px 1px rgb(255, 0, 0, .5)'
		msg_error_form_direccion.style.paddingBottom='.5rem'
		msg_error_form_direccion.innerText="Ingresa la direccion de referencia"
		return
	}
	input_direccion.style='none'
	msg_error_form_direccion.style='none'
	msg_error_form_direccion.innerHTML=null

	// si no selecciono a un la direccions
	if (form.get('direccion_exacta')=="nada") {
		select_direccion.style.borderColor='red'
		select_direccion.style.boxShadow='0px 0px 5px 1px rgb(255, 0, 0, .5)'
		msg_error_form_direccion2.style.paddingBottom='.5rem'
		msg_error_form_direccion2.innerText="No se encontro la direccion"
		return
	}
	select_direccion.style='none'
	msg_error_form_direccion2.style='none'
	msg_error_form_direccion2.innerHTML=null

	const formO = Object.fromEntries(form)// convierte el form a un objeto
	const cors = formO.direccion_exacta.split('/')// optiene las coordenadas
	// console.log(cors)

	// marca la direccion en el mapa
	planificarRuta(cors,form) 
})

/**
 * 
 * Alerta para eliminar un destino
 * 
 * */
function deleteDestino({idDestino}) {
	Swal.fire({
		title: "Estas seguro de eliminar este destino?!!",
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
				id: idDestino,
			}).toString()

			fetchApi2('destinos',`unsubscribe/?${params}`).then(response=>{
				// muestra en mensaje la respuesta
				mensajeError(response)
			})
		}//Si Presiona el boton 'Si,eliminar!'
	})
}

/**
 * 
 * Formulario para modificar un destino
 * 
 * */
function editDestino({idDestino,nombre_destino,provincia,departamento,direccion}) {
	select_provincia.value=provincia

	cargarDepartamentos(provincia)

	setTimeout(()=>{
		select_departamento.value=departamento 	
	},900)
	
	input_direccion.value=direccion

	setTimeout(()=>{
		cargarDirecciones(direccion)
	},900)

	id_destino.value=idDestino
	nombre_destino_input.value=nombre_destino

	// Cambia a la vista del mapa
	section_control.style.display='none'
	contenido_tablas.style.display='none'
	title_form_destinos.innerText='Modificar Destino'
	btn_agregar.innerText='Modificar Destino'
	nombre_destino_div.style.display='block'
	content_mapa.style.display='block'
	crearMapa()
}

/**
 * 
 * Obtiene la data de la tabla 'asignarvehiculo'
 * 
 * */
async function tablaData() {

	// obtiene todos los vehiculos
	const data = await fetchApi2('destinos',`getDestinos`)
	
	// si la tabla esta vacia
	if (data == false) {
		// remueve la tabla y el buscador
		 buscador.style.display="none"
        div_select_pag.style.display="none"
        contenido_tablas.style.display="none"

		// añade un mensaje
		section_control.append('*No hay Destinos ingresados')
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

// Diseño del icono
let destinoIcon = L.icon({
	iconUrl: 'views/img/system/destino.png',
	iconSize: [24,24]
})

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

	    
			const minutos = Math.floor(column.tiempo_recorrido / 60);
			const horas = Math.floor(minutos / 60);

			clon.querySelector('.tpl-col-nombre').innerHTML = column.nombre_destino
			clon.querySelector('.tpl-col-provincia').innerHTML = column.provincia
			clon.querySelector('.tpl-col-departamento').innerHTML = column.departamento
			clon.querySelector('.tpl-col-direccion').innerHTML = column.direccion
			clon.querySelector('.tpl-col-kmRecorridos').innerHTML = `${column.km_recorridos} km`
			clon.querySelector('.tpl-col-tiempo').innerHTML = (horas==0)? `${minutos%60} min` : `${horas} h ${minutos%60} min`

			marcarMapa([column.latitud,column.longitud],`<h2>${column.nombre_destino}</h2>`,{ icon: destinoIcon})

			clon.querySelector('.btn-edit').onclick = ()=>{editDestino(column)};
			clon.querySelector('.btn-delete').onclick = ()=>{deleteDestino(column)} 
			
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
				const {direccion,nombre_destino,provincia,departamento} = column

				// si encuentra alguna coincidencia
				if (direccion.toLowerCase().startsWith(busqueda) || nombre_destino.toLowerCase().startsWith(busqueda) || provincia.toLowerCase().startsWith(busqueda) || departamento.toLowerCase().startsWith(busqueda)) {
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
		const dateA = a.idDestino;
	    const dateB = b.idDestino;
	    return isRecent ? dateB - dateA : dateA - dateB;
	});
}


/**
 * 
 * Carga los departamentos de un provincia seleccionada en el select
 * 
 * */
async function cargarDepartamentos(provincia) {
	// optiene los departamentos segun la provincia
	const {departamentos} = await georefApi(`departamentos?provincia=${provincia}&max=300&orden=id`)

	let opciones = '<option value="nada" disabled selected>Selecciona un departamento</option>';

	departamentos.forEach(({ id, nombre }) => {
 		opciones+=`<option> ${nombre}</option>`;
	});

	select_departamento.innerHTML=opciones
}

/**
 * 
 * Carga las direcciones de una direccion de referencia en un select
 * 
 * */
async function cargarDirecciones(direccionB) {

	const params = new URLSearchParams({
		direccion: direccionB, 
		provincia: select_provincia.value,
		departamento: select_departamento.value,
		max: 10,
	}).toString()

	const {direcciones} = await georefApi(`direcciones?${params}`)
	// console.log(direcciones)

	let opciones3;// = '<option value="nada" disabled selected>Selecciona una localidad</option>';

	if (direcciones.length==0) {
		opciones3="<option value='nada'>No se encontro la direccion</option>"
	}

	direcciones.forEach(({ ubicacion, nomenclatura }) => {
 		opciones3+=`<option value="${ubicacion.lat}/${ubicacion.lon}/${nomenclatura}"> ${nomenclatura}</option>`;
	});

	select_direccion.innerHTML=opciones3
}
