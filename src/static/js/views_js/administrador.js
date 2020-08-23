$(()=>{
    //Llamamos a la funcion para llenar nuestra tabla
    cargarAdmins();
})
//Declaramos nuestra tabla e indicamos como se llenará, las variables tipo data se rellenarán en nuestra función que llamara a la base de datos
//Los botones se llenarán con el codigo respectivo en html
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

//Función que carga los datos de todos los administradores
cargarAdmins = () =>{
    let xhr = new XMLHttpRequest();
    //Se inicia el request en la ruta getAdmin que contiene la función del api para obtener los administradores
    xhr.open('get','api/getAdmin');
    //Indicamos que la respuesta sera de tipo json
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        //Si la query funciona  se llena la tabla con lo obtenido de esta 
        if(xhr.status === 200){
            //data contendra la respuesta 
            let {data} = xhr.response;
            tabla.clear();
            tabla.rows.add(data);
            tabla.draw();
        }else{
            //Si no, indicamos que hubo un error
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error al cargar a los administradores.'
            })
        }
    });
    xhr.send();
}

//si en la tabla de administradores se hace click en un botón se llama a la siguiente función
$('#tabla-administrador').on( 'click', 'button', function ()  {
    // en data obtendremos los datos de la fila en la que se apretó el botón
    let data = tabla.row( $(this).parents('tr') ).data();
    //Si el boton apretado tiene su variable nombre (html) como deleteButton entonces preguntamos si desea eliminar al usuario
    if($(this)[0].name == 'deleteButton') {
        swal({
            title: '¿Desea eliminar '+data.nombre+' ?',
           text: "¿Esta seguro que desea eliminar este administrador?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            closeOnConfirm: false
      },function(isConfirm) {
            if (isConfirm) {
                //Si se confirma entonces llamamos a la función de eliminar con el nick del usuario por parametros
                eliminarAdmin(data.nick)
            }
        })
    }else{
        //Si no es delete entonces es un editar, por lo que abrimos la vista para editar administradores y le pasamos su numero de serie (esta en la fila que fue seleccionada)
        window.open(`editAdmin/${data.serie}`, '_self');
    }
});

//Función para eliminar a un administrador
eliminarAdmin = (id) =>{
    let xhr = new XMLHttpRequest();
    //Llamamos al eliminar del api desde esta ruta, y por parametros le pasamos su numero de serie (id)
    xhr.open('delete',`api/deleteAdmin/${id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Si se elimino correctamente avisamos y cargamos nuevamente la tabla
            swal({
                title: 'Éxito!',
                icon: 'success',
                text: xhr.response.msg,
                button: 'Ok'
            })
                tabla.rows().remove().draw();
                cargarAdmins();
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo eliminar al encargado.'
            })
        }
    });
    xhr.send();
}
