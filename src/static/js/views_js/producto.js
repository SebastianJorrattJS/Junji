$(()=>{
    //Se llama a la función que obtiene los productos
    cargarProductos();
})
var tipo = ''
//Se crea una tabla de Jquery datatables
const tabla = $("#tabla-producto").DataTable({
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    columns: [
        { data: 'codigo'},
        { data: 'nombre'},
        { data: 'prioridad'},
        { data: 'tipo'},
        { data: 'descripcion'},
        { defaultContent: `<button type='button' name='editar' class='btn btn-primary'>
                                Editar
                                <i class="far fa-edit"></i>
                            </button>`},
        { defaultContent: `<button type='button' name='deleteButton' class='btn btn-danger'>
                                Eliminar
                                <i class="far fa-trash-alt"></i>
                            </button>`}
    ],
});
var serie;
//Función que carga todos los productos existentes en la base de datos
cargarProductos = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/listaProductos');
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

//si se aprieta un botón en una fila de la tabla se inicia la función
$('#tabla-producto').on( 'click', 'button', function ()  {
    //se selecciona los datos de la fila en la que se apreto el botón
    let data = tabla.row( $(this).parents('tr') ).data();
    //Si el botón precionado es delete se le preguntará al usuario si desea eliminar el producto
    if($(this)[0].name == 'deleteButton') {
        swal({
            title: '¿Desea eliminar '+data.nombre+' ?',
           text: "¿Esta seguro que desea eliminar este producto?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            closeOnConfirm: false
      },function(isConfirm) {
            if (isConfirm) {
                //Si lo confirma se llamará a la función de eliminar producto
                eliminarProducto(data.codigo)
            } 
        })
    }else{
        //Si no el botón es editar, por lo que se abre la vista con el codigo del producto
        window.open(`editProducto/${data.serie}`, '_self');
    }
});

//Función que permite deshabilita un producto de la base de datos
eliminarProducto = (id) =>{
    let xhr = new XMLHttpRequest();
    xhr.open('put',`api/deleteProducto/${id}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            swal({
                title: 'Éxito!',
                icon: 'success',
                text: xhr.response.msg,
                button: 'Ok'
            })
            tabla.rows().remove().draw();
            cargarProductos();
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo eliminar al Producto.'
            })
        }
    });
    xhr.send();
}
