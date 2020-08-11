$(()=>{
    cargarProductos();
})

var dataNuevo = [[]]
var tipo = ''
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
        { defaultContent: '<input type="checkbox"> '},
        
    ],
});

volver = () =>{
    window.history.back();
}
$("#volver").on('click',volver)

cargarProductos = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/ProductosLista');
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

$('#quitar').on( 'click', function ()  {
    var filas = $("#tabla-producto").find("tr");
    for(i=0; i<filas.length; i++){
        var fila = []
        var celdas = $(filas[i]).find("td");
        for(j=0; j<celdas.length; j++){
            if($($(celdas[5]).children('input')[0]).prop('checked')){
                fila.push($(celdas[j]).text())
            }
        }
        if(fila[0] != null){
            dataNuevo.push(fila)
        }    
    };
    for(var i in dataNuevo){
        if(dataNuevo[i][0] != null){
            quitarProductos(dataNuevo[i][0])
        }
    }
    dataNuevo = [[]]
    tabla.rows().remove().draw();
    cargarProductos()
});


$('#marcar').on( 'click', function ()  {
    var filas = $("#tabla-producto").find("tr");
    for(i=0; i<filas.length; i++){
        var celdas = $(filas[i]).find("td"); 
        $($(celdas[5]).children('input')[0]).prop('checked','true')
    }
});

$('#ocultar').on( 'click', function ()  {
    var filas = $("#tabla-producto").find("tr");
    for(i=0; i<filas.length; i++){
        var fila = []
        var celdas = $(filas[i]).find("td");
        for(j=0; j<celdas.length; j++){
            fila.push($(celdas[j]).text())
        }
        if(fila[0] != null){
            dataNuevo.push(fila)
        }    
    };
    for(var i in dataNuevo){
        if(dataNuevo[i][0] != null){
            esconderProductos(dataNuevo[i][0])
        }
    }
    dataNuevo = [[]]
    tabla.rows().remove().draw();
    cargarProductos()
});


$('#mostrar').on( 'click', function ()  {
    var filas = $("#tabla-producto").find("tr");
    for(i=0; i<filas.length; i++){
        var fila = []
        var celdas = $(filas[i]).find("td");
        for(j=0; j<celdas.length; j++){
            fila.push($(celdas[j]).text())
        }
        if(fila[0] != null){
            dataNuevo.push(fila)
        }    
    };
    for(var i in dataNuevo){
        if(dataNuevo[i][0] != null){
            mostrarProductos(dataNuevo[i][0])
        }
    }
    dataNuevo = [[]]
    tabla.rows().remove().draw();
    cargarProductos()
});

quitarProductos = (id) =>{
    event.preventDefault();
    codigo = encodeURIComponent(id);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
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
mostrarProductos = (id) =>{
    event.preventDefault();
    codigo = encodeURIComponent(id);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
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
esconderProductos = (id) =>{
    event.preventDefault();
    codigo = encodeURIComponent(id);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
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