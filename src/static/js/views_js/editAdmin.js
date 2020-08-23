$(()=>{    
    //Se llama a la función que obtiene los datos 
    getAdmin();
});
//Declaramos variable de serie de admin
let serie;
getAdmin = () =>{
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
editAdmin = () =>{
    //Obtenemos los datos rellenados por el usuario actual en la vista
    let nombre = $("#nombre").val();
    let serie= $("#nick").attr("name");
    let nick= $("#nick").val()
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
    //Llamamos a la ruta del api editEncargado (a pesar de ser un admin en este caso se hace lo mismo que el encargado asi que reutilizamos esa función)
    xhr.open('put',`../api/editEncargado`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Si el usuario es actualizado correctamente que abra la vista de administradores
            window.open(`/administrador`, '_self');
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

//Si el usuario aprieta el boton guardar llama a la función editAdmin
$("#guardar").on('click',editAdmin)