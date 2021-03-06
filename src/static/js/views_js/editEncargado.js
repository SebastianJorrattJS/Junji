$(()=>{   
    //Se llama a la función que obtiene los datos  
    getEncargado();
    
});
//Declaramos variable de serie de admin
let serie;
getEncargado = () =>{
    //Obtenemos el numero de serie de nuestro usuario y lo ponemos en id
    let id = $("#nick").attr("name");
    let xhr = new XMLHttpRequest();
    //Llamamos a nuestra ruta para obtener a nuestros encargados pasando nuestra serie por parametros
    xhr.open('get',`../api/getDatosEncargado/${id}`);
    xhr.responseType = "json";
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Rellenamos nuestros campos con la respuesta obtenida por la query
            let {data} = xhr.response;
            $("#nick").val(data.nick)
            $("#nombre").val(data.nombre)
            $("#apellido").val(data.apellido)
            $("#correo").val(data.correo)
            $("#telefono").val(data.telefono)
            serie = data.serie;
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo obtener los datos del encargado.'
            })
        }
    });
    xhr.send();
}

//Función que permite editar a un administrador
editEncargado = () =>{
    let nombre = $("#nombre").val();
    let serie = $("#nick").attr("name");
    let nick = $("#nick").val();
    let apellido = $("#apellido").val();
    let correo = $("#correo").val();
    let telefono = $("#telefono").val();
    let contra = $("#contra").val();
    //Agregamos estos datos 
    let datos = {
        nick:nick,
        nombre:nombre,
        apellido:apellido,
        correo:correo,
        telefono:telefono,
        serie:serie,
        contra:contra
    }
    //Y los metemos encodeados en un formdata
    let formData = `data=${encodeURIComponent(JSON.stringify(datos))}`;
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta del api editEncargado 
    xhr.open('put',`../api/editEncargado`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Llamamos a la función que editara los nicks de los establecimientos de los cuales forma parte el encargado
            editarjardin();
             //Si el usuario es actualizado correctamente que abra la vista de encargados
            window.open(`/encargadoEstablecimiento`, '_self');
        }
        else{
            addErrorStyle(xhr.response.errors);
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo actualizar al encargado.'
            })
        }
    });
    //Enviamos nuestro formdata al request
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
    xhr.open('put',`../api/cambiarNickjardin1`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json"; 
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            editEncargado()
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
//Si el usuario presiona el boton guardar, se llamará a la función editarjardin
$("#guardar").on('click',editarjardin)