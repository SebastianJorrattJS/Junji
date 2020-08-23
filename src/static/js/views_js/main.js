$(document).ready(function(){
	//Funciones que se ejecutan al iniciar una vista
	ObtenerNombre();
	/*Mostrar ocultar area de notificaciones*/
	$('.btn-Notification').on('click', function(){
        var ContainerNoty=$('.container-notifications');
        var NotificationArea=$('.NotificationArea');
        if(NotificationArea.hasClass('NotificationArea-show')&&ContainerNoty.hasClass('container-notifications-show')){
            NotificationArea.removeClass('NotificationArea-show');
            ContainerNoty.removeClass('container-notifications-show');
        }else{
            NotificationArea.addClass('NotificationArea-show');
            ContainerNoty.addClass('container-notifications-show');
        }
    });
    /*Mostrar ocultar menu principal*/
    $('.btn-menu').on('click', function(){
    	var navLateral=$('.navLateral');
    	var pageContent=$('.pageContent');
    	var navOption=$('.navBar-options');
    	if(navLateral.hasClass('navLateral-change')&&pageContent.hasClass('pageContent-change')){
    		navLateral.removeClass('navLateral-change');
    		pageContent.removeClass('pageContent-change');
    		navOption.removeClass('navBar-options-change');
    	}else{
    		navLateral.addClass('navLateral-change');
    		pageContent.addClass('pageContent-change');
    		navOption.addClass('navBar-options-change');
    	}
	});
    /*Salir del sistema*/
    $('.btn-exit').on('click', function(){
    	swal({
		  	title: '¿Desea salir del sistema?',
		 	text: "La sesión será cerrada y volverá a la pantalla para iniciar sesión",
		  	type: 'warning',
		  	showCancelButton: true,
		  	confirmButtonText: 'Salir',
		  	closeOnConfirm: false
		},
		function(isConfirm) {
		  	if (isConfirm) {
				event.preventDefault();
				//Llamamos a la ruta del auth para cerrar secion
				let xhr = new XMLHttpRequest();
				xhr.open('get', '../auth/logout');
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhr.send();
				window.open('../', '_self');
			}
		});
    });
    /*Mostrar y ocultar submenus*/
    $('.btn-subMenu').on('click', function(){
    	var subMenu=$(this).next('ul');
    	var icon=$(this).children("span");
    	if(subMenu.hasClass('sub-menu-options-show')){
    		subMenu.removeClass('sub-menu-options-show');
    		icon.addClass('zmdi-chevron-left').removeClass('zmdi-chevron-down');
    	}else{
    		subMenu.addClass('sub-menu-options-show');
    		icon.addClass('zmdi-chevron-down').removeClass('zmdi-chevron-left');
    	}
    });
});

//Función que obtiene los datos del usuario actual en este caso se obtiene el nick y el tipo de perfil
ObtenerNombre = () => {
	let xhr = new XMLHttpRequest();
    xhr.open('get','../api/ObtenerUser');
    xhr.responseType ='json';
    xhr.addEventListener('load',()=>{
        if(xhr.status === 200){
			let {data} = xhr.response;
			nombres(data[0].nick);
			//Según el tipo de perfil carga una de las 2 imagenes de perfil
			if(data[0].perfil == "Mujer"){
				$(".Perfil").attr("src", "../assets/img/avatar-male.png")
            }else{
				$(".Perfil").attr("src", "../assets/img/avatar-male2.png")
			}
        }else{
            swal({
                title: 'Error',
                icon: 'error',
                text: 'Error al cargar datos del usuario.'
            })
        }
    });
    xhr.send();
}
//Función que modifica el nombre en pantalla del usuario
nombres = (nick) => {
	$('#nombre1').text(nick)
	$('#nombre2').text(nick)
};

//Si se selecciona una imagen de clase perfil se activa el siguiente metodo
$(".Perfil").on("click", function(){
	let xhr = new XMLHttpRequest();
	//Se llama a la ruta del api que permite cambiar el tipo de perfil
	xhr.open('put',`../api/cambiarPerfil`);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.responseType = 'json';
	xhr.addEventListener('load',()=>{
		if(xhr.status === 200){
			//Se llama a la función para cargar el nombre y perfil
			ObtenerNombre();
		}else{
			swal({
				title: 'Error',
				icon: 'error',
				text: 'No se pudo cambiar su imagen de perfil'
			})
		}
	});
	xhr.send();
});

//Funcion que valida que los valores ingresados sean numericos
function validaNumericos(event) {
    if(event.charCode >= 48 && event.charCode <= 57){
      return true;
     }
     return false;        
}