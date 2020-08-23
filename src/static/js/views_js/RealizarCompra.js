$(()=>{
    //Se llama a la función que obtiene los productos que se han solicitado
    cargarProductos();
})

var dataNuevo = [[]]
var tipo = ''
//Creamos la tabla donde se cargarán los datos de los productos y las cantidades totales de estos en las solicitudes actuales
const tabla = $("#tabla-producto").DataTable({
    "lengthMenu": [100],
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    columns: [
        { data: 'codigo'},
        { data: 'nombre'},
        { defaultContent: '<input type="number" class="input" min="1" style="width:40%">'},
        { defaultContent: '<input type="number" value="0" class="input" min="1" style="width:30%">'},
        { title: 'Precio Uni. Bruto', sDefaultContent: '0'},
        { title: 'Sub total Neto', sDefaultContent: '0'},
        { title: 'Sub total Bruto', sDefaultContent: '0'}
    ],
});

//Función que carga todos los productos que se han solicitados
cargarProductos = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/cargaExportar');
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            let {data} = xhr.response;
            tabla.clear();
            tabla.rows.add(data);
            tabla.draw();
            //Se obtienen las filas de la tabla
            var filas = $("#tabla-producto").find("tr");
            //Ciclo que recorre cada fila
            for(i=0; i<filas.length-1; i++){
                //Se obtienen las celdas de la fila actual
                var celdas = $(filas[i+1]).find("td");
                //Se llena el input de cantidad con el total puesto los establecimientos
                $($(celdas[2]).children('input')[0]).val(data[i].cantidad);
            }
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error al cargar los productos.'
            })
        }
    });
    xhr.send();
}

//Función que verifica que la cantidad no sea un numero negativo
Verifica = () => {
    var valor = 1;
    var filas = $("#tabla-producto").find("tr");
    for(i=0; i<filas.length; i++){
        var celdas = $(filas[i]).find("td");
        if($($(celdas[3]).children('input')[0]).val() < 0 || $($(celdas[2]).children('input')[0]).val() < 0){
            valor = 0;
        }
    }return valor
}
//Función que permite exportar a excel
excelExportar = () =>{
    //Se llama a la función verifica para asegurarse de que no existan numeros negativos
    if(Verifica() == 1){
        var tab_text="<meta charset='UTF-8'><table border='2px'><tr bgcolor='#87AFC6'>";
        var textRange; var j=0;
        tab = document.getElementById('tabla-producto'); // id de la tabla
        //Ciclo que recorre cada fila de la tabla
        for(j = 0 ; j < tab.rows.length ; j++) 
        {   
            var celdas = $(tab.rows[j]).find("td"); 
            tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
            tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, $($(celdas[2]).children('input')[0]).val());
            tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, $($(celdas[3]).children('input')[0]).val()); //Cambias los input por su valor actual
            //tab_text=tab_text+"</tr>";
        }
        //Se elimina cualquiera cadena que contenga
        tab_text=tab_text+"<tr><td></td><td></td><td></td><td>Total:</td><td>"+$('#total').val()+"</td></tr>"
        tab_text=tab_text+"</table>";
        //tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//Remueve los links de la tabla
        //tab_text= tab_text.replace(/<img[^>]*>/gi,""); // Remueve las imagenes de la tabla
        
        //Verificamos que navegador estamos ocupando
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE "); 

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // Si el navegador es Internet Explorer
        {
            txtArea1.document.open("txt/html","replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus(); 
            sa=txtArea1.document.execCommand("SaveAs",true,"TotalSolicitudes.xls");
        }  
        else                 //Si se ocupa cualquier otro navegador
            sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

        return (sa);
    }else{
        swal({
            title: 'Error',
            icon: 'error',
            text: 'Error ingrese números válidos.'
        })
    }
}

//Función que llena la tabla con los calculos necesarios
calcula = () =>{
    //Guardamos los datos actuales un la variable dataAntiguo
    var dataAntiguo = tabla.rows().data();
    var filas = $("#tabla-producto").find("tr");
    var megatotal = 0;
    //Recorremos cada fila de la tabla
    for(i=0; i<filas.length-1; i++){
        //Indicamos las celdas de esa fila
        var celdas = $(filas[i+1]).find("td");
        //Calculamos el precio en iva, para esto multiplicamos el porcentaje de iva con el precio normal y dividimos en 100 y luego lo sumamos con el precio normal
        var iva = ((parseInt($('#iva').val()) * parseInt($($(celdas[3]).children('input')[0]).val())) / 100) + parseInt($($(celdas[3]).children('input')[0]).val());
        //Caculamos el total normal multiplicando la cantidad de cada producto con el precio puesto por el usuario
        var total = parseInt(dataAntiguo[i].cantidad) * parseInt($($(celdas[3]).children('input')[0]).val())
        //Calculamos el total de iva multiplicado el precio en iva por la cantidad por producto
        var totaliva = parseInt(dataAntiguo[i].cantidad) * iva
        //Sumamos los valores totales para ponerlos al final de la pagina
        megatotal = megatotal + totaliva;
        //Rellenamos los datos por fila
        $($('#tabla-producto').find('tbody > tr')[i]).children('td')[4].innerHTML = iva;
        $($('#tabla-producto').find('tbody > tr')[i]).children('td')[5].innerHTML = total;
        $($('#tabla-producto').find('tbody > tr')[i]).children('td')[6].innerHTML = totaliva;
    }
    //Indicamos el final total llamando al input de la vista por su id
    $('#total').val(megatotal)
}



//Estos botones al ser presionados llaman a sus respectivas funciones
$("#efectuar").on('click',excelExportar)

$("#calcular").on('click',calcula)