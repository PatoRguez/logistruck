// variable global para almacenar los registros
let dataGlobal=[]

let totalPaginas; // almacena la cantida de paginas

let cantidad = 5 // cantidad de filas a mostrar en la tabla

let page = 1 // pagina en la que esta parado

// cambia de pagina
select_pag.addEventListener('change', e => {
    page=parseInt(select_pag.value)
    cambiarPagina(select_pag.value)
})

// cambiar el order de los registros( mas reciente o mas antiguo)
select_order.addEventListener('change', e => {
	const op = select_order.value=='true'? true : false
	ordenarTabla(op)
	cambiarPagina(page)
})

tablaData()

/**
 * 
 * Formulario Modal para el ingreso de un empleado
 * 
 * */
function addEmpleados() {
   const formulario=`
    <div class="inputs-group">
        <div class="inputs">
            <label for="nom">Nombre</label>
            <input type="text" name="nombre" id="nom" required>
        </div>
        <div class="inputs">
            <label for="ape">Apellido</label>
            <input type="text" name="apellido" id="ape" required>
        </div>
    </div>
    <div class="inputs-group">
        <div class="inputs">
            <label for="fech">Fecha Nac.</label>
            <input type="date" name="fechaN" id="fech" required/>
        </div>
        <div class="inputs">
            <label for="DN">DNI</label>
            <input type="number" name="dni" id="DN" min="1" max="99999999" required>
        </div>
        <div class="inputs">
            <label for="tel">Contacto</label>
            <input type="number" name="telefono" id="tel" required>
        </div>
    </div>
    <div class="inputs-group">
        <div class="inputs">
            <label for="dir">Direccion</label>
            <input type="text" name="direccion" id="dir" required/>
        </div>
        <div class="inputs">
            <label for="mail">Email</label>
            <input type="email" name="email" id="mail" class="input-error" required/>
            <span id="msg_error_form" class="msg-error-form"></span>
        </div>
    </div>
    <div class="inputs semi">
        <label for="" class="label-imp">Foto</label>
        <label for="input-file" id="label-input-file">
            <span class="file-btn">Buscar archivo</span>
            <span class="file-name">Ningun archivo seleccionado</span>
        </label>
        <input type="file" name="foto" id="input-file" />
    </div>
    `

    // crea la alerta con el formulario
    create_modal_form({
        title: "Agregar Empleado",
        form: formulario,
        formFiles: true,
        btnText: 'Agregar',
        btnName: 'btn-insert'
    })  

    form_modal.addEventListener('submit', e => {
        e.preventDefault()// le quita al formulario el evento por defecto

        const form = new FormData(e.target)// optiene los valores del formulario

        // parametros de la peticion HTTP a la API
        let optionsRequest = {
            method: 'POST',
            body: form,
        }

        // peticion a la API
        fetchApi2('empleado',`insert/`,optionsRequest).then(response => {
            console.log(response)

            // si se agrego el empleaodo correctamente
            if (response.errno == 200) {
                btn_form_modal.innerHTML='enviando...'
                // inicio el formulario de registro 
                const register = new FormData()

                // cargo el formulario con los datos del empleado
                register.append('email', response.email)
                register.append('pass', '')
                register.append('empleado', response.empleado)

                // cambio el cuerpo de la solicitud
                optionsRequest.body = register
                    
                fetchApi2('user','register',optionsRequest).then(response2 => {
                    console.log(response2)
                    page=1
                    mensajeError(response2)
                })

            }else{
                mensajeError(response)
            }
        })
    })
}

/**
 * 
 * Alerta para eliminar un empleado
 * 
 * */
function deleteEmpleados({idEmpleado}) {
	Swal.fire({
		title: "Estas seguro de eliminar este Empleado?!!",
		icon: "warning",
		text: "¡¡No podras revertir esto!!!",
		showCancelButton: true,
		cancelButtonColor: "red",
		confirmButtonText: "Si, eliminar!",
		cancelButtonText: "Cancelar",
		padding:'10px',
	}).then((result)=>{
		if (result.isConfirmed) {//Si Presiona el boton 'Si,eliminar!'
            let params = new URLSearchParams({
                id: idEmpleado
            })

            fetchApi2('empleado',`unsubscribe/?${params}`).then(data=>{

                if (data.errno == 200) {
                    // muestra el mensaje de respuesta
                    mensajeBarra(data.error,'success');

                    // actualiza la tabla
                    tablaData()
                }
            })
			
		}//Si Presiona el boton 'Si,eliminar!'
	})
}

