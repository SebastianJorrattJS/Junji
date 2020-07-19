$(()=>{
    cargarEncargados();
})
var tipo = ''
const tabla = $("#tabla-encargado").DataTable({
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

cargarEncargados = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/getEncargado');
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
                text: 'Error al cargar a los encargados.'
            })
        }
    });
    xhr.send();
}

$('#tabla-encargado').on( 'click', 'button', function ()  {
    let data = tabla.row( $(this).parents('tr') ).data();
    if($(this)[0].name == 'deleteButton') {
        swal({
            title: `Eliminar encargado`,
            icon: 'warning',
            text: `¿Está seguro/a de Eliminar al encargado "${data.nick}"?`,
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
                eliminarEncargado(data.nick)
            } else {
                swal.close();
            }
        })
    }else{
        window.open(`editEncargado/${data.nick}`, '_self');
    }
});

eliminarEncargado = (id) =>{
    event.preventDefault();
    nick = encodeURIComponent(id);
    let formData = `nick=${nick}`;
    let xhr = new XMLHttpRequest();
    xhr.open('put',`api/deleteEncargado`);
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
                QuitarJardin(id);
                cargarEncargados();
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

QuitarJardin = (id) =>{
    event.preventDefault();
    nick = encodeURIComponent(id);
    let formData = `empleado=${nick}`;
    let xhr = new XMLHttpRequest();
    xhr.open('put',`api/deleteEncargadoJardin`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            console.log("Jardin listo")
        }
    });
    xhr.send(formData);
}