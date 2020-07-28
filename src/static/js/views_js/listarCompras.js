$(()=>{
    cargarCompras();
})
const tabla = $("#tabla-compra").DataTable({
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    columns: [
        { data: 'nserie'},
        { data: 'nombre'},
        { data: 'fecha'},
        { data: 'descripcion'},
        { defaultContent: `<button type='button' name='ver detalles' class='btn btn-primary'>
                                Ver Detalles
                                <i class="far fa-edit"></i>
                            </button>`},
        { defaultContent: `<button type='button' name='quitar' class='btn btn-primary'>
                            Quitar
                            <i class="far fa-edit"></i>
                        </button>`},
    ],
});

cargarCompras = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'api/listaCompras');
    xhr.responseType = 'json';
    xhr.addEventListener('load', ()=>{
        if(xhr.status === 200){
            let {data} = xhr.response;
            tabla.clear();
            tabla.rows.add(data);
            tabla.draw();
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error al cargar las compras.'
            })
        }
    });
    xhr.send();
}

$('#tabla-compra').on( 'click', 'button', function ()  {
    if(($(this)[0].name == 'ver detalles')){
        let data = tabla.row( $(this).parents('tr') ).data();
        window.open(`detalleCompras/${data.nserie}`, '_self');
    }else{
        let data = tabla.row( $(this).parents('tr') ).data();
        event.preventDefault();
        var serie = encodeURIComponent(data.nserie);
        let formData = `nserie=${serie}`;
        let xhr = new XMLHttpRequest();
        xhr.open('put',`api/quitarCompra`);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load',()=>{
            if(xhr.status === 200){
                swal({
                    title: 'Éxito!',
                    icon: 'success',
                    text: xhr.response.msg,
                    button: 'Ok'
                })
                .then(() => {
                    tabla.rows().remove().draw();
                    cargarCompras()
                });
            }else{
                swal({
                    title: 'Error',
                    icon: 'error',
                    text: 'No se pudo eliminar al encargado.'
                })
            }
        });
        xhr.send(formData);
    }
    
});