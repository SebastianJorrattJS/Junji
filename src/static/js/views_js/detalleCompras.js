$(()=>{    
    getDataDetalles();
});

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

getDataDetalles = () =>{
    let id = $("#id").attr("name");
    let xhr = new XMLHttpRequest();
    xhr.open('get',`../api/getDetalles/${id}`);
    xhr.responseType = "json";
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
            let {data} = xhr.response;
            console.log(data)
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

volver = () =>{
    window.history.back();
}
$("#volver").on('click',volver)