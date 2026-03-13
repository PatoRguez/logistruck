crearMapa()

// Trae todos los viajes registrados, de la api
fetchApi2('viaje','getViajes').then(data=>{
	console.log(data)
	viewViajes(data)
})

fetchApi2('informe','getInformes').then( data =>{
	console.log(data)
	viewReportes(data)
})


// Diseño icono de viaje sin asignar
let viajeSIcon = L.icon({
	iconUrl: 'views/img/system/viaje3.svg',
	iconSize: [24,24]
})
// Diseño icono de viaje asignado
let viajeAIcon = L.icon({
	iconUrl: 'views/img/system/viaje2.svg',
	iconSize: [24,24]
})
// Diseño icono de viaje en proceso
let viajePIcon = L.icon({
	iconUrl: 'views/img/system/truck-speed.svg',
	iconSize: [30,30]
})
// Diseño icono de viaje remito pendiente
let viajeRPIcon = L.icon({
	iconUrl: 'views/img/system/remito.svg',
	iconSize: [24,24]
})
// Diseño icono de viaje finalizado
let viajeFIcon = L.icon({
	iconUrl: 'views/img/system/viaje-check.svg',
	iconSize: [30,30]
})

/**
 * 
 * Marca en el mapa los viajes registrados
 * 
 * */
function viewViajes(datos) {
	let icono = { icon: '' }
	let sumV=[0,0,0,0,0]

	if (datos != false) {
		// Obtener la fecha y hora actuales
		const fechaActual = new Date();

		datos.forEach(column => {

			if (column.estado == 'disponible') { icono.icon = viajeSIcon; sumV[0]++ }
			if (column.estado == 'asignado') { 
				const [hora, fecha] = column.fechaSalida.split(' - ');

				// Crear un objeto Date a partir de la fecha y hora
				const [dia, mes, año] = fecha.split('/');
				const fechaSalidaViaje = new Date(año, mes - 1, dia, ...hora.split(':'));

				// Comparar si la fecha ya ha pasado
				if (fechaSalidaViaje < fechaActual) {
					const params = new URLSearchParams({
						id: column.idViaje,
						estado: 'en proceso'
					})

					// modifica el estado del viaje de asignado a en proceso
				    fetchApi2('viaje',`updateState/?${params}`)

				    icono.icon = viajePIcon
				    sumV[2]++
				}
				else{
					icono.icon = viajeAIcon; 
					sumV[1]++ 
				}

			}
			if (column.estado == 'en proceso') { icono.icon = viajePIcon; sumV[2]++ }
			if (column.estado == 'remito pendiente') { icono.icon = viajeRPIcon; sumV[3]++ }
			if (column.estado == 'finalizado') { icono.icon = viajeFIcon; sumV[4]++ }


			marcarMapa(
				[column.latitud,column.longitud],
				`<h2>${column.nombre_destino}, ${column.provincia}</h2>
				<b>Dirección</b>: ${column.direccion}, ${column.departamento} <br/>
				<b>Producto</b>: ${column.nombre} - ${column.cantidadCarga} lt
				`,
				icono
			)
		})	
	}

	viaje_sa_cant.innerHTML = sumV[0]
	viaje_as_cant.innerHTML = sumV[1]
	viaje_ep_cant.innerHTML = sumV[2]
	viaje_rp_cant.innerHTML = sumV[3]
	viaje_fi_cant.innerHTML = sumV[4]
}

/**
 * 
 * Inserta en el documento los informes Cargados
 * 
 * */
function viewReportes(datos) {
	
	// si no hay reportes
	if (datos==false) {
		reportes.innerHTML='<div class="msg-viajes">* no se enviaron reportes</div>'
		return
	}

	datos.forEach( column => {
		/*< captuta la plantilla*/
		const tpl = tpl_card_informe.content
		/*< clona la plantilla como un nodo completo*/
		const clon = tpl.cloneNode(true);

		clon.querySelector('img').src = column.foto
		clon.querySelector('span').innerHTML = column.empleado
		clon.querySelector('b').innerHTML = 'Ha enviado un informe de un vehiculo'
		clon.querySelector('p').innerHTML = column.descripcion
		clon.querySelector('.fecha').innerHTML = column.fecha
		
		const varURL = generarLetrasAleatorias(generarNumeroAleatorio(90,100))

		clon.querySelector('.card-informe').onclick = ()=>{
			window.location.href=`./informe?${varURL}=${column.idInforme}`
		}

		// si el informe fue visto o leido
		if (column.estado) {
			// le agrega el estilo de leido
			clon.querySelector('.card-informe').classList.add('card-leida')
		}

		// inserta el clon en el elemento id 'reportes'
		reportes.append(clon)
	})
}