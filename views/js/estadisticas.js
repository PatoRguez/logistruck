let mychar

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
const meses2 = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const labels2 = ['Fabrica Tortu', 'Fabrica Colon', 'Fabrica Santa Rosa','Fabrica Santa Rosa','Fabrica Santa Rosa','Fabrica Santa Rosa','Fabrica Santa Rosa','Fabrica Santa Rosa','Fabrica Santa Rosa','Fabrica Santa Rosa','Fabrica Santa Rosa','Fabrica Santa Rosa']

const provinciasArgentina = [
    "Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán"
];

const datosNumericos = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
    21, 22, 23
];

const labels4 = ['Scania - 1re60p', 'Renault - 1re60t', 'Mercedez - 1re90p', 'Mercedez - 1re90s', 'Mercedez - 20m22e', 'Renault - 2th8re']

const datos = [0,3,2,3,4,5,6,6,7,2,1,2]
const datos2 = [0,3,2,3,4,5,6,6,7,2,1,2]
const datos3 = [
    [0,3,2,3,4,5,6,6,7,2,1,2],
    [1,3,2,3,4,2,6,8,3,2,5,2],
    [1,5,2,3,4,2,6,8,3,2,5,2],
    [1,4,2,3,4,2,6,8,3,2,5,2],
    [1,9,2,3,4,2,6,8,3,2,5,2],
    [1,3,2,3,4,2,6,8,3,2,5,2],
    [1,2,2,3,4,2,6,8,3,2,5,2],
    [1,8,32,3,4,2,6,8,3,2,5,2]
]

    // console.log(datos)

graficoBarra(datos,meses2,'Total de Envios','grafico_producto')

graficoBarra(datos2,labels2,'Porcentaje de Envíos','grafico_rutas')

graficoBarra(datosNumericos,provinciasArgentina,'Frecuencia de Envíos','grafico_destinos')

graficoLinea(meses2,labels4,datos3,'grafico_vehiculos')

/*********************************************
*
*       FUNCION PARA GRAFICAR
*
**********************************************/
function graficoBarra(datos,labelX,labelTitle,id) {

    bcolor = colorHEX(labelX.length);//COlor del border
    color = colorTransp(bcolor,20);//Color transparente

    const ctx = document.getElementById(id).getContext('2d');

    // datos del grafico 
    const data = {
        labels: labelX,
        datasets: [{
            label: labelTitle,
            data: datos,
            backgroundColor: color,
            hoverBackgroundColor: bcolor,
            borderColor: bcolor,
            borderWidth: 1
        }]
    };

    // Opciones del grafico
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Permite establecer un tamaño personalizado
        indexAxis: window.innerWidth < 601 ? 'y' : 'x',  // Cambia la orientación
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                display: true
            }
        },
        plugins:{
            legend: {display: false}
        },
    }
    
    // crea un nuevo grafico
    mychar= new Chart(ctx, { type: "bar",data,options });

    // Ajustar el gráfico en caso de que se cambie el tamaño de la ventana
    window.addEventListener('resize', function() {
        mychar.options.indexAxis = window.innerWidth < 601 ? 'y' : 'x';  // Cambia la orientación
        mychar.update();
    });
}

function graficoBarraY(datos,labelX,labelTitle,id) {
    const ctx = document.getElementById(id).getContext('2d');

    const myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelX,
            datasets: [{
                label: labelTitle,
                data: datos,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            plugins:{
                legend:{
                    display: false
                }
            }
        }
    });
}

function graficoCirculo(labelTitle,labelCirculo,dataCirculo,id) {
	bcolor = colorHEX(labelCirculo.length);//COlor del border
    color = colorTransp(bcolor,20);//Color transparente

    // obtiene el elemento del grafico
	const ctx = id;

	// datos del grafico
	const data = {
		labels: labelCirculo,
        datasets: [{
            label: labelTitle,
            data: dataCirculo,
            backgroundColor: color,
            hoverBackgroundColor: bcolor,
            borderColor: bcolor,
            borderWidth: 2
        }]
	}

	// opciones del grafico
	const options = {
		// responsive: true,
        plugins: {
            legend: {
                position: 'left',
                display: false
            }
        }
	} 

	// crea el grafico
    const enviosChart = new Chart(ctx,{ type: 'doughnut',data,options});
}

function graficoLinea(labelLinea,nombreStock,dataStock,id) {
   
    bcolor= colorHEX(labelLinea.length);//COlor del border
    color = colorTransp(bcolor,20);//Color transparente

    let datos=[]
    for (var i = 0; i < nombreStock.length; i++) {
        let datase={
            label: nombreStock[i],
            backgroundColor: color[i],
            borderColor: bcolor[i],
            borderWidth: 2,
            data: dataStock[i],
            tension: 0.3,
        }
        datos.push(datase)
    }

    // datos del grafico
    const data = {
    	labels: labelLinea,
    	datasets: datos
    }

    // opciones del grafico
    const options = {
		plugins:{
            legend: {
                display: true,
            }
        }
    }

    // obtiene el elemento del grafico
    const ctx = id

    // crea un nuevo grafico
    mychar= new Chart(ctx,{ type: "line",data,options });
}

function  graficoRadar(datos,labelX,labelTitle,id) {
    bcolor = colorHEX(labelX.length);//COlor del border
    color = colorTransp(bcolor,20);//Color transparente

    // obtiene el elemento del grafico
    const ctx = id

    let datasGe=[]
    for (var i = 0; i < labelX.length; i++) {
        let datase={
            label: labelTitle[i],
            backgroundColor: color[i],
            borderColor: bcolor[i],
            borderWidth: 2,
            data: datos[i],
            tension: 0.3,
        }
        datasGe.push(datase)
    }

    // datos del grafico
    const data = {
        labels: labelX,
        datasets: datasGe
    }

    // opciones del grafico
    const options = {
        // responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false
            }
        }
    } 

    // crea el grafico
    const enviosChart = new Chart(ctx,{ type: 'radar',data,options});
}
/***************************************************
*
*   FUNCIONES PARA GENERAR COLORES ALEATORIOS
*
********************************************************/

function generarLetra(){
    var letras = ["a","b","c","d","e","f","0","1","2","3","4","5","6","7","8","9"];
    var numero = (Math.random()*15).toFixed(0);
    return letras[numero];
}
                    
function colorHEX(cantidad){
    var codColor = "#";
    //console.log(cantidad)
    var colores=[];
    for (var a = 0; a < cantidad; a++) {
        for(var i=0;i<6;i++){
            codColor = codColor + generarLetra() ;
        } 
        //console.log(codColor);
        colores.push(codColor);
        codColor="#"   
    }
    return colores;
}

function colorTransp(colores,opac){
    return colores.map(color => `${color+opac}`)
}