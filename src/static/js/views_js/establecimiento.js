$(()=>{
    cargarEstablecimientos();
})
var tipo = ''
const tabla = $("#tabla-establecimiento").DataTable({
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    columns: [
        { data: 'codigo'},
        { data: 'tipo'},
        { data: 'comuna'},
        { data: 'direccion'},
        { data: 'nombre'},
        { data: 'encargado'},
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

cargarEstablecimientos = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/getEstablecimientos');
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
                text: 'Error al cargar los jardines.'
            })
        }
    });
    xhr.send();
}

$('#tabla-establecimiento').on( 'click', 'button', function ()  {
    let data = tabla.row( $(this).parents('tr') ).data();
    console.log(data)
    if($(this)[0].name == 'deleteButton') {
        swal({
            title: `Eliminar jardin`,
            icon: 'warning',
            text: `¿Está seguro/a de Eliminar al jardin "${data.nombre}"?`,
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
                eliminarEstablecimiento(data.codigo)
            } else {
                swal.close();
            }
        })
    }else{
        window.open(`editEstablecimiento/${data.codigo}`, '_self');
    }
});

eliminarEstablecimiento = (codigo) =>{
    event.preventDefault();
    codigo = encodeURIComponent(codigo);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
    xhr.open('put',`api/deleteEstablecimiento`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
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
                cargarEstablecimientos();
            });
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo eliminar al jardin.'
            })
        }
    });
    xhr.send(formData);
}