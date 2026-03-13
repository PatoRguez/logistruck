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
 * Formulario Modal para el ingreso de un producto
 * 
 * */
function addProducto() {

	const formulario=`
		<div class="inputs horizon">
			<label for="nom">Nombre</label>
			<input type="text" name="nombre" id="nom" class="input-error" required>
			<span id="msg_error_form" class="msg-error-form"></span>
		</div>
	`
	// crea la alerta con el formulario
	create_modal_form({
		title: "Agregar Producto",
		form: formulario,
		btnText: 'Agregar',
		btnName: 'btn-insert'
	})

	form_modal.addEventListener('submit', e => {
		e.preventDefault()// le quita al formulario el evento por defecto

		let form = new FormData(e.target)// obtiene los valores del formulario 

		// console.log(form)

		// parametros de la peticion HTTP a la API
		const optionsRequest = {
			method: 'POST',
			body: form
		}

		// peticion a la API
		fetchApi2('producto',`insert`,optionsRequest).then(response => {
			console.log(response)
			page=1
			// muestra el mensaje
			mensajeError(response)
		})
	})
}

/**
 * 
 * Alerta para eliminar un prodcuto
 * 
 * */
function deleteProducto({idProducto}) {
	Swal.fire({
		title: "Estas seguro de eliminar este Producto?!!",
		icon: "warning",
		text: "¡¡No podras revertir esto!!!",
		showCancelButton: true,
		cancelButtonColor: "red",
		confirmButtonText: "Si, eliminar!",
		cancelButtonText: "Cancelar",
		padding:'10px',
	}).then((result)=>{
		if (result.isConfirmed) {//Si Presiona el boton 'Si,eliminar!'

			// parametros
			/*const params={
				id: id,
			}*/

			fetchApi2('producto',`unsubscribe/?id=${idProducto}`).then(data=>{
				mensajeError(data)
			})
		}//Si Presiona el boton 'Si,eliminar!'
	})
}

/**
 * 
 * Formulario Modal para el modificar un producto
 * 
 * */
function editProducto({idProducto,nombre}){
 	const formulario=`
		<div class="inputs horizon">
			<label for="nom">Nombre</label>
			<input type="text" name="nombre" id="nom" class="input-error" value="${nombre}" placeHolder="${nombre}" required>
			<span id="msg_error_form" class="msg-error-form2"></span>
		</div>
		<input type="hidden" name="id" value="${idProducto}">
	`
	// crea la alerta con el formulario
	create_modal_form({
		title: "Editar Producto",
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
		fetchApi2('producto',`update/?${urlParams}`).then(response => {
			console.log(response)

			// muestra el mensaje
			mensajeError(response)
		})
	})
}

/**
 * 
 * Obtiene la data de la tabla 'productos'
 * 
 * */
function tablaData(){

	fetchApi2('producto',`getProductos`).then(data=>{

		// si no hay datos 
		if (data == false) {
			// remueve la tabla y el buscador
			buscador.style.display="none"
			div_select_pag.style.display="none"
			contenido_tablas.style.display="none"
			// muestra mensaje
			section_control.append("* No hay productos Ingresados")
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
	})
}


/**
 * 
 * Hace la estructura de la tabla y la inserta en el documento
 * 
 * */
function tableStruct(info) {

	tabla_content.innerHTML=''
	
	// si no encontro resultados
	if ( info==false ) {
		tabla_content.innerHTML = `
		<tr>
			<td colspan='2' style='text-align:center'>No se encontraron resultados</td>
		</tr>`
	}
	// si encontro resutados
	else{
		// muestra los info en la tabla
		info.forEach( column =>{
			/*< captuta la plantilla*/
			const tpl = tpl_row_table.content
			/*< clona la plantilla como un nodo completo*/
			const clon = tpl.cloneNode(true);

			clon.querySelector('.tpl-col-nom').innerHTML = column.nombre
			clon.querySelector('.btn-edit').onclick = ()=>{editProducto(column)};
			clon.querySelector('.btn-delete').onclick = ()=>{deleteProducto(column)} 

			// inserta el clon en la tabla
			tabla_content.appendChild(clon)
		})	
	}
}

/*
 *
 *	Calcula el total de paginas
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
 *	Cambia a la siguiente pagina
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
 *	Cambia a la anterior pagina
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
 *	Cambia de pagina segun el numero de pagina
 *	@param pageActive int numero de la pagina
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
				const {nombre} = column

				// si encuentra alguna coincidencia
				if (nombre.toLowerCase().startsWith(busqueda)) {
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
		const dateA = a.idProducto;
	    const dateB = b.idProducto;
	    return isRecent ? dateB - dateA : dateA - dateB;
	});
}
