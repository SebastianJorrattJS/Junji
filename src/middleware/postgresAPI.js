import connection from './coneccion';
import Passport from 'passport';
import User from '../models/user';
import nodemailer from 'nodemailer';
import moment from 'moment';

const functionQueries = {};
//Creacion de usuario y Correo

var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth:{
            user: 'minimarket.santaferia@gmail.com',
            pass: 'santaferia12-3'
        }
    })
function enviarContraseñaEmail(email, contraseña){
    var mensaje = 'Se a registrado en plataforma Junji, tu contraseña es: '+contraseña;
    var mailOptions = {
        from: 'Junji',
        to: email,
        subject: 'Tu contraseña.',
        text: '',
        html: mensaje
    }
    smtpTransport.sendMail(mailOptions, function(error){
        if(error){
            console.log('No se pudo enviar la contraseña.')
        }else{
            console.log('Contraseña enviada.')
        }
    })
}
function generarRandomPass() {
    var abecedario = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9",".","-","_","$","&","#","@"];
    var numero = 9;
    var numeroAleatorio = 3;
    var pass = '';
    console.log("hola")
    for(var i = 0; i<numero; i++){
		numeroAleatorio = parseInt(Math.random()*abecedario.length);
        pass+=abecedario[numeroAleatorio];
    }
    return pass;
}

//Gets
functionQueries.getProductos = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM producto')
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los productos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.getUser = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."user" WHERE nick = $1', [req.user.nick])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraro al usuario"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.getDatosProducto = (req,res) =>{
    connection.tx(t=>{
        return t.one("SELECT * FROM public.producto p WHERE p.serie =$1",req.params.id);
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.getEncargado = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."user" WHERE tipo_usuario_id = $1 and estado = $2',["2","1"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron a los encargados"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.getDatosEncargado = (req,res) =>{
    connection.tx(t=>{
        return t.one('SELECT * FROM public."user" u WHERE u.nick =$1',req.params.id);
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}


functionQueries.getDatosEstablecimiento = (req,res) =>{
    connection.tx(t=>{
        return t.one('SELECT * FROM public."jardin" WHERE codigo =$1',req.params.id);
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.getEstablecimiento = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."jardin" WHERE estado = $1',"1")
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los establecimientos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.getClasicos = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."jardin" WHERE estado = $1 and division = $2',["1","Clasico"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los establecimientos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.getAlternativos = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."jardin" WHERE estado = $1 and division = $2',["1","Alternativo"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los establecimientos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.getCompras= (req,res)=>{
    connection.tx(t=>{
        return t.any("SELECT c.nserie, j.nombre, TO_CHAR(c.fecha,'YYYY-MM-DD') AS fecha, c.descripcion, c.total FROM public.compra c, public.jardin j WHERE c.codigojardin = j.codigo and c.estado = $1","1");
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
  
}

functionQueries.getcomprasPendientes= (req,res)=>{
    connection.tx(t=>{
        return t.any("SELECT c.nserie, j.nombre, TO_CHAR(c.fecha,'YYYY-MM-DD') AS fecha, c.descripcion, c.total FROM public.compra c, public.jardin j WHERE c.codigojardin = j.codigo and c.estado = $1","0");
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
  
}

functionQueries.getDetalles = (req, res, next) =>{
    
    connection.tx(t=>{
        return t.any('SELECT DISTINCT pc.nserie, p.nombre, p.precio, pc.cantidad, (CAST(p.precio AS INTEGER) * CAST (pc.cantidad AS INTEGER)) AS total FROM producto p, public."productoCompra" pc WHERE p.codigo = pc.codigo and pc.nserie = $1', [req.params.id])
    })
    .then(data=>{
        res.status(200).json({data:data})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Posts
functionQueries.postProductos = (req,res,next) => {
    connection.tx(t=>{
        return t.none("INSERT INTO producto VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)", [req.body.codigo, req.body.nombre, req.body.precio, req.body.prioridad, req.body.tipo, req.body.descricion])
    })
    .then(data=>{
        res.status(200).json({data: data, msg:"Producto agregado exitosamente."})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.postEncargado = (req, res, next) => {
    User.register(
        {nick: req.body.nick, tipo_usuario_id: 2, correo: req.body.correo,  nombre: req.body.nombre, apellido: req.body.apellido, telefono: req.body.telefono, estado: '1'},
        req.body.contrasena,
        (err, user) => {
      console.log(err);
      res.json({user, err})
    });
}

functionQueries.postEstablecimiento = (req, res, next) => {
    connection.tx(t=>{
        return t.none('INSERT INTO jardin VALUES ($1, $2, $3, $4, $8, $5, $6, $7)', [req.body.codigo, req.body.tipo, req.body.region, req.body.comuna, req.body.direccion, req.body.nombre, req.body.encargado,"1"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg:"Jardin agregado exitosamente."})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Deletes
functionQueries.deleteProducto = (req,res) =>{
    connection.tx(t=>{
        return t.none('DELETE FROM public."producto" WHERE codigo =$1',req.params.id);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Producto eliminado correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.deleteEncargado = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."user" SET estado = $2 WHERE nick =$1',[req.body.nick,"0"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Encargado eliminado correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.deleteEncargadoJardin = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."jardin" SET encargado = $2 WHERE encargado =$1',[req.body.nick,"ninguno"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Jardin actualizado correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.deleteEstablecimiento = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."jardin" SET estado = $2 WHERE codigo =$1',[req.body.codigo,"0"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Jardin dado de baja correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//PUT
functionQueries.editProducto= (req,res)=>{
    req.body=JSON.parse(req.body.data)
    connection.tx(t=>{
        return t.none('UPDATE public."producto" SET codigo = $2, nombre = $1, tipo = $3, prioridad = $4, descripcion = $5 WHERE serie = $6',[req.body.nombre,req.body.codigo,req.body.tipo,req.body.prioridad,req.body.descripcion,req.body.serie])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Producto actualizado correctamente"})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.editEncargado= (req,res)=>{
    req.body=JSON.parse(req.body.data)
    connection.tx(t=>{
        return t.none('UPDATE public."user" SET nick = $1, correo = $3, telefono = $4, nombre = $2, apellido = $5  WHERE serie = $6',[req.body.nick,req.body.nombre,req.body.correo,req.body.telefono,req.body.apellido,req.body.serie])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Encargado actualizado correctamente"})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.editEstablecimiento= (req,res)=>{
    req.body=JSON.parse(req.body.data)
    connection.tx(t=>{
        return t.none('UPDATE public."jardin" SET tipo = $1, region = $3, comuna = $4, direccion = $5, nombre = $6, encargado = $7 WHERE codigo = $2',[req.body.tipo,req.body.codigo,req.body.region,req.body.comuna,req.body.direccion,req.body.nombre,req.body.encargado])
    })
    .then(data=>{
        console.log('gasgasd');
        res.status(200).json({data: data, msg: "Establecimiento actualizado correctamente"})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.quitarCompra = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."compra" SET estado = $2 WHERE nserie =$1',[req.body.nserie,"0"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Compra enviada a pendientes correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.aceptarCompra = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."compra" SET estado = $2 WHERE nserie =$1',[req.body.nserie,"1"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Solicitud aceptada correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

functionQueries.eliminarCompra = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."compra" SET estado = $2 WHERE nserie =$1',[req.body.nserie,"2"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Solicitud aceptada correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

export default functionQueries;
