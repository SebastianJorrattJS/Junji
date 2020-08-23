$(()=>{ 
    //Le decimos al usuario que su cuenta se cerrara por precaución  
    swal({
        title: 'Cuidado',
        icon: 'warning',
        text: 'Al apretar "Guardar". Se cerrara su sesión por seguridad.',
        confirmButtonText: 'Continuar'
    });  
    //Obtenemos los datos actuales del encargado
    getEncargado();
});
let serie;

//Obtener datos del encargado
getEncargado = () =>{
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta que permite obtener los datos del encargado actual
    xhr.open('get',`api/getConfiguracion`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Rellenamos sus datos en la vista
            let {data} = xhr.response;
            $("#nick").val(data.nick)
            $("#nombre").val(data.nombre)
            $("#apellido").val(data.apellido)
            $("#correo").val(data.correo)
            $("#telefono").val(data.telefono)
            serie = data.serie
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo obtener sus datos.'
            })
        }
    });
    xhr.send();
}

//Función que cierra la seción del usuario
CerrarSecion = () =>{
    //Llamamos a la función para cambiar el nick del usuario en cada establecimiento en que tome parte
    editarjardin()
    //Llamamos a la función que permite editar al usuario
    editConf()
    event.preventDefault();
    let xhr2 = new XMLHttpRequest();
    //Llamamos al cerrar seción del auth
	xhr2.open('get', '../auth/logout');
	xhr2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr2.send();
	window.open('../', '_self');
}

editConf = () =>{
    //Rellenamos nuestras variables llamando a la id de los input rellenados por el usuario
    let boole = 0;
    let nombre = $("#nombre").val();
    let nick = $("#nick").val();
    let apellido = $("#apellido").val();
    let correo = $("#correo").val();
    let telefono = $("#telefono").val();
    let contra = $("#contra").val();
    //Si no se a rellenado la contraseña tendrá que rellenarla
    if(contra == ""){
        boole = 1;
    }
    //Indicamos los datos que serán enviados al request
    let datos = {
        nick:nick,
        nombre:nombre,
        apellido:apellido,
        correo:correo,
        telefono:telefono,
        contra:contra,
        serie:serie
    }
    //Agregamos los datos encodeados a un formdata
    let formData = `data=${encodeURIComponent(JSON.stringify(datos))}`;
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta para editar la configuración de un usuario
    xhr.open('put',`api/editConfiguracion`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200 && boole == 0){
            //Si funciona nos debe enviar al inicio y luego cerrar nuestra seción
            window.open('/inicio', '_self');
        }
        else{
            addErrorStyle(xhr.response.errors);
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error al cargar configuración.'
            })
        }
    });
    // Enviamos nuestro formdata al request
    xhr.send(formData);
}

//Función que permite editar los nick del usuario en sus establecimientos
editarjardin = () =>{
    //Obtenemos el nick puesto por el usuario en la vista y su numero de serie
    let nick = $("#nick").val();
    let datos = {
        nick:nick,
        serie:serie
    }
    //Los encodeamos
    let formData = `data=${encodeURIComponent(JSON.stringify(datos))}`;
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta del api para cambiar el nick de cualquier establecimiento al que pertenesca el usuario
    xhr.open('put',`api/cambiarNickjardin1`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
    
        }
        else{
            addErrorStyle(xhr.response.errors);
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error al cargar configuración.'
            })
        }
    });
    // Enviamos nuestro formdata al request
    xhr.send(formData);  
}

//Si el usuario presiona el boton guardar, se llamará a la función CerrarSecion
$("#guardar").on('click',CerrarSecion)