/**
 * 
 * Formulario Modal para modificar un producto
 * 
 * */
function editEmpleados({idEmpleado,nombre,apellido,fechaNacimiento,DNI,telefono,direccion,email,foto}) {
    
    const [dia,mes,año] = fechaNacimiento.split(' / ')
    // FUNCION FORMULARIO ALERTA DE EDITAR ACOPLADO
    const formulario=`
    <div class="inputs-group">
        <div class="inputs">
            <label for="nom">Nombre</label>
            <input type="text" name="nombre" id="nom" value="${nombre}" placeholder="${nombre}" required>
        </div>
        <div class="inputs">
            <label for="ape">Apellido</label>
            <input type="text" name="apellido" id="ape" value="${apellido}" placeholder="${apellido}" required>
        </div>
    </div>
    <div class="inputs-group">
        <div class="inputs">
            <label for="fech">Fecha Nac.</label>
            <input type="date" name="fechaN" id="fech" value="${año}-${mes}-${dia}" placeholder="${fechaNacimiento}" required/>
        </div>
        <div class="inputs">
            <label for="DN">DNI</label>
            <input type="number" name="dni" id="DN" min="1" max="99999999" value="${DNI}" placeholder="${DNI}" required>
        </div>
        <div class="inputs">
            <label for="tel">Contacto</label>
            <input type="number" name="telefono" id="tel" value="${telefono}" placeholder="${telefono}" required>
        </div>
    </div>
    <div class="inputs-group">
        <div class="inputs">
            <label for="dir">Direccion</label>
            <input type="text" name="direccion" id="dir" value="${direccion}" placeholder="${direccion}" />
        </div>
        <div class="inputs semi">
            <label for="mail">Email</label>
            <input type="email" name="email" id="mail" class="input-error" value="${email}" placeholder="${email}" />
            <span id="msg_error_form" class="msg-error-form"></span>
        </div>
    </div>
    <div class="inputs semi">
        <label for="" class="label-imp">Foto</label>
        <label for="input-file" id="label-input-file">
            <span class="file-btn">Buscar archivo</span>
            <span class="file-name">Ningun archivo seleccionado</span>
        </label>
        <input type="file" name="foto" id="input-file" value="${foto}" placeholder="${foto}" />
    </div>
    <input type="hidden" name="id" value="${idEmpleado}">
    `

    // crea la alerta con el formulario
    create_modal_form({
        title: "Editar Empleado",
        form: formulario,
        iconTitle: 'edit',
        formFiles: true,
        btnText: 'Modificar',
        btnName: 'btn-update'
    })  

    form_modal.addEventListener('submit', e => {
        e.preventDefault()// le quita al formulario el evento por defecto

        const form = new FormData(e.target)// optiene los valores del formulario

        // parametros de la peticion HTTP a la API
        let params = {
            method: 'POST',
            body: form,
        }

        // peticion a la API
        fetchApi2('empleado',`update/`,params).then(response => {
            console.log(response)

            // muestra el mensaje
            mensajeError(response)
        })
    })
}

/**
 * 
 * Obtiene la data de la tabla 'empleados'
 * 
 * */
function tablaData() {

    let contenido=` *No hay Empleados ingresados`;

    fetchApi2('empleado',`getEmpleados`).then( data => {

        // si la tabla esta vacia
        if (data == false) {
            buscador.style.display="none"
            div_select_pag.style.display="none"
            contenido_tablas.style.display="none"

            // añade un mensaje
            section_control.append("* No hay empleados registrados")
        }
        else{
            // le cargo a la variable global los registros
            dataGlobal=data
            
            paginar()
			ordenarTabla(true)

            if (data.length == 1) {
                buscador.style.display="block"
                div_select_pag.style.display="block"
                contenido_tablas.style.display="block"
            }

            // inserta la tabla al HTML
            cambiarPagina(page)
            buscadorTabla()
        }
        
    })
}

/**
 * 
 * Hace la estructura de la tabla y la inserta en el documento
 * 
 * */
