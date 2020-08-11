agregarProducto = () => {
    var conf = 0;
    event.preventDefault();
    let codigo = $("#codigo").val();
    let nombre = $("#nombre").val();
    let tipo = $("#tipo").val();
    let prioridad = $("#prioridad").val();
    prioridad = parseInt(prioridad);
    let descripcion = $("#descripcion").val();
    if(codigo=="" || nombre=="" || tipo=="" || prioridad<1 || prioridad>3 || descripcion==""){
        conf=1;
    };
    codigo = encodeURIComponent(codigo);
    nombre = encodeURIComponent(nombre);
    tipo = encodeURIComponent(tipo);
    prioridad = encodeURIComponent(prioridad);
    descripcion = encodeURIComponent(descripcion);

    let formData = `codigo=${codigo}&nombre=${nombre}&precio=${1}&prioridad=${prioridad}&tipo=${tipo}&descripcion=${descripcion}`
    console.log(formData);
    let xhr = new XMLHttpRequest();
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
                text: 'No se pudo agregar el producto'
            });
        }
    });
    xhr.send(formData);
};

volver = () =>{
    window.history.back();
}
$("#volver").on('click',volver)

$("#guardar").on('click',agregarProducto);
