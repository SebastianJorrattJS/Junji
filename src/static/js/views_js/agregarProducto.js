//Función que agrega a un nuevo producto
agregarProducto = () => {
    var conf = 0;
    event.preventDefault();
    //conf se utilizara para verificar que todos los campos de configuración obligatorios sean rellenados
    let codigo = $("#codigo").val();
    let nombre = $("#nombre").val();
    let tipo = $("#tipo").val();
    let prioridad = $("#prioridad").val();
    prioridad = parseInt(prioridad);
    let descripcion = $("#descripcion").val();
    //Verificamos que ningún campo este vacio
    if(codigo=="" || nombre=="" || tipo=="" || prioridad<1 || prioridad>3 || descripcion==""){
        conf=1;
    };
    //Encodeamos nuestras variables
    codigo = encodeURIComponent(codigo);
    nombre = encodeURIComponent(nombre);
    tipo = encodeURIComponent(tipo);
    prioridad = encodeURIComponent(prioridad);
    descripcion = encodeURIComponent(descripcion);
    //Generamos un formdata que enviaremos al request
    let formData = `codigo=${codigo}&nombre=${nombre}&precio=${1}&prioridad=${prioridad}&tipo=${tipo}&descripcion=${descripcion}`
    console.log(formData);
    let xhr = new XMLHttpRequest();
    // Abrimos nuestra ruta del api para agregar un producto
    xhr.open('post','api/addProducto')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
        if (xhr.status === 200 && conf==0) {
            swal({
                title: 'Éxito al agregar el producto!',
                icon: 'success',
                text: xhr.response.message,
                button: 'Entrar'
            });
        } else {
            swal({
                title: 'Error',
                icon: 'warning',
                text: 'No se pudo agregar el producto. Revise si relleno todos los campos'
            });
        }
    });
     // Enviamos nuestro formdata al request
    xhr.send(formData);
};

// Si el cliente aprieta el botón guardar inicia la función para agregar a un producto
$("#guardar").on('click',agregarProducto);
