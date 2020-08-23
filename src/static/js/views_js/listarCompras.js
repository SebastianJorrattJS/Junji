$(()=>{
    //Llamamos a nuestra función que carga a todas las compras actuales
    cargarCompras();
})
//Creamos tabla de JQUERY
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
        { defaultContent: `<button type='button' name='quitar' class='btn btn-primary'>Quitar<i class="far fa-edit"></i></button>`},
    ],
});

//Función que permite exportar a excel
excelExportar = () =>{
    var tab_text="<meta charset='UTF-8'><table border='2px'><tr>";
    var textRange; var j=0;
    tab = document.getElementById('tabla-compra'); // id de la tabla
    //Ciclo que recorre cada fila de la tabla
    for(j = 0 ; j < tab.rows.length ; j++) {   
        //Celdas de la fila actual
        var celdas = $(tab.rows[j]).find("td"); 
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
    }
    //Se elimina cualquiera cadena que contenga
    tab_text= tab_text.replace(/<button[^>]*>|<\/button>/gi,"");
    tab_text= tab_text.replace('<th class="sorting" tabindex="0" aria-controls="tabla-compra" rowspan="1" colspan="1" aria-label="Ver Más: Activar para ordenar la columna de manera ascendente" style="width: 190px;">Ver Más</th><th class="sorting" tabindex="0" aria-controls="tabla-compra" rowspan="1" colspan="1" aria-label="Quitar: Activar para ordenar la columna de manera ascendente" style="width: 154px;">Quitar</th>',"");
    //Ciclo que busca en toda la tabla la cadena para reemplazarla
    for(j = 0 ; j < tab.rows.length; j++) {       
        tab_text= tab_text.replace('<td>Ver Detalles<i class="far fa-edit"></i></td><td>Quitar<i class="far fa-edit"></i></td>',"");
    }
    tab_text=tab_text+"</table>";
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

//Función que carga todas las compras actuales 
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

//si se aprieta un botón en una fila de la tabla se inicia la función
$('#tabla-compra').on( 'click', 'button', function ()  {
    //Si el botón precionado es ver detalles te manda a dicha vista
    if(($(this)[0].name == 'ver detalles')){
        let data = tabla.row( $(this).parents('tr') ).data();
        window.open(`detalleCompras/${data.nserie}`, '_self');
    }else{
        //Si no, significa que el botón es quitar el cual setea la descripcion y el estado de la solicitud a actual
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
                //Cargamos de nuevo la tabla
                tabla.rows().remove().draw();
                cargarCompras()
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
//Si el usuario presiona el boton "efectuar" manda a la función excelExportar
$("#efectuar").on('click',excelExportar)