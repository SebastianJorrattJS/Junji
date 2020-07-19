agregarEncargado = () => {
    event.preventDefault();
    let conf = 0;
    let nick = $("#nick").val();
    let nombre = $("#nombre").val();
    let apellido = $("#apellido").val();
    let correo = $("#correo").val();
    let telefono = $("#telefono").val();
    let contrasena = $("#contra").val();
    if(nick=="" || nombre=="" || apellido=="" || correo=="" || telefono=="" || contrasena==""){
        conf=1;
    }; 

    nick = encodeURIComponent(nick);
    nombre = encodeURIComponent(nombre);
    apellido = encodeURIComponent(apellido);
    correo = encodeURIComponent(correo);
    telefono = encodeURIComponent(telefono);
    contrasena = encodeURIComponent(contrasena);
    let formData = `nick=${nick}&nombre=${nombre}&apellido=${apellido}&correo=${correo}&telefono=${telefono}&contrasena=${contrasena}`

    let xhr = new XMLHttpRequest();
    xhr.open('post', 'api/addEncargado');
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
    console.log(formData);
    xhr.send(formData);
};

$("#guardar").on('click',agregarEncargado);