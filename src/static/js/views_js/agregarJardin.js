$(()=>{
   $("#region").val("Coquimbo");
});

agregarEstablecimiento = () => {
    event.preventDefault();
    let conf = 0;
    let codigo = $("#codigo").val();
    let nombre = $("#nombre").val();
    let tipo = $("#tipo").val();
    let region = $("#region").val();
    let comuna = $("#comuna").val();
    let direccion = $("#direccion").val();
    let encargado = $("#encargado").val();
    if(codigo=="" || nombre=="" || tipo=="" || region=="" || comuna=="" || direccion=="" || encargado==""){
        conf=1;
    };

    codigo = encodeURIComponent(codigo);
    nombre = encodeURIComponent(nombre);
    tipo = encodeURIComponent(tipo);
    region = encodeURIComponent(region);
    comuna = encodeURIComponent(comuna);
    direccion = encodeURIComponent(direccion);
    encargado = encodeURIComponent(encargado);

    let formData = `codigo=${codigo}&nombre=${nombre}&tipo=${tipo}&region=${region}&comuna=${comuna}&direccion=${direccion}&encargado=${encargado}`

    let xhr = new XMLHttpRequest();
    xhr.open('post', 'api/addEstablecimiento');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
        if (xhr.status === 200 && conf == 0) {
            swal({
                title: 'Éxito al registrar nuevo jardin!',
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

$("#guardar").on('click',agregarEstablecimiento);
