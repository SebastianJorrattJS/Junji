$(()=>{
    //Se llama a la función que obtiene el historial de solicitudes pasadas 
    cargarCompras();
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
        { data: 'descripcion'},
        { defaultContent: `<button type='button' name='ver detalles' class='btn btn-primary'>Ver Detalles<i class="far fa-edit"></i></button>`},
        { defaultContent: `<button type='button' name='aceptar' class='btn btn-primary'>Aceptar<i class="far fa-edit"></i></button>`},
        { defaultContent: `<button type='button' name='delete' class='btn btn-danger'>Anular<i class="far fa-trash-alt"></i></button>`},
    ],
});
//Función que permite exportar a excel
excelExportar = () =>{
    var tab_text='<meta charset="UTF-8"><table border="2px"><tr>';
    var textRange; var j=0;
    tab = document.getElementById('tabla-compra'); // id de la tabla
    //Ciclo que recorre cada fila de la tabla
    for(j = 0 ; j < tab.rows.length ; j++) {   
        var celdas = $(tab.rows[j]).find("td"); 
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
    }
    //Se elimina cualquiera cadena que contenga
    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<button[^>]*>|<\/button>/gi,"");
    tab_text= tab_text.replace('<th class="sorting" tabindex="0" aria-controls="tabla-compra" rowspan="1" colspan="1" aria-label="Ver más: Activar para ordenar la columna de manera ascendente" style="width: 174px;">Ver más</th><th class="sorting" tabindex="0" aria-controls="tabla-compra" rowspan="1" colspan="1" aria-label="Aceptar: Activar para ordenar la columna de manera ascendente" style="width: 171px;">Aceptar</th><th class="sorting" tabindex="0" aria-controls="tabla-compra" rowspan="1" colspan="1" aria-label="Anular: Activar para ordenar la columna de manera ascendente" style="width: 150px;">Anular</th>',"");
    //Ciclo que busca en toda la tabla la cadena para reemplazarla
    for(j = 0 ; j < tab.rows.length - 1 ; j++) {       
        tab_text= tab_text.replace('<td>Ver Detalles<i class="far fa-edit"></i></td><td>Aceptar<i class="far fa-edit"></i></td><td>Anular<i class="far fa-trash-alt"></i></td>',"");
    }
    //tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//Remueve los links de la tabla
    //tab_text= tab_text.replace(/<img[^>]*>/gi,""); // Remueve las imagenes de la tabla
    
    //Verificamos que navegador estamos ocupando
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {     // Si el navegador es Internet Explorer
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"TotalSolicitudes.xls");
    }else                 //Si se ocupa cualquier otro navegador
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

    return (sa);
}

//Función que carga todas las compras pasadas
cargarCompras = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'api/comprasPendientes');
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

//si se aprieta un botón en una fila de la tabla se inicia la función
$('#tabla-compra').on( 'click', 'button', function ()  {
    //Si el botón precionado es ver detalles te manda a dicha vista
    if(($(this)[0].name == 'ver detalles')){
        let data = tabla.row( $(this).parents('tr') ).data();
        window.open(`detalleCompras/${data.nserie}`, '_self');
    }else if(($(this)[0].name == 'aceptar')){
        //Si no, significa que el botón puede ser aceptar el cual devuelve una compra pasada al listado de compras actuales
        let data = tabla.row( $(this).parents('tr') ).data();
        event.preventDefault();
        var serie = encodeURIComponent(data.nserie);
        let formData = `nserie=${serie}`;
        let xhr = new XMLHttpRequest();
        //Ruta del api que cambia el estado de una solicitud de pasada a actual
        xhr.open('put',`api/aceptarCompra`);
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
                tabla.rows().remove().draw();
                cargarCompras();
            }else{
                swal({
                    title: 'Error',
                    icon: 'error',
                    text: 'No se pudo eliminar al encargado.'
                })
            }
        });
        xhr.send(formData);
    }else if(($(this)[0].name == 'delete')){
        //Si no significa que debe ser un anular
        let data = tabla.row( $(this).parents('tr') ).data();
        event.preventDefault();
        var serie = encodeURIComponent(data.nserie);
        let formData = `nserie=${serie}`;
        let xhr = new XMLHttpRequest();
        //Se llama a la ruta del api que cambia una solicitud aceptada a anulada y de estado
        xhr.open('put',`api/eliminarCompra`);
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
                //Se vuelven a cargar la tabla
                tabla.rows().remove().draw();
                cargarCompras();
            }else{
                swal({
                    title: 'Error',
                    icon: 'error',
                    text: 'No se pudo eliminar al encargado.'
                })
            }
        });
        //Se envia el form data 
        xhr.send(formData);
    }
    
});

//si el usuario aprieta el boton efectuar podra exportar la tabla actual a un excel
$("#efectuar").on('click',excelExportar)