import empty from 'is-empty';
import Rut from 'rutjs';
import validator from 'validator';
import moment from 'moment';

const validationFunctions = {};

export const validarUsuario = validationFunctions.validarUsuario = (payload) =>{
    let errors = {};
    let isValid = true;
    let message = '';
    if(payload){
        if(empty(payload.user)) {
            isValid = false;
            errors.user = "Ingrese un usuario";
        }
    }else{
        message= "Error al recibir los datos del formulario";
        isValid = false;
    }
    return {isValid,errors,message};
}


export default validationFunctions;