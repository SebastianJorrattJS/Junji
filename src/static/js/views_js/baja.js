$(()=>{
    //Llamamos la función que cargara nuestros establecimientos
    cargarEstablecimientos();
})
//Rellenamos nuestra tabla con los datos de los establecimientos y un boton que servirá para recuperar un establcimiento dado de baja
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
        { data: 'telefono'},
        { data: 'encargado'},
        { data: 'encargado2'},
        { data: 'division'},
        { defaultContent: `<button type='button' name='recuperar' class='btn btn-primary'>
                                Recuperar
                                <i class="far"></i>
                            </button>`}
    ],
});

//Función que permite cargar los establecimientos
cargarEstablecimientos = () =>{
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta que obtiene a los establecimientos dados de baja
    xhr.open('get','api/getBaja');
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Rellenamos la tabla con la respuesta de nuestro request
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

//Si apretamos un boton de nuestra tabla llamamos a la siguiente función
$('#tabla-establecimiento').on( 'click', 'button', function ()  {
    //Obtenemos los datos de nuestra dila y enviamos el código de establecimiento a la función
    let data = tabla.row( $(this).parents('tr') ).data();
    RecuperaEstablecimientos(data.codigo)
});

//Función que permite recuperar un establecimiento
RecuperaEstablecimientos = (codigo) =>{
    event.preventDefault();
    //Encodeamos el codigo y lo mandamos al request
    codigo = encodeURIComponent(codigo);
    let formData = `codigo=${codigo}`;
    let xhr = new XMLHttpRequest();
    xhr.open('put',`api/RecuperarEstablecimiento`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Si tubo exito ahora este establecimiento no deberia aparecer en la tabla porque se recuperó
            swal({
                title: 'Éxito!',
                icon: 'success',
                text: xhr.response.msg,
                button: 'Ok'
            })
            //Cargamos de nuevo nuestra tabla
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
    // Enviamos nuestro formdata al request
    xhr.send(formData);
}