
// Trae los datos del vehiculo asignado
fetchApi2('vehiculo','getVehiculoAsignadoByEmpleado').then(data => {
	console.log(data)
	tableStruct(data)
})

/**
 * 
 * Formulario Modal para realizar un informe
 * 
 * */
function readReport({patente,idEmpleado}) {
	const formulario = `
		<div class="inputs all">
			<label for="asunto">Asunto</label>
			<input type="text" name="asunto" id="asunto" required/>
		</div>
		<div class="inputs all">
			<label for="prob">Problema</label>
			<input type="text" name="problema" id="prob" required/>
		</div>
		<div class="inputs all">
			<label for="des">Descripcion</label>
			<textarea name="descripcion" id="des" required/>
			</textarea>
		</div>
		<input type="hidden" name="empleado" value="${idEmpleado}"/>
		<input type="hidden" name="vehiculo" value="${patente}"/>
	`

	// crea la alerta con el formulario
	create_modal_form({
		title: "Realizar Informe",
		form: formulario,
		btnText: 'Enviar',
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
		fetchApi2('informe',`insert`,params).then(response => {
			console.log(response)

			// cierra el modal
			remover_modal()
			
			// muesra el mensaje
			mensajeBarra(response.error,'success')
		})
	})
}

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
	let cont=0
	data.forEach( column => {
		if (cont==0) {
					/*< captuta la plantilla*/
			const tpl = tpl_row_table.content
			/*< clona la plantilla como un nodo completo*/
			const tplPatente = tpl.cloneNode(true);
			const tplMarca = tpl.cloneNode(true);
			const tplModelo = tpl.cloneNode(true);
			const tplAcoplado = tpl.cloneNode(true);
			const tplCAcoplado = tpl.cloneNode(true);
			const tplLAcoplado = tpl.cloneNode(true);
			const tplEAcoplado = tpl.cloneNode(true);

			tplPatente.querySelector('th').innerHTML = 'patente'
			tplPatente.querySelector('td').innerHTML=column.patente

			tplMarca.querySelector('th').innerHTML = 'marca'
			tplMarca.querySelector('td').innerHTML=column.marca

			tplModelo.querySelector('th').innerHTML = 'modelo'
			tplModelo.querySelector('td').innerHTML=column.modelo

			tplAcoplado.querySelector('th').innerHTML = 'tipo de acoplado'
			tplAcoplado.querySelector('td').innerHTML=column.nombre

			let cap = (column.nombre=='Acoplado')? `${column.capacidad} kg` : `${column.capacidad} L` 

			tplCAcoplado.querySelector('th').innerHTML = 'capacidad de acoplado'
			tplCAcoplado.querySelector('td').innerHTML = cap

			tplLAcoplado.querySelector('th').innerHTML = 'largo del acoplado'
			tplLAcoplado.querySelector('td').innerHTML = `${column.largo} m`

			tplEAcoplado.querySelector('th').innerHTML = 'cant. de ejes del acoplado'
			tplEAcoplado.querySelector('td').innerHTML = `${column.cantEjes}`

			table_content.append(tplPatente,tplMarca,tplModelo,tplAcoplado,tplCAcoplado,tplLAcoplado,tplEAcoplado)

			box_btn.innerHTML=`
				<button class="btn" id="btn_informe">
					Realizar Informe
				</button>`

			btn_informe.addEventListener('click', e=>{
				readReport(column)
			})

			cont++	
		}

	})
}