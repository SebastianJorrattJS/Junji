$(()=>{    
    //LLamamos a nuestra función que obtiene los datos del producto
    getDataProducto();
});
var codigoAnt;
var serie;
getDataProducto = () =>{
    //Obtenemos el numero de serie de nuestro producto y lo ponemos en id
    let id = $("#codigo").attr("name");
    let xhr = new XMLHttpRequest();
    //Llamamos a nuestra ruta para obtener a nuestro producto pasando su serie por parametros
    xhr.open('get',`../api/getProducto/${id}`);
    xhr.responseType = "json";
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Rellenamos nuestros campos con la respuesta obtenida por la query
            let {data} = xhr.response;
            serie = data.serie;
            $("#codigo").val(data.codigo)
            codigoAnt = data.codigo;
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

//Función que permite editar a un producto
editProducto = () =>{
    //Obtenemos los datos agregados por el usuario en la vista
    let serial = serie;
    let nombre = $("#nombre").val();
    let codigo = $("#codigo").val();
    let tipo = $("#tipo").val();
    let prioridad = $("#prioridad").val();
    prioridad = parseInt(prioridad);
    let descripcion = $("#descripcion").val();
    //Agregamos estos datos 
    let datos = {
        nombre:nombre,
        codigo:codigo,
        tipo:tipo,
        prioridad:prioridad,
        descripcion:descripcion,
        serie:serial
    }
    //Y los metemos encodeados en un formdata
    let formData = `data=${encodeURIComponent(JSON.stringify(datos))}`;
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta del api editar un producto
    xhr.open('put',`../api/editProducto`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Si el usuario es actualizado correctamente que abra la vista de productos
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
    //Enviamos nuestro formdata al request
    xhr.send(formData);
}

cambiarProductoCompra = () =>{
    //Obtenemos los datos agregados por el usuario en la vista
    let codigo = $("#codigo").val();
    //Agregamos estos datos 
    let datos = {
        codigo:codigo,
        codigoAnt:codigoAnt,
    }
    //Y los metemos encodeados en un formdata
    let formData = `data=${encodeURIComponent(JSON.stringify(datos))}`;
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta del api editar el codigo de las compras
    xhr.open('put',`../api/editProductoCompra`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = "json";  
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Si el usuario es actualizado correctamente que abra la vista de productos
            editProducto()
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
    //Enviamos nuestro formdata al request
    xhr.send(formData);
}

//Si el usuario presiona el boton guardar, se llamará a la función editproducto
$("#guardar").on('click',cambiarProductoCompra)
