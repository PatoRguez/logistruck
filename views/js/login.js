history.replaceState(null, null, location.href)

const password = document.getElementById('pass')
const icono = document.querySelector('.icon')

icono.addEventListener("click", e => {
	if (password.type == "password") {
		password.type = "text" 
		icono.src="./views/img/system/eye.svg"
	}else{
		password.type = "password" 
		icono.src="./views/img/system/eye-slash.svg"
	}
})

// si hace click en el btn 'Iniciar'
btn_login.addEventListener('click', e => {
	if (email.value!='' && pass.value!='') {
		e.preventDefault()

		fetchApi2('user',`login/?email=${email.value}&pass=${pass.value}`).then( response => {
			console.log(response)

			// si el logueo es valido
			if (response.errno == 200) {
				Swal.fire({
					title: response.error,
					icon: 'success',
					showConfirmButton: false,
					padding: '1rem',
			  		timer: 1000,
			  		toast: true,
			  		position: 'top-end',
					timerProgressBar: true,
				}).then(r => {
					// redirecciona a panel
					window.location.href = './panel'
				})
			}
			else{
				// muestra mensaje de error
				msg_error.classList.add('alert-login')
				msg_error.innerHTML = response.error	
			}

			
		})			
	}	
})
