
/**
 * 
 * Trae los datos de los viajes asignados del chofer
 * 
 * */
fetchApi2('viaje','getViajesAsignadosByEmpleado').then( data =>{
	if (data == false) {
	 	viajes_asignados.innerHTML='<div class="msg-viajes">* No hay viajes Asignados</div>'
		viajes_realizados.innerHTML='<div class="msg-viajes">* No hay viajes Realizados</div>'	
	}
	else{
		cardStruct(data)
	}
})



/**
 * 
 * Muestra los viajes asignados del chofer
 * 
 * */
function cardStruct(data) {
	viajes_asignados.innerHTML=''

	if (window.location.pathname=='/tesis/viajesE') {
		viajes_realizados.innerHTML=''
	}
	
	let valVR=true

	let valVA=true
	// Obtener la fecha y hora actuales
	const fechaActual = new Date();

	data.forEach( column =>{
		/*< captuta la plantilla*/
		const tpl = tpl_card.content
		/*< clona la plantilla como un nodo completo*/
		const clon = tpl.cloneNode(true);

		clon.querySelector('.tpl-row-direccion').innerHTML = column.nombre_destino
		clon.querySelector('.tpl-row-fecha').innerHTML = column.fechaSalida
		const varURL = generarLetrasAleatorias(generarNumeroAleatorio(90,100))
		clon.querySelector('div').onclick = ()=>{
			window.location.href=`./infoViaje?${varURL}=${column.idAViaje}`
		}

		// si esta en la vista de 'Mis Viajes' y el estado del viaje es finalizado
		if (window.location.pathname=='/tesis/viajesE' && column.estado=='finalizado') {
			clon.querySelector('.card-viaje').classList.add('fin')
			viajes_realizados.appendChild(clon)
			valVR=false
			return
		}

		// si el estado del viaje es 'asignado'
		if (column.estado=='asignado') {
			valVA=false

			// Crear un objeto Date a partir de la fecha y hora
			const [dia, mes, año] = column.fechaSalida.split('/');
			const fechaSalidaViaje = new Date(año, mes - 1, dia.split(':'));

			// Comparar si la fecha ya ha pasado
			if (fechaSalidaViaje < fechaActual) {
				const params = new URLSearchParams({
					id: column.idViaje,
					estado: 'en proceso'
				})

				// modifica el estado del viaje de asignado a en proceso
			    fetchApi2('viaje',`updateState/?${params}`)
			    clon.querySelector('.card-viaje').classList.add('proc')
			}
			else{
				clon.querySelector('.card-viaje').classList.add('asig')
			}
		}
		
		// si el estado del viaje es 'en proceso'
		if (column.estado=='en proceso') {
			valVA=false
			clon.querySelector('.card-viaje').classList.add('proc')
		}

		// si el estado del viaje es 'remito pendiente'
		if (column.estado=='remito pendiente') {
			valVA=false
			clon.querySelector('.card-viaje').classList.add('rem')
		}

		// inserta el clon en la tabla
		viajes_asignados.appendChild(clon)
	})

	// si no hay viajes asignados
	if (valVA) {
	 	viajes_asignados.innerHTML='<div class="msg-viajes">* No hay viajes Asignados</div>'
	}

	// si no realizo ningun viaje
	if (window.location.pathname=='/tesis/viajesE' && valVR) {
		viajes_realizados.innerHTML='<div class="msg-viajes">* No hay viajes Realizados</div>'	
	}
}
