$(()=>{    
    getDataEstablecimiento();
});


getDataEstablecimiento = () =>{
    let id = $("#codigo").attr("name");
    let xhr = new XMLHttpRequest();
    xhr.open('get',`../api/getDatosEstablecimiento/${id}`);
    xhr.responseType = "json";
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            let {data} = xhr.response;
            $("#codigo").val(data.codigo)
            $("#nombre").val(data.nombre)
            $("#tipo").val(data.tipo)
            $("#region").val(data.region)
            $("#comuna").val(data.comuna)
            $("#direccion").val(data.direccion)
            $("#encargado").val(data.encargado)
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

editEstablecimiento = () =>{
    
    let nombre = $("#nombre").val();
    let codigo = $("#codigo").attr("name");
    let tipo = $("#tipo").val();
    let region = $("#region").val();
    let comuna = $("#comuna").val();
    let direccion = $("#direccion").val();
    let encargado = $("#encargado").val();
    let datos = {
        nombre:nombre,
        codigo:codigo,
        tipo:tipo,
        region:region,
        comuna:comuna,
        direccion:direccion,
        encargado:encargado
    }
    let formData = `data=${encodeURIComponent(JSON.stringify(datos))}`;
    let xhr = new XMLHttpRequest();
    xhr.open('put',`../api/editEstablecimiento`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            window.open(`/compania`, '_self');
        }
        else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo actualizar el jardin.'
            })
        }
    });
    xhr.send(formData);
}

$("#guardar").on('click',editEstablecimiento)