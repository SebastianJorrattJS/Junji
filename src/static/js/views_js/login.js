login = () =>{
    event.preventDefault();
    let nick = $("#username").val();
    let password = $("#password").val();
    nick = encodeURIComponent(nick);
    password = encodeURIComponent(password);
    let formData = `nick=${nick}&password=${password}`;
    let xhr = new XMLHttpRequest();
    xhr.open('post', 'auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            swal({
                title: 'Éxito!',
                icon: 'success',
                text: xhr.response.message,
                button: 'Entrar'
            })
            .then(() => {
                if(xhr.response.user.tipo_usuario_id === '1'){
                    window.open('menuAdmin', '_self');
                }
                if(xhr.response.user.tipo_usuario_id === '2'){
                    /*window.open('menuV', '_self');*/
                }
            });
        } else {
            swal({
                title: 'Error',
                icon: 'warning',
                text: 'Rut o contraseña incorrectos.'
            });
        }
    });
    xhr.send(formData);
};

$("#ingresar").on('click',login);
