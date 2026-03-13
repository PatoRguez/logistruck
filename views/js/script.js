// history.replaceState(null, null, location.href)

const body =document.querySelector('body')

/*******************************************
*
*
*		H E A D E R
*
*
***********************************************/
// si hace click en el logo del header 
header_logo.addEventListener('click', e =>{
	window.location.href='./panel' // redirecciona panel
})

const activePage=window.location.href
const links= document.querySelectorAll('.header-nav-ul li a')
// console.log(activePage)

// REMARCAR SECCION
links.forEach(item=>{
	if (item.href == activePage) {
		// obtiene el nombre de la  seccion 
		const sec = item.pathname.split('/')
		const subSecciones = ['acoplado','vehiculo','assignvehiculo', 'viajes', 'destinos', 'assignviaje']

		subSecciones.forEach( sub =>{
			// si esta en en una sub seccion
			if (sec[sec.length -1 ]== sub) {
				item.offsetParent.offsetParent.firstElementChild.style.fontWeight='bold'
			}	
		})

		item.style.fontWeight='bold'
	}
})

// console.log(window.innerWidth)
const btn_submenu = document.querySelectorAll('#btn_submenu')

if (btn_submenu) {
	btn_submenu.forEach( item => {
		// SUBMENU
		item.addEventListener('click', e=>{
			let alto='0'
			let rot='0'
			let m='0'
			if (item.nextElementSibling.clientHeight=='0'){
				alto=item.nextElementSibling.scrollHeight;
				rot='90'
				m='10'
			}
			item.lastElementChild.style.transform=`rotate(${rot}deg)`
			item.nextElementSibling.style.height=`${alto}px`
			if (window.innerWidth<700) {
				item.style.marginBottom=`${m}px`
			}
			
		})

		// Si hace click fuera del elmento
		document.addEventListener('mouseup', e=>{
			// si hace click fuera del elemento alerta_user
			if (!item.nextElementSibling.contains(e.target)) {
				let alto='0'
				let rot='0'
				let m='0'
				item.lastElementChild.style.transform=`rotate(${rot}deg)`
				item.nextElementSibling.style.height=`${alto}px`
			}
		})
	})
}

// MENU DESPLEGABLE
btn_menu_open.addEventListener('click', e=>{
	header_nav.style.width= `100vw`;
	body.classList.add('block-scroll')
})

btn_menu_close.addEventListener('click', e=>{
	header_nav.style.width= `0vw`;
	body.classList.remove('block-scroll')
	setTimeout(() => {
		header_nav.style="none"  
	}, 500);
})

/*******************************************
*
*
*		ALERTA INFO USUARIO
*
*
***********************************************/
function infoPerfil(nombre,email) {

	if (alerta_user.style.display=='block') {
		alerta_user.classList.add('des')
		setTimeout(() => {
			alerta_user.style.display="none"  
		}, 500);
	}
	else{
		alerta_user.classList.remove('des')
		alerta_user.style.display="block"
	}
}

function a() {
	window.location.assign("./logout");
}

// si hace click en el documento
document.addEventListener('mouseup', e => {
    
    if (alerta_user.style.display=='block'){
	    // si hace click fuera del elemento alerta_user
	    if (!alerta_user.contains(e.target)) {
		    alerta_user.classList.add('des')
			setTimeout(() => {
				alerta_user.style.display="none"  
			}, 500);
		}	
    }
    
    // console.log(window.innerWidth)
    if (window.innerWidth < 700) {
    	if (header_nav.clientWidth != "0") {
	    	if (!header_nav_ul.contains(e.target)) {
		    	header_nav.style.width= `0`;
				setTimeout(() => {
					header_nav.style.width="auto"  
				}, 600);
				body.classList.remove('block-scroll')
		    }	
    	}
    }
});

/***************************************************************************
*
*       FUNCION PARA ENVIAR MENSAJE DE VERIFICACION DE CORREO VALIDA
*
****************************************************************************/
function mensaje_validar(email) {
	Swal.fire({
		title:"Verificacion Valida",
		icon: 'success',
		html: `Se ha enviado su nueva controseña al Email <b>${email}</b>.`,
		showConfirmButton: false,
  		timer: 2500,
		timerProgressBar: true,
	})
	.then(result => {
		window.location.assign("./")
	})
}

/**
 *
 *	Muestra una alerta si se realiza una accion(insert,update o delete)
 *	@param tilte string titulo de la alerta
 *	@param icon string icono de la alerta
 *
 **/
function mensajeBarra(text,icon) {
	Swal.fire({
		title: text,
		icon: icon,
		showConfirmButton: false,
		padding: '1rem',
  		timer: 2500,
  		toast: true,
  		position: 'top-end',
		timerProgressBar: true,
	})
}

/**
 *
 *	Muestra una alerta si desea restaurar la columna de la tabla
 *	@param tilte string titulo de la alerta
 *	@param icon string icono de la alerta
 *	@param ubi string | int ubi de la columna de la tabla
 *	@param text string | null subtitulo de la alerta
 *
 **/
function mensajeModal(titleA,icon,ubi,text="") {
	Swal.fire({
		title: titleA,
		text: text,
		icon: icon,
		showCancelButton: true,
		cancelButtonColor: "red",
		confirmButtonText: "Si",
		cancelButtonText: "No",
		padding: '1rem',
	}).then( resp=> {
		// si presiono 'SI'
		if (resp.isConfirmed) {

			const title2 = btn_agregar.innerText.split("Agregar ")[1].toString()

			let params= new URLSearchParams({
				id: ubi,
			}).toString()

			fetchApi2(title2,`restore/?${params}`).then(response=>{
				// muestra en mensaje la respuesta
				mensajeError(response)
			})
		}
	})
}

/*
 *
 *	Muestra en pantalla el mensaje de error del formulario
 *	@param response array arreglo de errores
 *
 **/
function mensajeError(response) {
	switch(response.errno){
		case 400:
			const inputsError = document.querySelectorAll('.input-error')
			inputsError.forEach( input => {
				input.style.borderColor='red'
				input.style.boxShadow='0px 0px 5px 1px rgb(255, 0, 0, .5)'	
			})
			
			msg_error_form.style.paddingBottom='.5rem'
			msg_error_form.innerText=response.error
		break;

		case 201:
			// cierra el modal
			remover_modal()

			// muestra alerta en pantalla
			mensajeModal(response.error,'question',response.ubi,"Desea restaurarlo?")
		break;
		case 200:
			// cierra el modal
			remover_modal()

			// muestra alerta en pantalla
			mensajeBarra(response.error,'success')	

			// actualiza la tabla
			tablaData()	
		break;

		default:
			alert("No selecciono mensaje")
		break;

	}
}

function generarLetrasAleatorias(longitud) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let resultado = '';
    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres[indice];
    }
    return resultado;
}

function generarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}