function tableStruct(datos) {
    tabla_content.innerHTML=''

    // si no encontro resultados
    if ( datos == false ) {
        tabla_content.innerHTML=`
        <tr>
            <td colspan='10' style='text-align:center'>No se encontraron resultados</td>
        </tr>`
    }
    // si encontro resutados
    else{
        datos.forEach( column =>{
            /*< captuta la plantilla*/
            const tpl = tpl_row_table.content
            /*< clona la plantilla como un nodo completo*/
            const clon = tpl.cloneNode(true);

            clon.querySelector('.tpl-col-foto').innerHTML = `<img src='${column.foto}' width='50' hegth='50'>`
            clon.querySelector('.tpl-col-email').innerHTML = column.email
            clon.querySelector('.tpl-col-nombre').innerHTML = column.nombre
            clon.querySelector('.tpl-col-apellido').innerHTML = column.apellido
            clon.querySelector('.tpl-col-fechaN').innerHTML = column.fechaNacimiento
            clon.querySelector('.tpl-col-dni').innerHTML = column.DNI
            clon.querySelector('.tpl-col-telefono').innerHTML = column.telefono
            clon.querySelector('.tpl-col-direccion').innerHTML = column.direccion
            clon.querySelector('.tpl-col-fechaI').innerHTML = column.fechaIngreso
            clon.querySelector('.btn-edit').onclick = ()=>{editEmpleados(column)};
            clon.querySelector('.btn-delete').onclick = ()=>{deleteEmpleados(column)} 

            // inserta el clon en la tabla
            tabla_content.appendChild(clon)
        }) 
    }
}

/*
 *
 *  Calcula el total de paginas
 *
 **/
function paginar() {
    // calcula el total de paginas
    totalPaginas = Math.ceil(dataGlobal.length / cantidad)
    
    // formateo el select
    select_pag.innerHTML=''

    // carga el total de pag. en el select
    for (let i = 1; i <= totalPaginas; i++){
        const option = document.createElement('option')
        option.innerHTML=i
        
        select_pag.append(option)   
    }
}

/*
 *
 *  Cambia a la siguiente pagina
 *
 **/
btn_next_page.addEventListener('click', e =>{
    if (totalPaginas>1) {
        page++
        
        if (page>totalPaginas) { page=1 }

        cambiarPagina(page)
    }
})

/*
 *
 *  Cambia a la anterior pagina
 *
 **/
btn_last_page.addEventListener('click', e =>{
    if (totalPaginas>1) {
        page--
        
        if (page<1) { page=totalPaginas }

        cambiarPagina(page)
    }
})

/*
 *
 *  Cambia de pagina segun el numero de pagina
 *  @param pageActive int numero de la pagina
 *
 **/
function cambiarPagina(pageActive = 1) {
    select_pag.value=page

    const inicio = (pageActive-1)*cantidad // inicio de la pagina
    const final = inicio+cantidad // final de la pagina
    const contentPagina = dataGlobal.slice(inicio,final) // obtiene los registros de la pagina

    tableStruct(contentPagina)
}

/*
 *
 *	Buscador de la tabla
 *
 **/
function buscadorTabla() {
	buscador.addEventListener('keyup', () => {
		const busqueda=buscador.value.toLowerCase()// obtiene el valor del input

		let resultSearch = [] // carga las coincidencias de la busqueda
		
		// si el input no esta vacio
		if (busqueda) {
			// recorre los registros cargados
			dataGlobal.forEach( column =>{
				const {email,nombre,apellido,DNI} = column

				// si encuentra alguna coincidencia
				if (email.toLowerCase().startsWith(busqueda) || nombre.toLowerCase().startsWith(busqueda) || apellido.toLowerCase().startsWith(busqueda) || DNI.toLowerCase().startsWith(busqueda)) {
					// carga la columna a un array 
					resultSearch.push(column)
				}
			})

			// muestra el resultado de la busqueda en la tabla
			tableStruct(resultSearch)

			return// termina la ejecucion
		}

		// vuelve a la pagina 1
		cambiarPagina(page)
	})	
}

/*
 *
 *	Ordena la tabla segun la fecha del registro
 *	@param isRecent boolean 
 *
 **/
 function ordenarTabla(isRecent) {
	select_order.value=isRecent

	dataGlobal.sort((a, b) => {
		const dateA = a.idEmpleado;
	    const dateB = b.idEmpleado;
	    return isRecent ? dateB - dateA : dateA - dateB;
	});
}
