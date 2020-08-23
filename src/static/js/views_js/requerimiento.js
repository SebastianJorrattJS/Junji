$(()=>{
    //Función que carga todos los productos 
    cargarProductos();
})

var dataNuevo = [[]]
var tipo = ''
//Creamos la tabla de JQUERY
const tabla = $("#tabla-producto").DataTable({
    //Le indicamos que se veran 100 filas (Se pueden poner mas opciones esto es para no tener problemas al recorrer la tabla, lo ideal es que carguen todos los elementos)
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
        { defaultContent: '<input type="checkbox" style="transform: scale(2.0)"> '},
        
    ],
});

//Cargamos los productos que esten habilitados para que el administrador los pueda enviar a la lista que creará para los encargados 
cargarProductos = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/ProductosaListar');
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
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

//Si se apriera el botón agregar se activa la funcion
$('#agregar').on( 'click', function ()  {
    //Se obtiene las filas de las tablas
    var filas = $("#tabla-producto").find("tr");
    //Se recorren las filas
    for(i=0; i<filas.length; i++){
        var fila = []
        //Se obtienen las celdas por fila
        var celdas = $(filas[i]).find("td");
        //Se recorren las celdas
        for(j=0; j<celdas.length; j++){
            //Si la ultima celda esta activada en la check box se añade la celda actual a la lista fila 
            if($($(celdas[5]).children('input')[0]).prop('checked')){
                fila.push($(celdas[j]).text())
            }
        }
        // si la fila no esta vacia se agrega a dataNuevo, si estubiera vacia significa que esa fila no tenia el check activado
        if(fila[0] != null){
            dataNuevo.push(fila)
        }    
    };
    //Recorremos este dataNuevo
    for(var i in dataNuevo){
        //Si el primer elemento no esta vacio lo enviamos a la función agregarProductos
        if(dataNuevo[i][0] != null){
            agregarProductos(dataNuevo[i][0])
        }
    }
    //Reseteamos dataNuevo y cargamos de nuevo la tabla
    dataNuevo = [[]]
    tabla.rows().remove().draw();
    cargarProductos()
});

//Función que agrega los productos a la lista seteando su estado (0 que no estan en la lista, 1 que estan y se muestran y 2 que estan en la lista pero ocultos a los encargados)
agregarProductos = (id) =>{
    event.preventDefault();
    //El valor entregado por parametro es el codigo del producto usamos este para lcoalizar el producto
    codigo = encodeURIComponent(id);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
    xhr.open('put',`api/agregaProductoLista`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            swal({
                title: 'Exito',
                icon: 'success',
                text: 'Productos agregados de la lista satisfactoriamente.'
            });
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo agregar a los productos.'
            })
        }
    });
    xhr.send(formData);
}