$(()=>{
     //Llamamos a nuestra función que carga a todos los establecimientos
    cargarEstablecimientos();
})
var tipo = ''
//Creamos nuestra tabla de Jquery datatables que será llenado por la base de datos y los botones de funcionalidad
const tabla = $("#tabla-establecimiento").DataTable({
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    columns: [
        { data: 'codigo'},
        { data: 'tipo'},
        { data: 'correo'},
        { data: 'comuna'},
        { data: 'direccion'},
        { data: 'nombre'},
        { data: 'telefono'},
        { data: 'encargado'},
        { data: 'encargado2'},
        { defaultContent: `<button type='button' name='editar' class='btn btn-primary'>
                                Editar
                                <i class="far fa-edit"></i>
                            </button>`},
        { defaultContent: `<button type='button' name='deleteButton' class='btn btn-danger'>
                            Deshabilitar
                                <i class="far fa-trash-alt"></i>
                            </button>`}
    ],
});
//Función que carga los datos de cada establecimientos
cargarEstablecimientos = () =>{
    let xhr = new XMLHttpRequest();
     //Llamamos a la ruta que obtiene a cada establecimiento en la api
    xhr.open('get','api/getEstablecimientos');
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
                text: 'Error al cargar los jardines.'
            })
        }
    });
    xhr.send();
}

//Función que carga solamente establecimientos del tipo alternativo
cargarAlternativos = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/getAlternativos');
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

//Función que carga solamente establecimientos del tipo clasicos
cargarClasicos = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/getClasicos');
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

//Función que carga solamente establecimientos del tipo MDS
cargarmds = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/getMDS');
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

//si se aprieta un botón en una fila de la tabla se inicia la función
$('#tabla-establecimiento').on( 'click', 'button', function ()  {
    //Obtenemos los datos de la fila seleccionada
    let data = tabla.row( $(this).parents('tr') ).data();
    //Si el botón precionado es delete preguntamos al usuario si desea Eliminar al establecimiento (Aunque seguira presente en la base de datos)
    if($(this)[0].name == 'deleteButton') {
        swal({
            title: '¿Desea deshabilitar el establecimiento '+data.nombre+' ?',
           text: "¿Esta seguro que desea deshabilitar este establecimiento?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Deshabilitar',
            closeOnConfirm: false
      },function(isConfirm) {
            if (isConfirm) {
                //Si se confirma llama al afunción para eliminar un establecimiento (Deshabilitar)
                eliminarEstablecimiento(data.codigo)
            }
        })
    }else{
        //Si el botón no era un delete era un editar, por lo que abrimos esta vista
        window.open(`compania/${data.codigo}`, '_self');
    }
});

//Función que permite eliminar (Deshabilitar) a un establecimiento
eliminarEstablecimiento = (codigo) =>{
    event.preventDefault();
    //Encodeamos el nick del establecimiento y lo enviamos en un formdata
    codigo = encodeURIComponent(codigo);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
     //Llamamos a la ruta del api que permite eliminar a un establecimiento
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
            //Si funciona cargamos la tabla de nuevo
            tabla.rows().remove().draw();
            cargarEstablecimientos();
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

//Según el botón apretado cargara una de las siguientes opciones
$("#todos").on('click',cargarEstablecimientos)
$("#clasicos").on('click',cargarClasicos)
$("#alternativos").on('click',cargarAlternativos)
$("#mds").on('click',cargarmds)