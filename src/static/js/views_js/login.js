login = () =>{
    event.preventDefault();
    let nick = $("#username").val();
    let password = $("#password").val();
    let conf = 0;
    if(nick=="" || password==""){
        conf=1;
    }; 
    nick = encodeURIComponent(nick);
    password = encodeURIComponent(password);
    let formData = `nick=${nick}&password=${password}`;
    let xhr = new XMLHttpRequest();
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
                if(xhr.response.user.tipo_usuario_id === '1'){
                    window.open('inicio', '_self');
                }
                if(xhr.response.user.tipo_usuario_id === '2'){
                    /*window.open('menuV', '_self');*/
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

$("#ingresar").on('click',login);
