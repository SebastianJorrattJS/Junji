$(()=>{
    cargarProductos();
})

var dataNuevo = [[]]
var tipo = ''
const tabla = $("#tabla-producto").DataTable({
    "lengthMenu": [100],
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    columns: [
        { data: 'codigo'},
        { data: 'nombre'},
        { data: 'cantidad'},
        { defaultContent: '<input type="number" class="input" min="1" style="width:30%">'},
        { title: 'Total', sDefaultContent: ' '},
    ],
});

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

Verifica = () => {
    var valor = 1;
    var filas = $("#tabla-producto").find("tr");
    for(i=0; i<filas.length; i++){
        var celdas = $(filas[i]).find("td");
        if($($(celdas[5]).children('input')[0]).val() < 0){
            valor = 0;
        }
    }return valor
}

fnExcelReport = () =>{
    if(Verifica() == 1){
        var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
        var textRange; var j=0;
        tab = document.getElementById('tabla-producto'); // id de la tabla

        for(j = 0 ; j < tab.rows.length ; j++) 
        {   
            var celdas = $(tab.rows[j]).find("td"); 
            tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
            tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, $($(celdas[3]).children('input')[0]).val()); //Cambias los input por su valor actual
            //tab_text=tab_text+"</tr>";
        }
        tab_text=tab_text+"<tr><td></td><td></td><td></td><td>Total:</td><td>"+$('#total').val()+"</td></tr>"
        tab_text=tab_text+"</table>";
        //tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//Remueve los links de la tabla
        //tab_text= tab_text.replace(/<img[^>]*>/gi,""); // Remueve las imagenes de la tabla
        

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE "); 

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // Si el navegador es Internet Explorer
        {
            txtArea1.document.open("txt/html","replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus(); 
            sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
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

calcula = () =>{
    var dataAntiguo = tabla.rows().data();
    var filas = $("#tabla-producto").find("tr");
    var megatotal = 0;
    for(i=0; i<filas.length-1; i++){
        var celdas = $(filas[i+1]).find("td");
        var total = parseInt(dataAntiguo[i].cantidad) * $($(celdas[3]).children('input')[0]).val()
        megatotal = megatotal + total;
        $($('#tabla-producto').find('tbody > tr')[i]).children('td')[4].innerHTML = total;
    }
    $('#total').val(megatotal)
}


volver = () =>{
    window.history.back();
}
$("#efectuar").on('click',fnExcelReport)
$("#volver").on('click',volver)

$("#calcular").on('click',calcula)