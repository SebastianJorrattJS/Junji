$(()=>{
    cargarAdmins();
})
var tipo = ''
const tabla = $("#tabla-administrador").DataTable({
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    columns: [
        { data: 'nick'},
        { data: 'correo'},
        { data: 'telefono'},
        { data: 'nombre'},
        { data: 'apellido'},
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

cargarAdmins = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/getAdmin');
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
                text: 'Error al cargar a los administradores.'
            })
        }
    });
    xhr.send();
}

$('#tabla-administrador').on( 'click', 'button', function ()  {
    let data = tabla.row( $(this).parents('tr') ).data();
    if($(this)[0].name == 'deleteButton') {
        swal({
            title: `Eliminar administrador`,
            icon: 'warning',
            text: `¿Está seguro/a de Eliminar al administrador "${data.nick}"?`,
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
                eliminarAdmin(data.nick)
            } else {
                swal.close();
            }
        })
    }else{
        window.open(`editAdmin/${data.nick}`, '_self');
    }
});

eliminarAdmin = (id) =>{
    let xhr = new XMLHttpRequest();
    xhr.open('delete',`api/deleteAdmin/${id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
                cargarAdmins();
            });
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo eliminar al encargado.'
            })
        }
    });
    xhr.send(formData);
}
