$(()=>{
    //Función que carga los productos de la lista
    cargarProductos();
})

var dataNuevo = [[]]
var tipo = ''
//Creamos la tabla de JQuery
const tabla = $("#tabla-producto").DataTable({
    "lengthMenu": [100],
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    columns: [
        { data: 'codigo'},
        { data: 'nombre'},
        { data: 'prioridad'},
        { data: 'tipo'},
        { data: 'descripcion'},
        { defaultContent: '<input type="checkbox" style="transform: scale(1.5)"> '},
        
    ],
});

//Función que carga los productos que tengan el estado de pertenecer a la lista (1 o 2)
cargarProductos = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/ProductosLista');
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Llenamos la tabla con los datos obtenidos
            let {data} = xhr.response;
            tabla.clear();
            tabla.rows.add(data);
            tabla.draw();
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error al cargar los productos.'
            })
        }
    });
    xhr.send();
}

//Si se aprieta el botón quitar se inicia la siguiente función
$('#quitar').on( 'click', function ()  {
    var filas = $("#tabla-producto").find("tr");
    //Se recorren todas las filas de la tabla
    for(i=0; i<filas.length; i++){
        var fila = []
        var celdas = $(filas[i]).find("td");
        //Recorremos las celdas de la fila actual
        for(j=0; j<celdas.length; j++){
            //Si la checkbox esta activada los agregamos a la matriz fila
            if($($(celdas[5]).children('input')[0]).prop('checked')){
                fila.push($(celdas[j]).text())
            }
        }
        //si la fila no esta vacia se agrega al dataNuevo
        if(fila[0] != null){
            dataNuevo.push(fila)
        }    
    };
    //Recorremos el data y llamamos a la función para quitar los productos de la lista
    for(var i in dataNuevo){
        if(dataNuevo[i][0] != null){
            //Enviamos a la función el codigo del producto
            quitarProductos(dataNuevo[i][0])
        }
    }
    //Reseteamos la tabla y dataNuevo
    dataNuevo = [[]]
    tabla.rows().remove().draw();
    cargarProductos()
});

//Funcion que al apretar el botón marcar activa todos los checkbox 
$('#marcar').on( 'click', function ()  {
    var filas = $("#tabla-producto").find("tr");
    for(i=0; i<filas.length; i++){
        var celdas = $(filas[i]).find("td"); 
        //Se activa el check box de la fila actual
        $($(celdas[5]).children('input')[0]).prop('checked','true')
    }
});

//Función que oculta la lista de productos a los encargados
$('#ocultar').on( 'click', function ()  {
    var filas = $("#tabla-producto").find("tr");
    for(i=0; i<filas.length; i++){
        var fila = []
        var celdas = $(filas[i]).find("td");
        for(j=0; j<celdas.length; j++){
            //Insertamos las celdas en la lista fila
            fila.push($(celdas[j]).text())
        }
        //Si no esta vacia la enviamos a dataNuevo
        if(fila[0] != null){
            dataNuevo.push(fila)
        }    
    };
    //Recorremos dataNuevo y envia el codigo a la función esconder productos
    for(var i in dataNuevo){
        if(dataNuevo[i][0] != null){
            esconderProductos(dataNuevo[i][0])
        }
    }
    //Se vuelve a cargar la tabla
    dataNuevo = [[]]
    tabla.rows().remove().draw();
    cargarProductos()
});

//Si se aprieta el botón mostrar se ejecuta la siguiente función que mostrará la lista de productos a los encargados
$('#mostrar').on( 'click', function ()  {
    var filas = $("#tabla-producto").find("tr");
    //Recorremos cada fila de la tabla
    for(i=0; i<filas.length; i++){
        var fila = []
        var celdas = $(filas[i]).find("td");
        for(j=0; j<celdas.length; j++){
            //Recorremos cada celda y la insertamos en la lista de la fila
            fila.push($(celdas[j]).text())
        }
        //Si la fila no esta vacia la inserta en dataNuevo
        if(fila[0] != null){
            dataNuevo.push(fila)
        }    
    };
    //Recorremos el data Nuevo y pasamos el codigo por parametro a la función de mostrar Productos
    for(var i in dataNuevo){
        if(dataNuevo[i][0] != null){
            mostrarProductos(dataNuevo[i][0])
        }
    }
    dataNuevo = [[]]
    tabla.rows().remove().draw();
    cargarProductos()
});

//Función de quitar productos de la lista 
quitarProductos = (id) =>{
    event.preventDefault();
    codigo = encodeURIComponent(id);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
    //El codigo see envia por formData y este se le seteara su estado como 0, para que ya no este presente en la lista de productos mostrados a los encargados
    xhr.open('put',`api/quitarProductoLista`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            swal({
                title: 'Exito',
                icon: 'success',
                text: 'Productos quitados de la lista satisfactoriamente.'
            });
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo quitar a los productos.'
            })
        }
    });
    xhr.send(formData);
}

//Función que permite mostrar los productos a los encargados
mostrarProductos = (id) =>{
    event.preventDefault();
    codigo = encodeURIComponent(id);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
    //El producto enviado por codigo será seteado como un 1 en su estado para estar la lista de productos y ser mostrado a los encargados
    xhr.open('put',`api/mostrarProductoLista`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            swal({
                title: 'Exito',
                icon: 'success',
                text: 'Productos mostrados a encargados correctamente.'
            });
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo mostrar los productos.'
            })
        }
    });
    xhr.send(formData);
}
//Función que permite ocultar los productos a los encargados
esconderProductos = (id) =>{
    event.preventDefault();
    codigo = encodeURIComponent(id);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
    //El producto enviado por codigo será seteado como un 2 en su estado para estar la lista de productos y no ser mostrado a los encargados
    xhr.open('put',`api/esconderProductoLista`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            swal({
                title: 'Exito',
                icon: 'success',
                text: 'Productos ocultados a encargados correctamente.'
            });
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo esconder los productos.'
            })
        }
    });
    xhr.send(formData);
}