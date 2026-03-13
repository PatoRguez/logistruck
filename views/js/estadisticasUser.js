let mychar

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
const meses2 = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const labels2 = ['Fabrica Tortu', 'Fabrica Colon', 'Fabrica Santa Rosa']
const labels3 = ['Buenos Aires', 'San juan', 'La rioja']

const labels4 = ['Scania - 1re60p', 'Renault - 1re60t', 'Mercedez - 1re90p', 'Mercedez - 1re90s', 'Mercedez - 20m22e', 'Renault - 2th8re']
// ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const datos = [30, 20, 50, 40, 60, 70, 80, 90, 50, 60, 70, 100]
const datos2 = [23,4,1]
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

graficoBarra(datos,meses2,'Total de Envios','grafico_km')

graficoBarra(datos,meses2,'Total de Envios','grafico_envios')



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

function graficoRadar(datos,labelX,labelTitle,id) {
    bcolor = colorHEX(labelX.length);//COlor del border
    color = colorTransp(bcolor,20);//Color transparente

    // obtiene el elemento del grafico
    const ctx = id;

    // datos del grafico 
    const data = {
        labels: labelX,
        datasets: [{
            label: labelTitle,
            // backgroundColor: color,
            // borderColor: bcolor,
            // borderWidth: 2,
            data: datos,
        }],
    }

    // Opciones del grafico
    const options = {
        responsive: true ,
        plugins:{
            legend: {display: false}
        },
        // indexAxis: 'y',
    }

    // crea un nuevo grafico
    mychar= new Chart(ctx, { type: "radar",data,options });
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