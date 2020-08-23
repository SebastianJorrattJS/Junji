//Función de logeo
login = () =>{
    event.preventDefault();
    //Obtenemos los datos puestos en la vista
    let nick = $("#username").val();
    let password = $("#password").val();
    let conf = 0;
    //Si estan vacios no permite el ingreso cambiando el valor de conf
    if(nick=="" || password==""){
        conf=1;
    }; 
    //Encodeamos las variables
    nick = encodeURIComponent(nick);
    password = encodeURIComponent(password);
    //Las ingresamos en un formdata
    let formData = `nick=${nick}&password=${password}`;
    let xhr = new XMLHttpRequest();
    //Llamamos a la ruta del auth para logear al usuario
    xhr.open('post', 'auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
        if (xhr.status === 200 && conf == 0) {
            swal({
                title: 'Éxito!',
                icon: 'success',
                text: xhr.response.message,
                button: 'Entrar'
            })
            .then(() => {
                //Dependiendo del tipo de usuario accedera a su respectivo menu 1 es Administrado y 2 es Encargado
                if(xhr.response.user.tipo_usuario_id === '1'){
                    window.open('inicio', '_self');
                }
                if(xhr.response.user.tipo_usuario_id === '2'){
                    window.open('inicioEncargado', '_self');
                }
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
                    text: 'Usuario o contraseña incorrectos.'
                });
            }
        }
    });
    xhr.send(formData);
};

//Si el usuario aprieta el boton ingresar será enviado a la funcion login
$("#ingresar").on('click',login);
