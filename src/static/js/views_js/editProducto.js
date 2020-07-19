$(()=>{    
    getDataProducto();
});


getDataProducto = () =>{
    let id = $("#codigo").attr("name");
    let xhr = new XMLHttpRequest();
    xhr.open('get',`../api/getProducto/${id}`);
    xhr.responseType = "json";
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            let {data} = xhr.response;
            $("#codigo").val(data.codigo)
            $("#nombre").val(data.nombre)
            $("#tipo").val(data.tipo)
            $("#prioridad").val(data.prioridad.toString())
            $("#descripcion").val(data.descripcion)
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo obtener los datos del producto.'
            })
        }
    });
    xhr.send();
}

editProducto = () =>{
    
    let nombre = $("#nombre").val();
    let codigo = $("#codigo").attr("name");
    let tipo = $("#tipo").val();
    let prioridad = $("#prioridad").val();
    prioridad = parseInt(prioridad);
    let descripcion = $("#descripcion").val();
    let datos = {
        nombre:nombre,
        codigo:codigo,
        tipo:tipo,
        prioridad:prioridad,
        descripcion:descripcion
    }
    let formData = `data=${encodeURIComponent(JSON.stringify(datos))}`;
    let xhr = new XMLHttpRequest();
    xhr.open('put',`../api/editProducto`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            window.open(`/producto`, '_self');
        }
        else{
            addErrorStyle(xhr.response.errors);
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo actualizar el producto.'
            })
        }
    });
    xhr.send(formData);
}

$("#guardar").on('click',editProducto)