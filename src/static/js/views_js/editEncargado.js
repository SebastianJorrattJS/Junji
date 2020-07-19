$(()=>{    
    getEncargado();
});

let serie;
getEncargado = () =>{
    let id = $("#nick").attr("name");
    let xhr = new XMLHttpRequest();
    xhr.open('get',`../api/getDatosEncargado/${id}`);
    xhr.responseType = "json";
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
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

editEncargado = () =>{
    let nombre = $("#nombre").val();
    let nick = $("#nick").attr("name");
    let apellido = $("#apellido").val();
    let correo = $("#correo").val();
    let telefono = $("#telefono").val();
    let datos = {
        nick:nick,
        nombre:nombre,
        apellido:apellido,
        correo:correo,
        telefono:telefono,
        serie:serie
    }
    let formData = `data=${encodeURIComponent(JSON.stringify(datos))}`;
    let xhr = new XMLHttpRequest();
    xhr.open('put',`../api/editEncargado`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
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
    xhr.send(formData);
}

$("#guardar").on('click',editEncargado)