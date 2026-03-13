const defaultFile=img_foto.src

/**
 * 
 * Muestra la foto seleccionada en tiempo real
 * 
 * */
input_foto.addEventListener('change',e=>{
	if (e.target.files[0]) {//SI selecciona una imagen la muestre
		const reader = new FileReader()
		reader.onload = function (e) {
			img_foto.src=e.target.result;	
		}
		reader.readAsDataURL(e.target.files[0])
	}//SI selecciona una imagen la muestre
	else{//SI no selecciona una imagen la muestre la actual
		img_foto=src=defaultFile
	}//SI no selecciona una imagen la muestre la actual
}); 

/**
 * 
 * Permite ver la contraseña
 * 
 * */
view_pass.addEventListener("click", e => {
	if (input_pass.type == "password") {
		input_pass.type = "text" 
		icono.src="./views/img/system/eye.svg"
	}else{
		input_pass.type = "password" 
		icono.src="./views/img/system/eye-slash.svg"
	}
})

/**
 * 
 * Genera numeros random dependiendo del minimo y maximo
 * 
 * */
function numeroAleatorioDecimales(min, max) {
  var num = Math.random() * (max - min);
  return num + min;
}

/**
 * 
 * Genera contraseñas
 * 
 * */
generate.addEventListener('click', e => {
	e.preventDefault()
	let t = numeroAleatorioDecimales(5,8)
	fetchApi2('user',`generatePassword/?length=${t}`).then( response => {
		console.log(response)
		input_pass.value=response
	})
})

/**
 * 
 * Formulario para actualizar los datos
 * 
 * */
form_perfil.addEventListener('submit', e => {
	e.preventDefault() // le quita al formulario el evento por defecto

	const form = new FormData(e.target)// Obtinene los valores del formulario
	
	console.log(Object.fromEntries(form))
	
	// parametros de la peticion HTTP a la API
	const params = {
		method: 'POST',
		body: form
	}

	// peticion a la API
	fetchApi2('user',`update`,params).then(response => {
		console.log(response)

		// muesra el mensaje
		mensajeBarra(response.error,'success')

		// actualiza los datos mostrados
		mostrarDatos()
	})
	
})

/**
 * 
 * Formulario modal para verficar si es el admin
 * 
 * */
btn_setting.addEventListener('click', e => {
	const formulario = `
		<div class="inputs all">
			<label for="">Ingresa tu Contraseña</label>
			<input type="password" name="pass" class="input-error" required />
            <span id="msg_error_form" class="msg-error-form"></span>
		</div>
	`

	// crea la alerta con el formulario
	create_modal_form({
		title: "Configuracion",
		form: formulario,
		iconTitle: 'edit',
		btnText: 'Enviar',
		btnName: 'btn-insert'
	})	

	form_modal.addEventListener('submit', e=>{
		e.preventDefault()

		const form = new URLSearchParams(Object.fromEntries(new FormData(e.target))).toString()

		fetchApi2('user',`verifyPass/?${form}`).then( response => {
			// si la contraseña es correcta
			if (response.errno == 200) {
				form_block.remove()

				// cierra el modal
				remover_modal()

				// muestra mensaje
				mensajeBarra(response.error,'success')

				return// termina la ejecucion
			}

			mensajeError(response)
			
		})
	})
	// form_block.style.display='none'
})

async function mostrarDatos(){
	const datos = await fetchApi2('user','getUser')

	foto_user.src=datos[0].foto
	nombre_user.innerText=datos[0].nombre
	email_user.innerText=datos[0].email
	telefono_user.innerText=datos[0].telefono
	fechaN_user.innerText=datos[0].fechaNacimiento
	fechaI_user.innerText=datos[0].fechaIngreso

	// console.log(datos)
}