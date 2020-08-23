$(()=>{
    //Se llama a la función que obtiene todas las solicitudes del usuario actual
    cargarCompras();
    //Se esconde el boton de anulados
    $("#anulados").toggle()
})
//Se crea una tabla de Jquery datatables
const tabla = $("#tabla-compra").DataTable({
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    columns: [
        { data: 'nserie'},
        { data: 'codigojardin'},
        { data: 'nombre'},
        { data: 'fecha'},
        { defaultContent: `<button type='button' name='ver detalles' class='btn btn-primary'>
                                Ver Detalles
                                <i class="far fa-edit"></i>
                            </button>`}
    ],
});

//Función que carga todo el historial y solicitudes actuales del usuario
cargarCompras = () =>{
    //Cambiamos el titulo y cambiamos de estado los botones (anulados ahora se muestra e historial se esconde)
    $("#titulo").text("Historial de compras")
    $("#anulados").toggle()
    $("#historial").toggle()
    let xhr = new XMLHttpRequest();
    //Ruta de api que contiene la funcion con la query que carga todas las solicitudes del usuario
    xhr.open('get', 'api/listaMisCompras');
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

//Función que carga todo el historial de solicitudes anuladas del usuario
cargarComprasAnuladas = () =>{
     //Cambiamos el titulo y cambiamos de estado los botones
    $("#titulo").text("Historial de compras anuladas")
    $("#anulados").toggle()
    $("#historial").toggle()
    let xhr = new XMLHttpRequest();
    //Ruta de api que contiene la funcion con la query que carga todas las solicitudes anuladas del usuario
    xhr.open('get', 'api/listaMisComprasNulas');
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

//Si aprietas el boton de una fila de la tabla 
$('#tabla-compra').on( 'click', 'button', function ()  {
    //si es de ver detalles te mandara a dicha vista con la serie de la solicitud
    if(($(this)[0].name == 'ver detalles')){
        let data = tabla.row( $(this).parents('tr') ).data();
        window.open(`detalleMisCompras/${data.nserie}`, '_self');
    }
});

//Según el botón seleccionado se cargará una de las 2 funciones
$("#anulados").on('click',cargarComprasAnuladas)
$("#historial").on('click',cargarCompras)