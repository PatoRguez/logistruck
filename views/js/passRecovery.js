let val=true;

form_pass_recovery.addEventListener('submit', e =>{
    e.preventDefault()

    const form = new URLSearchParams(Object.fromEntries(new FormData(e.target))).toString()

    if (val) {
        val=false;

        btn_submit.innerHTML='...Enviando'
        fetchApi2('user',`verifyEmail/?${form}`).then( response => {

            if (response.errno == 200) {
                window.location.href='verifyCorreo'
                return
            }

            btn_submit.innerHTML='Enviar'
            msg_error_form.innerHTML=response.error
            val=true
        })
    }
})