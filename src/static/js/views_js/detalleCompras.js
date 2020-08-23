$(()=>{    
    //Llamamos a la función que obtendrá los producots de una compra en especifico cuyo numero de serial se pasó por parametros
    getDataDetalles();
});

//Se genera una tabla la que será rellenada con sus datos en postgresql
const tabla = $("#table-detallesCompra").DataTable({
    language: {
        url: '../js/utils_js/jquery.datatable.spanish.json'
    },
    columns: [
        { data: 'nserie'},
        { data: 'nombre'},
        { data: 'cantidad'},
    ],
});

//Función que obtendrá los datos de cada producto que se encuentre en la compra solicitada
getDataDetalles = () =>{
    //Obtenemos el numero de serie de la compra
    let id = $("#id").attr("name");
    let xhr = new XMLHttpRequest();
    //Enviamos por ruta del api este numero por parametro
    xhr.open('get',`../api/getDetalles/${id}`);
    xhr.responseType = "json";
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            //Rellenamos nuestra tabla con los datos obtenidos
            let {data} = xhr.response;
            tabla.clear();
            tabla.rows.add(data);
            tabla.draw();
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'No se pudo obtener los datos de la compra.'
            })
        }
    });
    xhr.send();
}

//Función que exporta nuestra tabla a una plantilla de excel
excelExport = () =>{
    //Indicamos el tipo de string de nuestra tabla en utf-8 y generamos la tabla
    var tab_text="<meta charset='UTF-8'><table border='2px'><tr bgcolor='#87AFC6'>";
    var j=0;
    tab = document.getElementById("table-detallesCompra"); // id de la tabla
    //Ciclo que recorrera nuestra tabla
    for(j = 0 ; j < tab.rows.length ; j++){   
        //Fijamos las celdas de la fila obtenida por el ciclo
        var celdas = $(tab.rows[j]).find("td"); 
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>"; //Rellenamos una variable de texto con el contenido html de nuestra tabla 
    }
    //Le indicamos que termino la tabla
    tab_text=tab_text+"</table>";

    //Verificamos en que navegador estamos usando esta aplicacion 
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {     // Si el navegador es Internet Explorer
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"TotalSolicitudes.xls");
    }  
    else                 //Si se ocupa cualquier otro navegador
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  
    return (sa);
}

//Si el usuario aprieta este botón "efectuar" llama a la funcion excelExport
$("#efectuar").on('click',excelExport)