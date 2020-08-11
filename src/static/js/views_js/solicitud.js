$(()=>{
    
    let tipo = $("#tipo").val()
    cargarProductos();
    cargarSelect(tipo);
})

var dataNuevo = [[]]
var tipo = ''
const tabla = $("#tabla-producto").DataTable({
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    "lengthMenu": [100],
    columns: [
        { data: 'codigo'},
        { data: 'nombre'},
        { data: 'prioridad'},
        { data: 'tipo'},
        { data: 'descripcion'},
        { defaultContent: '<input type="number" class="cant" value=0 name="cant" min="1" style="width:30%">'},
    ],
});

cargarProductos = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/ListaSolicitud');
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

cargarSelect = (id) =>{
    var miSelect2 = document.getElementById("establecimiento");
    var length = miSelect2.options.length;
    for (i = length-1; i >= 0; i--) {
        miSelect2.options[i] = null;
    }
    let xhr = new XMLHttpRequest();
    xhr.open('get',`api/cargaEstablecimientos/${id}`);
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            let {data} = xhr.response;
            for(i=0; i<data.length; i++){
                var valor = data[i].nombre;
                var aTag = document.createElement('option');
                aTag.setAttribute('value',valor);
                aTag.innerHTML = valor;
                miSelect2.appendChild(aTag);
            }
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error al cargar los establecimientos.'
            })
        }
    });
    xhr.send();
} 

buscarCodigo = () =>{
    if(Verifica() == 1){
        let id = $("#establecimiento").val()
        let xhr = new XMLHttpRequest();
        xhr.open('get',`api/buscarCodigo/${id}`);
        xhr.responseType ='json';
        xhr.addEventListener('load',()=>{
            if(xhr.status === 200){
                let {data} = xhr.response;
                valor = data[0].codigo
                console.log(valor)
                crearCompra(valor)
            }else{
                swal({
                    title: 'Error',
                    icon: 'error',
                    text: 'Error al encontrar el establecimiento.'
                })
                return null;
            }
        });
        xhr.send();
    }else{
        swal({
            title: 'Error',
            icon: 'error',
            text: 'Error ingrese números válidos.'
        })
    }
}

crearCompra = (codigo) =>{
    event.preventDefault();
    var conf = 0;
    var nserie = $('#nserie').val()
    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();

    var fecha = d.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (day<10 ? '0' : '') + day;

    if(nserie == ""){
        conf = 1;
    }
    codigo = encodeURIComponent(codigo);
    nserie = encodeURIComponent(nserie);
    fecha = encodeURIComponent(fecha);
    let formData = `codigo=${codigo}&nserie=${nserie}&fecha=${fecha}`
    let xhr = new XMLHttpRequest();
    xhr.open('post','api/creaCompra')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
        if (xhr.status === 200 && conf==0) {
            console.log("Logrado")
            efectuar()
        } else {
            swal({
                title: 'Error',
                icon: 'warning',
                text: 'No se pudo crear la compra'
            });
        }
    });
    xhr.send(formData);
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

efectuar = () =>{
    var filas = $("#tabla-producto").find("tr");
    for(i=0; i<filas.length; i++){
        var fila = []
        var celdas = $(filas[i]).find("td");
        for(j=0; j<celdas.length; j++){
            fila.push($(celdas[j]).text())
        }
        fila.push($($(celdas[5]).children('input')[0]).val())
        if(fila[0] != null){
            dataNuevo.push(fila)
        }    
    };
    
        for(var i in dataNuevo){
            console.log(dataNuevo[i][0])
            if(dataNuevo[i][0] != null && dataNuevo[i][6] > 0){
                console.log(dataNuevo[i][0])
                compraProducto(dataNuevo[i][0],dataNuevo[i][6])
            }
        }
    
    dataNuevo = [[]]
}



compraProducto = (id, cant) =>{
    var nserie = $('#nserie').val()
    codigo = encodeURIComponent(id);
    nserie = encodeURIComponent(nserie);
    cant = encodeURIComponent(cant);
    let formData2 = `codigo=${codigo}&nserie=${nserie}&cant=${cant}`
    event.preventDefault();
    let xhr2 = new XMLHttpRequest();
    xhr2.open('post',`api/compraProducto`);
    xhr2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr2.responseType ='json';
    xhr2.addEventListener('load',()=>{
        if(xhr2.status === 200){
            console.log("LOOOGRADO")
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error al insertar las compras.'
            })
        }
    });
    xhr2.send(formData2);
}

volver = () =>{
    window.history.back();
}
cambio = () =>{
    let tipo = $("#tipo").val()
    cargarSelect(tipo)
}

$("#volver").on('click',volver)



$("#tipo").change(cambio);

$("#efectuar").on('click',buscarCodigo)

