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

$('#agregar').on( 'click', function ()  {
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
            agregarProductos(dataNuevo[i][0])
        }
    }
    dataNuevo = [[]]
    tabla.rows().remove().draw();
    cargarProductos()
});

agregarProductos = (id) =>{
    event.preventDefault();
    codigo = encodeURIComponent(id);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
    xhr.open('put',`api/agregaProductoLista`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            console.log("Logrado")
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