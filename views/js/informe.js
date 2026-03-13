const search = window.location.search.substring(1).split('=')

// Si no hay un id de referencia
if (search=='') {
	window.location.href='./panel'
}



// Trae los datos del informe que eligio
fetchApi2('informe',`getInformeById/?id=${search[1]}`).then( datos =>{
	//si no fue leido o visto
	if(datos.estado==null){
		// lo marca como leido
		fetchApi2('informe',`markAsRead/?id=${search[1]}`).then(respo=>respo)
	}

	empleado.append(datos.empleado)
	vehiculo.append(datos.vehiculo)
	fecha.append(datos.fecha)

	asunto.append(datos.asunto)
	problema.append(datos.problema)
	descripcion.append(datos.descripcion)
})
