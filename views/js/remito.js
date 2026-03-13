const search = window.location.search.substring(1).split('=')

// Si no hay un id de referencia
if (search=='') {
	window.location.href='./panel'
}

// Trae los datos del viaje asignado
fetchApi2('viaje',`getViajeAsignadoById/?id=${search[1]}`).then( datos =>{
	tableStruct(datos)
	
	/**
	 * 
	 * Formulario del remito
	 * 
	 * */
	form_remito.addEventListener('submit', e =>{
		e.preventDefault()// quita el evento por defecto

		let form = new FormData(e.target)// obtiene los valores del formulario

		// Carga los valores ya predefinidos
		form.append('idViaje',datos.idViaje)
		form.append('patente',datos.patente)
		form.append('idAcoplado',datos.idAcoplado)
		form.append('idProducto',datos.idProducto)

		console.log(Object.fromEntries(form))

		// parametros de la peticion HTTP a la API
		const params = {
			method: 'POST',
			body: form
		}

		// peticion a la API
		fetchApi2('remito',`insert`,params).then(response => {
			console.log(response)

			// muesra el mensaje
			mensajeBarra(response.error,'success')

			setTimeout(() => {
				let params = new URLSearchParams({
					id: datos.idViaje,
					estado: 'finalizado'
				}).toString()

				fetchApi2('viaje',`updateState/?${params}`).then(response=>{
					window.location.href='./panel'
				})
			}, 500);

		})
	})
})


/**
 * 
 * Estructura de la tabla
 * 
 * */
function tableStruct(data) {

	/*< captuta la plantilla de la card*/
	const tplCard = tpl_card.content
	/*< clona la plantilla como un nodo completo*/
	const card = tplCard.cloneNode(true);

	card.querySelector('.tpl-row-direccion').innerHTML = data.nombre_destino
	card.querySelector('.tpl-row-fecha').innerHTML = data.fechaSalida
	card.querySelector('.card-viaje').classList.add('rem')

	viajes_asignados.append(card)

	// Tractor
	vehiculo.value=`${data.patente} - ${data.marca} ${data.modelo} - ${data.anio}`

	// Trailer
	let cap = (data.nombre=='Acoplado')? `${data.capacidad} kg` : `${data.capacidad} L` 
	acoplado.value=`${data.nombre} - ${cap} (${data.largo}m)`

	// Producto
	producto.value=`${data.nombreProducto}`
}