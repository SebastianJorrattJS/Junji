$(()=>{
    //Llamamos a nuestra función que carga a todos los encargados
    cargarEncargados();
})
var tipo = ''
//Creamos nuestra tabla de Jquery datatables que será llenado por la base de datos y los botones de funcionalidad
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

//Función que carga los datos de cada encargado
cargarEncargados = () =>{
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta que obtiene a cada encargado en la api
    xhr.open('get','api/getEncargado');
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Rellenamos la tabla con los datos obtenidos por la query
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

//si se aprieta un botón en una fila de la tabla se inicia la función
$('#tabla-encargado').on( 'click', 'button', function ()  {
    //Obtenemos los datos de la fila seleccionada
    let data = tabla.row( $(this).parents('tr') ).data();
    //Si el botón precionado es delete preguntamos al usuario si desea Eliminar al encargado (Aunque seguira presente en la base de datos)
    if($(this)[0].name == 'deleteButton') {
        swal({
            title: '¿Desea eliminar a '+data.nombre+' ?',
           text: "¿Esta seguro que desea eliminar a este encargado?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            closeOnConfirm: false
      },function(isConfirm) {
            if (isConfirm) {
                //Si se confirma llama al afunción para eliminar un encargado (Deshabilitar)
                eliminarEncargado(data.nick)
            } 
        })
    }else{
        //Si el botón no era un delete era un editar, por lo que abrimos esta vista
        window.open(`editEncargado/${data.serie}`, '_self');
    }
});

//Función que permite eliminar (Deshabilitar) a un encargado
eliminarEncargado = (id) =>{
    event.preventDefault();
    //Encodeamos el nick del encargado y lo enviamos en un formdata
    nick = encodeURIComponent(id);
    let formData = `nick=${nick}`;
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta del api que permite eliminar a un ecnargado 
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
            //Si funciona llamamos a la función quitar establecimiento y cargamos la tabla de nuevo
            tabla.rows().remove().draw();
            QuitarJardin(id);
            cargarEncargados();
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo eliminar al encargado.'
            })
        }
    });
    //Enviamos nuestro formdata al request
    xhr.send(formData);
}

//Función que elimina a un encargado de su establecimiento al haber sido Deshabilitado
QuitarJardin = (id) =>{
    event.preventDefault();
    nick = encodeURIComponent(id);
    let formData = `empleado=${nick}`;
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta del api que saca al encargado de un establecimiento
    xhr.open('put',`api/deleteEncargadoJardin`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){

        }
    });
   //Enviamos nuestro formdata al request
    xhr.send(formData);
}