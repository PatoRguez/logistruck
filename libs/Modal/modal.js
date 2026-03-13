/**
*
*	CREA EL CUERPO DE LA ALERTA
*
*/
function create_modal() {
	// creael fondo de la ventana
	const pop = document.createElement('div')

	pop.classList.add('pop') 

	// crea la ventana
	const modal = document.createElement('div')

	modal.classList.add('ventana')

	// inserta la ventana en pop
	pop.append(modal)

	// inserta el pop en el body
	$('body').append(pop)
	$('body').addClass('block-scroll')
}

/*
*
*	Crea la alerta con formulario
*
**/
function create_modal_form(options) {
	const title=options.title
	const btnText =options.btnText
	const form=options.form
	const btnName=options.btnName
	const icon= (options.iconTitle=='edit')? 'pencil-square' : 'plus-circle'
	const formFiles=options.formFiles 
	
	// llama a funcion
	create_modal()

	// crea el header en la ventana
	const headerModal = document.createElement('div')
	headerModal.classList.add('ventana-header')
	 
	// contenido del header
	headerModal.innerHTML=`
		<div class="ventana-header-title">
			<img src="views/img/alert/${icon}.svg"/>
			<h3>${title}</h3>
		</div>
		<img class="close-button" src="views/img/alert/close-small.svg" />
		`

	// crea el content en la ventana
	const contentModal = document.createElement('div')
	contentModal.classList.add('ventana-conteiner') // le da estilos

	// crea el formulario de la ventana 
	const formModal = document.createElement('form')
	formModal.classList.add('form')
	formModal.method='POST'
	formModal.id='form_modal'
	if (formFiles) {
		formModal.enctype="multipart/form-data"
	}

	formModal.innerHTML=form

	// crea el btn submit del formulario
	const btnForm = document.createElement('button')
	btnForm.classList.add('btn')
	btnForm.style.margin='0px'
	btnForm.innerText=btnText
	btnForm.type="submit"
	btnForm.name=btnName
	btnForm.id="btn_form_modal"

	// inserta los inputs y el btn
	formModal.append(btnForm)

	// inserta el formulario en la ventana
	contentModal.append(formModal)

	// inserta el header en la ventas
	$('.ventana').append(headerModal,contentModal);

	// funcion cierra la ventans
	alert_close()

	detect_input_file()
}

/*
*
*	Crea la alerta con icono
*
**/
function create_modal_alert(options) {
	const title=options.title
	const text=options.text
	const icon=options.iconTitle

	// llama a la funcion
	create_modal()

	// crea el content en la ventana
	const contentModal = document.createElement('div')
	contentModal.classList.add('ventana-conteiner') // le da estilos

	// crea los controles en la ventana
	const controlModal = document.createElement('div')
	controlModal.classList.add('ventana-control') // le da estilos
	controlModal.innerHTML=`
		<button class="btn">Aceptar</button>
		<button class="btn close" id="close-button">Cancelar</button>`

	contentModal.style.textAlign='center'
	contentModal.innerHTML=`
		<img src="success.svg" class="icon" />
		<h2>${title}</h2>
		<span class="text-alert">${text}</span>
		`	

	$('.ventana').append(contentModal,controlModal)
}


/**
*
*	Cierra la ventana
*
*/
function alert_close() {
	// si hace click en el btn-close
	$('.close-button').on('click', function () {
		remover_modal()
	})

	$('#close-button').on('click', function () {
		remover_modal()
	})

	// si hace click fuera de la ventana
	document.addEventListener('mouseup', function(e) {
	    var container = document.querySelector('.ventana');
	    
	    if (container!=null) {
		    if (!container.contains(e.target)) {
		    	remover_modal()
		    }
	    }
	});

}

/*
*
* Remueve el modal del DOM
*
*/
function remover_modal() {
	// le da la animacion de desaparecer a la alerta
	$('.ventana').addClass('pos')
	$('.pop').addClass('des')

	// espera .5s y elimina la alerta del DOM
	setTimeout(() => {
		$('body').removeClass('block-scroll')
		$('.pop').remove()  
	}, 500);
}

/*
*
* Detecta input file 
*
*/
function detect_input_file() {
	// selecciona todos los inputs file que encuentre
	const inputsFiles = document.querySelectorAll('#input-file') 


	inputsFiles.forEach(f=>{
		f.addEventListener('change', e=>{
			
			if (f.files.length == 0) {
				$('.file-name').html("Ningun archivo seleccionado")
			}
			else if (f.files.length > 1) {
				$('.file-name').html(`${f.files.length} archivos seleccionados`)
			}
			else{
				$('.file-name').html(f.files[0].name)
			}
		})
	})
}
