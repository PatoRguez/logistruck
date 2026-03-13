
// inicializa el mapa
let map = L.map('mapa')

let marcador;

let camionMarcador

let routing

// Diseño del icono
let truckIcon = L.icon({
	iconUrl: 'views/img/system/truck.svg',
	iconSize: [24,24]
})

// muestro una posicion
// map.fitWorld();
function crearMapa() {
	if (routing) { 
		routing.remove() 
		camionMarcador.remove() 
	}

	map.setView([-36.6773920760823,-60.5584771084959],5)

	// agrego las licencias
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '© OpenStreetMap'
	}).addTo(map);

}
	

// // Evento click en el mapa
// map.on('click', e => {
// 	// console.log(e)

// 	// marca la posicion clikeada
// 	L.marker(e.latlng).addTo(map)
// })

function marcarMapa(cords,text,icon=null,view=false) {

	// Marcador del mapa
	marcador = L.marker(cords,icon).bindPopup(text).addTo(map)

	if (view) {
		// modifica la vista
		map.setView(cords,13)	
	}
}

function eliminarMarcador() {
	// si ya existe un marcador 
	if (marcador) {
		// lo elimine
		marcador.remove()
	}
}


function planificarRuta(destino,form2 = null) {	
	let valAdd=true// valida si toca btn agregar o destino
	
	// console.log("sa")
	let  inicio = [-34.46671168421835, -58.75571687644475]
	// Marcador del mapa

	if (routing) {
		routing.remove()
	}

	if (camionMarcador) {
		camionMarcador.remove()
	}
	
	camionMarcador = L.marker(inicio, { icon: truckIcon }).addTo(map)
	// ruta 
 	routing	= L.Routing.control({
		waypoints: [
			L.latLng(inicio),// inicio
			L.latLng(destino)// saLida
		],
        draggableWaypoints: false,
   		language: 'es', // Cambiar 'es' por el código de idioma deseado
	}).on('routesfound',e =>{// si funciona el ruteo
		// console.log(e.routes[0].summary)

		// si hace click en el boton enviar
		btn_agregar.addEventListener('click', eb=>{
			eb.preventDefault()// le quita el evento por defecto al btn

			//si presiono el btn ver en mapa
			if (valAdd) {
				msg_destino.innerText=''
				valAdd=false

				form2.append('latitud',destino[0])
				form2.append('longitud',destino[1])
				form2.append('tiempo', e.routes[0].summary.totalTime)
				form2.append('km', e.routes[0].summary.totalDistance)
				const nomenclatura = destino[2].split(',')
				form2.append('nomenclatura', nomenclatura[0])

				// si modifica un destino
				if (eb.target.innerText == "Modificar Destino") {
					editDestino2(form2)
				}
				// si agrega un destino
				else{
					addDestino(form2)	
				}
			}
			else{
				msg_destino.innerText="Presiona el boton 'Ver en mapa' "
			}
		})

		// hace la animacion del recorrido
		e.routes[0].coordinates.forEach( ({lat,lng},index) =>{
			setTimeout( ()=>{
				// modifica la posicion del marcador
				camionMarcador.setLatLng([lat,lng])
			},100 * index)
		})
	})
	.addTo(map)	

	// L.Routing.itinerary({collapsible: true})
}

function addDestino(form) {

	const content_form=`
	<div class="inputs all">
		<label for="nombre_destino">Nombre del Destino</label>
		<input type="text" id="nombre_destino" class="input-error" placeholder="escribe aqui.." required />
		<span id="msg_error_form" class="msg-error-form"></span>
	</div>
	`

	// crea la alerta con el formulario
	create_modal_form({
		title: "Agregar Destino",
		form: content_form,
		btnText: 'Agregar',
		btnName: 'btn-insert'
	})	

	form_modal.addEventListener('submit', a=>{
		a.preventDefault()

		const factor = Math.pow(10, 1);
	    // console.log(factor)
	    const km = Math.round((form.get('km')/1000) * factor) / factor;

	    form.set('km', km)
		form.append('nombre_destino', nombre_destino.value)

		// parametros de la peticion HTTP a la API
		const optionsRequest = {
			method: 'POST',
			body: form
		}
		// hace la peticion a la API
		fetchApi2('destinos',`insert`,optionsRequest).then( response => {
			// console.log(response)
			mensajeError(response)
		})

		page=1
		ordenarTabla(true)
		cambiarPagina(page)
		content_mapa.style.display='none'
		section_control.style.display='flex'
		contenido_tablas.style.display='block'	
	})
		
	return
}

function editDestino2(form) {
	// console.log(Object.fromEntries(form))
    const factor = Math.pow(10, 1);
    // console.log(factor)
    const km = Math.round((form.get('km')/1000) * factor) / factor;

    form.set('km', km)

	// parametros de la peticion HTTP a la API
	const optionsRequest = {
		method: 'POST',
		body: form
	}
	// hace la peticion a la API
	fetchApi2('destinos',`update`,optionsRequest).then( response => {
		// console.log(response)
		mensajeError(response)
	})
				

	page=1
	ordenarTabla(true)
	cambiarPagina(page)
	content_mapa.style.display='none'
	section_control.style.display='flex'
	contenido_tablas.style.display='block'
	return
}

