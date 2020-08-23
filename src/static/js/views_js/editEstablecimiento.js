$(()=>{    
    //obtenemos las id's de nuestros select's de encargados
    var miSelect2 = document.getElementById("encargado");
     //Y los llenamos con los nick de todos los encargados de establecimientos que existen en la plataforma
    LlenarUsuarios(miSelect2);
    var miSelect = document.getElementById("encargado2");
    LlenarUsuarios(miSelect);
    //LLamamos a nuestra función que obtiene los datos del establecimiento
    getDataEstablecimiento(); 
});


getDataEstablecimiento = () =>{
    //Obtenemos el codigo de nuestro establecimiento y lo ponemos en id
    let id = $("#codigo").attr("name");
    let xhr = new XMLHttpRequest();
    //Llamamos a nuestra ruta para obtener a nuestro establecimiento pasando su codigo por parametros
    xhr.open('get',`../api/getDatosEstablecimiento/${id}`);
    xhr.responseType = "json";
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Rellenamos nuestros campos con la respuesta obtenida por la query
            let {data} = xhr.response;
            $("#codigo").val(data.codigo)
            $("#nombre").val(data.nombre)
            $("#tipo").val(data.tipo)
            $("#region").val(data.region)
            $("#comuna").val(data.comuna)
            $("#correo").val(data.correo)
            $("#direccion").val(data.direccion)
            $("#encargado").val(data.encargado)
            $("#encargado2").val(data.encargado2)
            $("#telefono").val(data.telefono)
            $("#division").val(data.division)
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo obtener los datos del establecimiento.'
            })
        }
    });
    xhr.send();
}


//Función que rellenas nuestros select de usuarios
LlenarUsuarios = (miSelect2) =>{
    let xhr = new XMLHttpRequest();
    //Llamamos a nuestra ruta del api que rellenará nuestros select's
    xhr.open('get',`../api/LlenarUsuarios`);
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Al obtener una respuesta la llenaremos en el data
            let {data} = xhr.response;
            //Recorremos todo el data para obtener los nicks de los usuarios y meterlos en el select
            for(i=0; i<data.length; i++){
                var valor = data[i].nick;
                //Creamos una nuesva opcion de nuestro select
                var aTag = document.createElement('option');
                //Obtenemos el nick y lo pondremos en la variable "value" de nuestro select
                aTag.setAttribute('value',valor);
                //Agregamos la nueva opción
                aTag.innerHTML = valor;
                miSelect2.appendChild(aTag);
            }
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error el encargado no existe.'
            })
        }
    });
    xhr.send();
}

//Función que permite editar a un establecimiento
editEstablecimiento = () =>{
    //Obtenemos los datos agregados por el usuario en la vista
    let nombre = $("#nombre").val();
    let codigo = $("#codigo").attr("name");
    let tipo = $("#tipo").val();
    let region = $("#region").val();
    let comuna = $("#comuna").val();
    let direccion = $("#direccion").val();
    let encargado = $("#encargado").val();
    let encargado2 = $("#encargado2").val();
    let telefono = $("#telefono").val();
    let division = $("#division").val();
    let correo = $("#correo").val();
    //Agregamos estos datos 
    let datos = {
        nombre:nombre,
        codigo:codigo,
        tipo:tipo,
        region:region,
        comuna:comuna,
        direccion:direccion,
        encargado:encargado,
        encargado2:encargado2,
        telefono:telefono,
        division:division,
        correo:correo
    }
    //Y los metemos encodeados en un formdata
    let formData = `data=${encodeURIComponent(JSON.stringify(datos))}`;
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta del api editEstablecimiento
    xhr.open('put',`../api/editEstablecimiento`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Si el usuario es actualizado correctamente que abra la vista de establecimientos
            window.open(`../compania`, '_self');
        }
        else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo actualizar el jardin. Revice si el encargado existe'
            })
        }
    });
    //Enviamos nuestro formdata al request
    xhr.send(formData);
}



//Si el usuario presiona el boton guardar, se llamará a la función editEstablecimiento
$("#guardar").on('click',editEstablecimiento)