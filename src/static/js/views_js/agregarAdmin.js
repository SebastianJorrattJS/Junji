//Función que agrega a un nuevo administrador
agregarAdmin = () => {
    event.preventDefault();
    //conf se utilizara para verificar que todos los campos de configuración obligatorios sean rellenados
    let conf = 0;
    //llenamos nuestras variables según las id de nuestros imputs de nuestra vista (views)
    let nick = $("#nick").val();
    let nombre = $("#nombre").val();
    let apellido = $("#apellido").val();
    let correo = $("#correo").val();
    let telefono = $("#telefono").val();
    let contrasena = $("#contra").val();
    //Verificamos que ningún campo este vacio
    if(nick=="" || nombre=="" || apellido=="" || correo=="" || telefono=="" || contrasena==""){
        conf=1;
    }; 
    //Encodeamos nuestras variables
    nick = encodeURIComponent(nick);
    nombre = encodeURIComponent(nombre);
    apellido = encodeURIComponent(apellido);
    correo = encodeURIComponent(correo);
    telefono = encodeURIComponent(telefono);
    contrasena = encodeURIComponent(contrasena);
    //Generamos un formdata que enviaremos al request
    let formData = `nick=${nick}&nombre=${nombre}&apellido=${apellido}&correo=${correo}&telefono=${telefono}&contrasena=${contrasena}`
    let xhr = new XMLHttpRequest();
    // Abrimos nuestra ruta del api para agregar un administrador
    xhr.open('post', 'api/addAdmin');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
        if (xhr.status === 200 && conf == 0) {
            swal({
                title: 'Éxito al registrar!',
                icon: 'success',
                text: xhr.response.message,
                button: 'Entrar'
            });
        } else {
            //Si no a rellenado todos los campos
            if(conf == 1){
                swal({
                    title: 'Error',
                    icon: 'error',
                    text: 'Debe rellenar todos los campos.'
                })
            }else{
                swal({
                    title: 'Error',
                    icon: 'warning',
                    text: 'No se pudo registrar'
                });
            } 
        }
    });
    // Enviamos nuestro formdata al request
    xhr.send(formData);
};

// Si el cliente aprieta el botón guardar inicia la función para agregar a un administrador
$("#guardar").on('click',agregarAdmin);