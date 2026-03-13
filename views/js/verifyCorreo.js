let val=true;

form_verify.addEventListener('submit', e =>{
    e.preventDefault()

    const form = new URLSearchParams(Object.fromEntries(new FormData(e.target))).toString()

    if (val) {
        val=false;

        btn_submit.innerHTML='...Enviando'
        fetchApi2('user',`restorePass/?${form}`).then( response => {

            if (response.errno == 200) {
            	Swal.fire({
					title:"Verificación Valida",
					icon: 'success',
					html: `Se ha enviado su nueva controseña al Email <b>${response.email}</b>.`,
					showConfirmButton: false,
			  		timer: 2500,
					timerProgressBar: true,
				})
				.then(result => {
					window.location.assign("./")
				})

                return
            }

            btn_submit.innerHTML='Enviar'
            msg_error_form.innerHTML=response.error
            val=true
        })
    }
})