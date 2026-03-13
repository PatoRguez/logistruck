
const georefApi = async(option) =>{
	const url = `https://apis.datos.gob.ar/georef/api/${option}`

	const response = await fetch(url)
	const data = await response.json();

	return data;
}


/*******************************************************************/

/*
 *
 * Envia una solicitud a la api
 * @return object | array | string valor de la respuesta
 * @param model string nombre de la clase o objeto
 * @param metodo string nombre del metodo de la clase
 * @param options object parametros del fetch
 *
 **/
const fetchApi2 = async (model,metodo,options={method: 'GET'}) => {
	// url
	const url = `./api/${model}/${metodo}`;

	const response = await fetch(url,options);
	const data = await response.json();

	return data;	
}