$(()=>{
    //obtenemos las id's de nuestros select's de encargados
    var miSelect2 = document.getElementById("encargado");
    //Y los llenamos con los nick de todos los encargados de establecimientos que existen en la plataforma
    LlenarUsuarios(miSelect2);
    var miSelect = document.getElementById("encargado2");
    LlenarUsuarios(miSelect);
   $("#region").val("Coquimbo");
});

//Función que agrega a un nuevo establecimiento
agregarEstablecimiento = () => {
    event.preventDefault();
    //conf se utilizara para verificar que todos los campos de configuración obligatorios sean rellenados
    let conf = 0;
    //llenamos nuestras variables según las id de nuestros imputs de nuestra vista (views)
    let codigo = $("#codigo").val();
    let correo = $("#correo").val();
    let nombre = $("#nombre").val();
    let tipo = $("#tipo").val();
    let region = $("#region").val();
    let comuna = $("#comuna").val();
    let direccion = $("#direccion").val();
    let encargado = $("#encargado").val();
    let encargado2 = $("#encargado2").val();
    let telefono = $("#telefono").val();
    let division = $("#division").val();
    //Verificamos que ningún campo este vacio
    if(codigo=="" || nombre=="" || tipo=="" || region=="" || comuna=="" || direccion==""){
        conf=1;
    };
    //Encodeamos nuestras variables
    codigo = encodeURIComponent(codigo);
    correo = encodeURIComponent(correo);
    nombre = encodeURIComponent(nombre);
    tipo = encodeURIComponent(tipo);
    region = encodeURIComponent(region);
    comuna = encodeURIComponent(comuna);
    direccion = encodeURIComponent(direccion);
    encargado = encodeURIComponent(encargado);
    encargado2 = encodeURIComponent(encargado2);
    telefono = encodeURIComponent(telefono);
    division = encodeURIComponent(division);
    //Generamos un formdata que enviaremos al request
    let formData = `codigo=${codigo}&correo=${correo}&nombre=${nombre}&tipo=${tipo}&region=${region}&comuna=${comuna}&direccion=${direccion}&encargado=${encargado}&encargado2=${encargado2}&telefono=${telefono}&division=${division}`
    let xhr = new XMLHttpRequest();
    // Abrimos nuestra ruta del api para agregar un establecimiento
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
                //Si no a rellenado todos los campos
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
// Si el cliente aprieta el botón guardar inicia la función para agregar a un encargado
$("#guardar").on('click',agregarEstablecimiento);

//Función que rellenas nuestros select de usuarios
LlenarUsuarios = (miSelect2) =>{
    let xhr = new XMLHttpRequest();
    //Llamamos a nuestra ruta del api que rellenará nuestros select's
    xhr.open('get',`../api/LlenarUsuarios`);
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Al obtener una respuesta la llenaremos en el data
            let {data} = xhr.response;
            //Recorremos todo el data para obtener los nicks de los usuarios y meterlos en el select
            for(i=0; i<data.length; i++){
                var valor = data[i].nick;
                //Creamos una nuesva opcion de nuestro select
                var aTag = document.createElement('option');
                //Obtenemos el nick y lo pondremos en la variable "value" de nuestro select
                aTag.setAttribute('value',valor);
                //Agregamos la nueva opción
                aTag.innerHTML = valor;
                miSelect2.appendChild(aTag);
            }
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error el encargado no existe.'
            })
        }
    });
    xhr.send();
}
