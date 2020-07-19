$(()=>{
    cargarProductos();
})
var tipo = ''
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

$('#tabla-producto').on( 'click', 'button', function ()  {
    let data = tabla.row( $(this).parents('tr') ).data();
    console.log(data)
    if($(this)[0].name == 'deleteButton') {
        swal({
            title: `Eliminar producto`,
            icon: 'warning',
            text: `¿Está seguro/a de Eliminar el producto "${data.codigo}"?`,
            buttons: {
                confirm: {
                    text: 'Eliminar',
                    value: 'exec'
                },
                cancel: {
                    text: 'Cancelar',
                    value: 'cancelar',
                    visible: true
                }
            }
        })
        .then(action => {
            if(action == 'exec') {
                eliminarProducto(data.codigo)
            } else {
                swal.close();
            }
        })
    }else{
        window.open(`editProducto/${data.codigo}`, '_self');
    }
});

eliminarProducto = (id) =>{
    let xhr = new XMLHttpRequest();
    xhr.open('delete',`api/deleteProducto/${id}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            swal({
                title: 'Éxito!',
                icon: 'success',
                text: xhr.response.msg,
                button: 'Ok'
            })
            .then(() => {
                tabla.rows().remove().draw();
                cargarProductos();
            });
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
