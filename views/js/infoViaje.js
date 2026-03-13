const search = window.location.search.substring(1).split('=')

// Si no hay un id de referencia
if (search=='') {
	window.location.href='./panel'
}

// Trae los datos del viaje asignado
fetchApi2('viaje',`getViajeAsignadoById/?id=${search[1]}`).then( datos =>{
	tableStruct(datos)
})

/**
 * 
 * Estructura de la tabla
 * 
 * */
function tableStruct(data) {
	if (data == false) {
		table_vehiculo.style.display='none'
		msg_section_error.innerHTML=`
		<div class="msg-viajes">* No tienes ningun vehículo asignado</div> 
		`
		return
	}


	/*< captuta la plantilla de la card*/
	const tplCard = tpl_card.content
	/*< clona la plantilla como un nodo completo*/
	const card = tplCard.cloneNode(true);

	card.querySelector('.tpl-row-direccion').innerHTML = data.nombre_destino
	card.querySelector('.tpl-row-fecha').innerHTML = data.fechaSalida

	switch(data.estado){
		case 'asignado':
			card.querySelector('.card-viaje').classList.add('asig')
			table_head_viaje.classList.add('asig')
			table_head_producto.classList.add('asig')
			table_head_vehiculo.classList.add('asig')
		break
		case 'en proceso':
			card.querySelector('.card-viaje').classList.add('proc')
			table_head_viaje.classList.add('proc')
			table_head_producto.classList.add('proc')
			table_head_vehiculo.classList.add('proc')
		break
		case 'remito pendiente':
			card.querySelector('.card-viaje').classList.add('rem')
			table_head_viaje.classList.add('rem')
			table_head_producto.classList.add('rem')
			table_head_vehiculo.classList.add('rem')
		break
		case 'finalizado':
			card.querySelector('.card-viaje').classList.add('fin')
			table_head_viaje.classList.add('fin')
			table_head_producto.classList.add('fin')
			table_head_vehiculo.classList.add('fin')
		break
	}

	viajes_asignados.append(card)

	/*< captuta la plantilla de la tabla*/
	const tpl = tpl_row_table.content

	/*< clona la plantilla como un nodo completo*/
	const tplDestino = tpl.cloneNode(true);
	const tplProvincia = tpl.cloneNode(true);
	const tplFechaS = tpl.cloneNode(true);
	const tplFechaL = tpl.cloneNode(true);
	const tplKm = tpl.cloneNode(true);
	const tplTiempo = tpl.cloneNode(true);

	tplDestino.querySelector('th').innerHTML = 'Destino'
	tplDestino.querySelector('td').innerHTML = `${data.direccion}, ${data.departamento}`

	tplProvincia.querySelector('th').innerHTML = 'Provincia'
	tplProvincia.querySelector('td').innerHTML = data.provincia

	tplFechaS.querySelector('th').innerHTML = 'fecha de salida'
	tplFechaS.querySelector('td').innerHTML = data.fechaSalida

	tplFechaL.querySelector('th').innerHTML = 'fecha estimada de llegada'
	tplFechaL.querySelector('td').innerHTML = data.fechaLlegada

	tplKm.querySelector('th').innerHTML = 'km recorrido'
	tplKm.querySelector('td').innerHTML = `${data.km_recorridos} km`

	const minutos = Math.floor(data.tiempo_recorrido / 60);
	const horas = Math.floor(minutos / 60);

	tplTiempo.querySelector('th').innerHTML = 'tiempo estimado'
	tplTiempo.querySelector('td').innerHTML = (horas==0)? `${minutos%60} min` : `${horas} h ${minutos%60} min`

	// insert las filas en la tabla Viaje
	table_content_viaje.append(tplDestino,tplProvincia,tplFechaS,tplFechaL,tplKm,tplTiempo)

	/*< clona la plantilla como un nodo completo*/
	const tplProducto = tpl.cloneNode(true);
	const tplCantidad = tpl.cloneNode(true);	

	tplProducto.querySelector('th').innerHTML = 'nombre'
	tplProducto.querySelector('td').innerHTML = data.nombreProducto


	let cant = (data.nombre=='Acoplado')? `${data.cantidadCarga} kg` : `${data.cantidadCarga} L` 

	tplCantidad.querySelector('th').innerHTML = 'cantidad'
	tplCantidad.querySelector('td').innerHTML = cant

	// insert las filas en la tabla Viaje
	table_content_producto.append(tplProducto,tplCantidad)

	/*< clona la plantilla como un nodo completo*/
	const tplPatente = tpl.cloneNode(true);
	const tplMarca = tpl.cloneNode(true);
	const tplModelo = tpl.cloneNode(true);
	const tplAcoplado = tpl.cloneNode(true);
	const tplCAcoplado = tpl.cloneNode(true);
	const tplLAcoplado = tpl.cloneNode(true);
	const tplEAcoplado = tpl.cloneNode(true);

	tplPatente.querySelector('th').innerHTML = 'patente'
	tplPatente.querySelector('td').innerHTML=data.patente

	tplMarca.querySelector('th').innerHTML = 'marca'
	tplMarca.querySelector('td').innerHTML=data.marca

	tplModelo.querySelector('th').innerHTML = 'modelo'
	tplModelo.querySelector('td').innerHTML=data.modelo

	tplAcoplado.querySelector('th').innerHTML = 'tipo de acoplado'
	tplAcoplado.querySelector('td').innerHTML=data.nombre

	let cap = (data.nombre=='Acoplado')? `${data.capacidad} kg` : `${data.capacidad} L` 

	tplCAcoplado.querySelector('th').innerHTML = 'capacidad de acoplado'
	tplCAcoplado.querySelector('td').innerHTML = cap

	tplLAcoplado.querySelector('th').innerHTML = 'largo del acoplado'
	tplLAcoplado.querySelector('td').innerHTML = `${data.largo} m`

	tplEAcoplado.querySelector('th').innerHTML = 'cant. de ejes del acoplado'
	tplEAcoplado.querySelector('td').innerHTML = `${data.cantEjes}`

	// insert las filas en la tabla vehiculo
	table_content_vehiculo.append(tplPatente,tplMarca,tplModelo,tplAcoplado,tplCAcoplado,tplLAcoplado,tplEAcoplado)

	// si el estado del viaje esta en proceso 
	if (data.estado=='en proceso') {
		// aparesca el btn de finalizar viaje
		box_btn.innerHTML=`
			<button class="btn" id="btn_finalizar">
				Finalizar Viaje
			</button>`

		btn_finalizar.addEventListener('click', e=>{
			e.preventDefault()

			Swal.fire({
				title: "¡¡Estas seguro de finalizar el viaje?!!!",
				icon: "warning",
				showCancelButton: true,
				cancelButtonColor: "red",
				confirmButtonText: "Si, finalizar",
				cancelButtonText: "Cancelar",
				padding:'10px',
			}).then((result)=>{
				if (result.isConfirmed) {//Si Presiona el boton 'Si, finalizar!'

					let params = new URLSearchParams({
						id: data.idViaje,
						estado: 'remito pendiente'
					}).toString()

					fetchApi2('viaje',`updateState/?${params}`).then(response=>{
						window.location.href='./panel'
					})
				}//Si Presiona el boton 'Si, finalizar!'
			})
		})
	}

	// si el estado del viaje esta en finalizado
	if (data.estado=="remito pendiente") {
		// aparesca el btn de realizar remito
		box_btn.innerHTML=`
			<button class="btn" id="btn_remito">
				Realizar Remito
			</button>`

			btn_remito.addEventListener('click', e=>{
				e.preventDefault()	

				const varURL = generarLetrasAleatorias(generarNumeroAleatorio(90,100))

				window.location.href=`./remito?${varURL}=${search[1]}`
			})
	}
}
