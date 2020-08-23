$(()=>{
    //Cargamos los productos
    cargarProductos();
    //Cargamos el select de establecimientos del usuario
    cargarSelect();
    //Llamamos a esta función que busca cual es el ultimo serial de solicitud realizado
    BuscaNserie()
})
//Iniciamos el numero de serie en 1 en caso de ser la primera solicitud de la plataforma
let nserie = 1;
var dataNuevo = [[]]
var tipo = ''
//Creamos la tabla de Jquery datatables
const tabla = $("#tabla-producto").DataTable({
    language: {
        url: 'js/utils_js/jquery.datatable.spanish.json'
    },
    //Le indicamos que se veran 100 filas (Se pueden poner mas opciones esto es para no tener problemas al recorrer la tabla, lo ideal es que carguen todos los elementos)
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
//Función que busca el serial mas alto en la base de datos 
BuscaNserie = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open('get','api/BuscarSerie');
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            let {data} = xhr.response;
            //Acá indicamos el serial nuevo que se le atribuira a la tabla productoCompra 
            nserie = data[0].nserie + 1
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

//Función que carga los productos y los rellena en la tabla 
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

//Según el usuario de establecimiento pasado por parametros rellena la combo box con todos los establecimientos del encargado
cargarSelect = () =>{
    var miSelect2 = document.getElementById("establecimiento");
    var length = miSelect2.options.length;
    //Se asegura de vaciar la comboBox cada ves que se llame la función
    for (i = length-1; i >= 0; i--) {
        miSelect2.options[i] = null;
    }
    let xhr = new XMLHttpRequest();
    //Se llama a la ruta del api que obtiene los establecimientos del usuario actual
    xhr.open('get',`api/cargaMisEstablecimientos`);
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            let {data} = xhr.response;
            for(i=0; i<data.length; i++){
                 //Se ingresan los valores obtenidos al Select
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

//Función que se encarga de buscar el codigo de un establecimiento
buscarCodigo = () =>{
    //Si la solicitud cumple con los requerimientos
    if(Verifica() == 1){
        //se Busca el codigo del jardin según su nombre
        let id = $("#establecimiento").val()
        let xhr = new XMLHttpRequest();
        xhr.open('get',`api/buscarCodigo/${id}`);
        xhr.responseType ='json';
        xhr.addEventListener('load',()=>{
            if(xhr.status === 200){
                let {data} = xhr.response;
                valor = data[0].codigo
                //Al encontrar el codigo se llama a la función para crear la compra
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
//Función que agrega la compra actual a la base de datos
crearCompra = (codigo) =>{
    event.preventDefault();
    var conf = 0;
     //Se adjunta la fecha actual
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();

    var fecha = (day<10 ? '0' : '') + day + '/' +
        (month<10 ? '0' : '') + month + '/' +   
        d.getFullYear() ;
    //Se encodean los datos
    codigo = encodeURIComponent(codigo);
    nserie = encodeURIComponent(nserie);
    fecha = encodeURIComponent(fecha);
    let formData = `codigo=${codigo}&fecha=${fecha}`
    let xhr = new XMLHttpRequest();
    xhr.open('post','api/creaCompra')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            swal({
                title: 'Éxito!',
                icon: 'success',
                text: xhr.response.message,
                button: 'Entrar'
            })
            //Si se creo la compra correctamente se llama a la función efectuar que agrega cada producto a la base de datos con sus cantidades
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
//Función que verifica que no se haya ingresado un numero negativo en el input
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
//Función que recorre toda la tabla para seleccionar los productos
efectuar = () =>{
    var filas = $("#tabla-producto").find("tr");
    //Se recorren las filas
    for(i=0; i<filas.length; i++){
        var fila = []
        //Se seleccionan las celdas 
        var celdas = $(filas[i]).find("td");
        for(j=0; j<celdas.length; j++){
            //Se agrega cada celda de la fila actual a la variables fila
            fila.push($(celdas[j]).text())
        }
        //Insertamos la ultima celda el valor del input
        fila.push($($(celdas[5]).children('input')[0]).val())
        //Si la fila no esta vacia se agrega a dataNuevo
        if(fila[0] != null){
            dataNuevo.push(fila)
        }    
    };
        //Recorremos este dataNuevo
        for(var i in dataNuevo){
            //Si el primer valor no es nulo y la ultima celda posee una cantidad mayor a 0 se llama a la función compraProducto enviando el codigo y la cantidad
            if(dataNuevo[i][0] != null && dataNuevo[i][6] > 0){
                console.log(dataNuevo[i][0])
                compraProducto(dataNuevo[i][0],dataNuevo[i][6])
            }
        }
    //Reseteamos la matriz dataNuevo
    dataNuevo = [[]]
}


//Función que llena la base de datos con cada producto seleccionado en la solicitud actual
compraProducto = (id, cant) =>{
    codigo = encodeURIComponent(id);
    nserie = encodeURIComponent(nserie);
    cant = encodeURIComponent(cant);
    let formData2 = `codigo=${codigo}&nserie=${nserie}&cant=${cant}`
    event.preventDefault();
    let xhr2 = new XMLHttpRequest();
    //Ruta del api que llena la tabla productoCompra
    xhr2.open('post',`api/compraProducto`);
    xhr2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr2.responseType ='json';
    xhr2.addEventListener('load',()=>{
        if(xhr2.status === 200){
            swal({
                title: 'Exito',
                icon: 'success',
                text: 'Se logró generar la compra'
            });
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
//Si el usuario aprieta el botón efectuar se llama a la función buscarCodigo
$("#efectuar").on('click',buscarCodigo)

