import connection from './coneccion'; //Llamamos a la conección con postgresql
import User from '../models/user'; //
import nodemailer from 'nodemailer';


const functionQueries = {};

//Creacion de usuario y Correo Funciones para enviar un correo a un nuevo usuario con su contraseña
var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'plataformajunji@gmail.com', //Correo que enviara el mail (Modificable) Se debe quitar la seguridad en el gmail o no permitira acceder desde la aplicacion
            pass: 'paginajunji123'
        }
    })
function enviarContraseñaEmail(email, contraseña){
    var mensaje = 'Se a registrado en plataforma Junji, tu contraseña es: '+contraseña;
    var mailOptions = {
        from: 'plataformajunji@gmail.com',
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


//Gets
//Obtiene todos los datos de todos los productos habilitados (No eliminados)
functionQueries.getProductos = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM producto Where habilitado = $1', "1")
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los productos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Se encuentra el numero de serie mas alto en la base de datos de las compras
functionQueries.getBuscarSerie = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT nserie FROM compra WHERE nserie = (select max(nserie) from compra)')
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los productos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Se obtienen todos los productos que tengan estado 1 o 2 (Que estan en la lista de productos para mostrar a encargados)
functionQueries.getProductosLista = (req, res, next) =>{
    connection.tx(t=>{
        return t.any("SELECT * FROM producto Where (estado = '1' or estado = '2') and habilitado = '1'")
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los productos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Se obtienen todos los productos que tengan estado 0 (Que no estan en la lista de productos para mostrar a encargados)
functionQueries.getProductosaListar = (req, res, next) =>{
    connection.tx(t=>{
        return t.any("SELECT * FROM producto Where estado = '0' and habilitado = '1'")
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los productos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Se obtienen todos los productos que tengan estado 1 (Que estan en la lista de productos para mostrar a encargados y que se habilito poder mostrar a encargados)
functionQueries.getListaSolicitud = (req, res, next) =>{
    connection.tx(t=>{
        return t.any("SELECT * FROM producto Where estado = '1' and habilitado = '1'")
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los productos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Se obtiene los datos del usuario según el nick
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

//Se obtienen los establecimientos segun el tipo (division) y el estado = 1 (Que no este dado de baja)
functionQueries.cargaEstablecimientos = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."jardin" WHERE estado = $2 and division = $1', [req.params.id, "1"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraro al establecimiento"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Obtenemos los establecimientos en el que el usuario actual sea ya sea encargado 1 o 2 de dicho establecimiento
functionQueries.cargaMisEstablecimientos = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."jardin" WHERE estado = $2 and (encargado = $1 or encargado2 = $1)', [req.user.nick, "1"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraro a los establecimiento"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Obtiene la suma de las cantidad de cada productos que se haya solicitado en una compra con estado 1 (Que es actual)
functionQueries.cargaExportar = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT DISTINCT p.codigo, p.nombre, SUM(pc.cantidad) as cantidad FROM public."producto" p, public."productoCompra" pc, public."compra" c WHERE c.estado = $1 and c.nserie = pc.nserie and pc.codigo = p.codigo GROUP BY p.codigo, p.nombre', ["1"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraro al establecimiento"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Se obtienen todos los establecimientos según su nombre (obtiene todos sus datos aunque se usa para obtener solo el codigo)
functionQueries.buscarCodigo = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."jardin" WHERE nombre = $1', req.params.id)
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontro al establecimiento"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Obtiene todos los datos de un producto según el codigo que sea enviado como parametro
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

//Se obtiene a todos los usuario de tipo 2 = Encargado, y que tengan estado 1 (Que no hayan sido desahibilitados)
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

//Se obtiene a todos los usuario de tipo 1 = Administrador, y que tengan estado 1 (Que no hayan sido desahibilitados)
functionQueries.getAdmin = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."user" WHERE tipo_usuario_id = $1 and estado = $2',["1","1"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron a los encargados"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Obtiene todos los datos de un usuario encargado según su numero de serie
functionQueries.getDatosEncargado = (req,res) =>{
    connection.tx(t=>{
        return t.one('SELECT * FROM public."user" u WHERE u.serie =$1',req.params.id);
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Obtiene los datos del usuario actual según su nick
functionQueries.getConfiguracion = (req,res) =>{
    connection.tx(t=>{
        return t.one('SELECT * FROM public."user" WHERE nick = $1',[req.user.nick]);
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Obtiene los datos del establecimiento según el codigo enviado por parametros
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

//Obtiene todos los establecimientos que no esten dados de baja
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

//Obtiene a todos los establecimientos dados de baja 
functionQueries.getBaja = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."jardin" WHERE estado = $1',"0")
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los establecimientos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Obtiene a todos los establecimientos no dados de baja y que sean clasicos 
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

//Obtiene a todos los establecimientos no dados de baja y que sean alternativos 
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

//Obtiene a todos los establecimientos no dados de baja y que sean MDS
functionQueries.getMDS = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('SELECT * FROM public."jardin" WHERE estado = $1 and division = $2',["1","MDS"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Se encontraron los establecimientos"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Obtiene todas las solicitudes actuales con sus datos de establecimiento que la realizo
functionQueries.getCompras= (req,res)=>{
    connection.tx(t=>{
        return t.any("SELECT c.nserie, c.codigojardin, j.nombre, TO_CHAR(c.fecha,'DD-MM-YYYY') AS fecha, c.descripcion FROM public.compra c, public.jardin j WHERE c.codigojardin = j.codigo and c.estado = $1","1");
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
  
}

//Obtiene todas las solicitudes actuales o en historial del usuario actual
functionQueries.listaMisCompras= (req,res)=>{
    connection.tx(t=>{
        return t.any("SELECT c.nserie, c.codigojardin, j.nombre, TO_CHAR(c.fecha,'DD-MM-YYYY') AS fecha, c.descripcion FROM public.compra c, public.jardin j WHERE c.codigojardin = j.codigo and (j.encargado = $2 or j.encargado2 = $2) and (c.estado = $1 or c.estado = $3)",["1",req.user.nick,"0"]);
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
  
}

//Obtiene todas las solicitudes anuladas del usuario actual
functionQueries.listaMisComprasNulas= (req,res)=>{
    connection.tx(t=>{
        return t.any("SELECT c.nserie, c.codigojardin, j.nombre, TO_CHAR(c.fecha,'DD-MM-YYYY') AS fecha, c.descripcion FROM public.compra c, public.jardin j WHERE c.codigojardin = j.codigo and (j.encargado = $2 or j.encargado2 = $2) and c.estado = $1",["2",req.user.nick]);
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
  
}

//Obtiene todas las solicitudes que ya esten en historial ya sean de tipo 0 = ACEPTADAS  o de tipo 2 = ANULADAS esto se define en la descripcion
functionQueries.getcomprasPendientes= (req,res)=>{
    connection.tx(t=>{
        return t.any("SELECT c.nserie, c.codigojardin, j.nombre, TO_CHAR(c.fecha,'DD-MM-YYYY') AS fecha, c.descripcion FROM public.compra c, public.jardin j WHERE c.codigojardin = j.codigo and (c.estado = $1 or c.estado = $2)",["0","2"]);
    })
    .then(data=>{
        res.status(200).json({data: data})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
  
}

//Obtiene los detalles de una solicitud según su numero de serie
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

//Obtiene los nicks de usuario encargados 
functionQueries.LlenarUsuarios = (req, res, next) =>{
    connection.tx(t=>{
        return t.any('Select nick FROM public."user" Where tipo_usuario_id = $1', ["2"])
    })
    .then(data=>{
        res.status(200).json({data:data})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Posts
//Ingresa un producto
functionQueries.postProductos = (req,res,next) => {
    connection.tx(t=>{
        return t.none("INSERT INTO producto VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $8, $7)", [req.body.codigo, req.body.nombre, req.body.precio, req.body.prioridad, req.body.tipo, req.body.descripcion,"1","0"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg:"Producto agregado exitosamente."})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}
//Ingresa un encargado
functionQueries.postEncargado = (req, res, next) => {
    User.register(
        {nick: req.body.nick, tipo_usuario_id: 2, correo: req.body.correo,  nombre: req.body.nombre, apellido: req.body.apellido, telefono: req.body.telefono, estado: '1'},
        req.body.contrasena,
        (err, user) => {
      console.log(err);
      res.json({user, err})
    });
    enviarContraseñaEmail(req.body.correo, req.body.contrasena)
}
//Ingresa un administrador a traves del modelo de squelize
functionQueries.postAdmin = (req, res, next) => {
    User.register(
        {nick: req.body.nick, tipo_usuario_id: 1, correo: req.body.correo,  nombre: req.body.nombre, apellido: req.body.apellido, telefono: req.body.telefono, estado: '1'},
        req.body.contrasena,
        (err, user) => {
      console.log(err);
      res.json({user, err})
    });
    enviarContraseñaEmail(req.body.correo, req.body.contrasena)
}
//Ingresa un establecimiento
functionQueries.postEstablecimiento = (req, res, next) => {
    connection.tx(t=>{
        return t.none('INSERT INTO jardin VALUES ($1, $2, $3, $4, $8, $5, $6, $7, $9, $10, $11, $12)', [req.body.codigo, req.body.tipo, req.body.region, req.body.comuna, req.body.direccion, req.body.nombre, req.body.encargado,"1",req.body.division,req.body.encargado2,req.body.telefono,req.body.correo])
    })
    .then(data=>{
        res.status(200).json({data: data, msg:"Jardin agregado exitosamente."})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}
//Ingresa una nueva solicitud
functionQueries.creaCompra = (req, res, next) => {
    connection.tx(t=>{
        return t.none("INSERT INTO compra VALUES ($1, TO_DATE($2,'DD/MM/YYYY'), $3, $4, DEFAULT)", [req.body.codigo, req.body.fecha, "1","ACTUAL"])
    })
    .then(data=>{
        res.status(200).json({data: data, msg:"Compra agregada exitosamente."})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Ingresa un producto con la solicitud de esta y la cantidad de este producto
functionQueries.compraProducto = (req, res, next) => {
    connection.tx(t=>{
        return t.none('INSERT INTO public."productoCompra" VALUES ($2, $3, $1)', [req.body.nserie, req.body.codigo, req.body.cant])
    })
    .then(data=>{
        res.status(200).json({data: data, msg:"Compra agregada exitosamente."})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Deletes
//Elimina un producto según su codigo (lo desahbilita)
functionQueries.deleteProducto = (req,res) =>{
    connection.tx(t=>{
        return t.none('update public."producto" Set habilitado = $2 WHERE codigo =$1',[req.params.id,"0"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Producto eliminado correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Elimina un administrador según su nick 
functionQueries.deleteAdmin = (req,res) =>{
    connection.tx(t=>{
        return t.none('DELETE FROM public."user" WHERE nick =$1',req.params.id);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Usuario eliminado correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}
//Elimina un encargado según su nick (setea su estado para deshabilitarlo)
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

//Elimina un encargado según su nick de un establecimiento
functionQueries.deleteEncargadoJardin = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."jardin" SET encargado = NULL WHERE encargado =$1; UPDATE public."jardin" SET encargado2 = NULL WHERE encargado2 =$1;',[req.body.empleado]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Jardin actualizado correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Elimina un establecimiento (setea su estado para deshabilitarlo)
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
//Edita un producto
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

//Edita un producto compra para cambiar los codigos de los productos en compra si se cambia el codigo de un producto
functionQueries.editProductoCompra= (req,res)=>{
    req.body=JSON.parse(req.body.data)
    connection.tx(t=>{
        return t.none('UPDATE public."productoCompra" SET codigo = $1 WHERE codigo = $2',[req.body.codigo, req.body.codigoAnt])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Producto actualizado correctamente"})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Edita un Encargado
functionQueries.editEncargado= (req,res)=>{
    req.body=JSON.parse(req.body.data)
    connection.tx(t=>{
        return t.none('UPDATE public."user" SET nick = $1, correo = $3, telefono = $4, nombre = $2, apellido = $5  WHERE serie = $6',[req.body.nick,req.body.nombre,req.body.correo,req.body.telefono,req.body.apellido,req.body.serie])
    })
    .then(data=>{
        User.update(req.body.nick, req.body.contra);
        res.status(200).json({data: data, msg: "Encargado actualizado correctamente"})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}
//Edita los datos del usuario actual
functionQueries.editConfiguracion= (req,res)=>{
    req.body=JSON.parse(req.body.data)
    connection.tx(t=>{
        return t.none('UPDATE public."user" SET nick = $1, correo = $3, telefono = $4, nombre = $2, apellido = $5  WHERE serie = $6',[req.body.nick,req.body.nombre,req.body.correo,req.body.telefono,req.body.apellido,req.body.serie])
    })
    .then(data=>{
        User.update(req.body.nick, req.body.contra);
        res.status(200).json({data: data, msg: "Encargado actualizado correctamente"})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
    
}
//Editamos un establecimiento
functionQueries.editEstablecimiento= (req,res)=>{
    req.body=JSON.parse(req.body.data)
    connection.tx(t=>{
        return t.none('UPDATE public."jardin" SET tipo = $1, region = $3, comuna = $4, direccion = $5, nombre = $6, encargado = $7, encargado2 = $8, telefono = $9, division = $10, correo = $11 WHERE codigo = $2',[req.body.tipo,req.body.codigo,req.body.region,req.body.comuna,req.body.direccion,req.body.nombre,req.body.encargado,req.body.encargado2,req.body.telefono,req.body.division,req.body.correo])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Establecimiento actualizado correctamente"})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}
//Cambiamos el nick de ada establecimiento en el que sea un encargado
functionQueries.cambiarNickjardin1= (req,res)=>{
    req.body=JSON.parse(req.body.data)
    connection.tx(t=>{
        return t.none('UPDATE public."jardin" SET  encargado = $1 FROM public."user" u WHERE encargado = u.nick and u.serie = $2; UPDATE public."jardin" SET  encargado2 = $1 FROM public."user" u WHERE encargado2 = u.nick and u.serie = $2;',[req.body.nick, req.body.serie])
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Establecimiento actualizado correctamente"})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}
//Seteamos el estado de la compra de actual a historial aceptado con el estado 0
functionQueries.quitarCompra = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."compra" SET estado = $2, descripcion = $3 WHERE nserie =$1',[req.body.nserie,"0","ACEPTADO"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Compra enviada a historial correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}
//Movemos una solicitud de historial a actual seteando su estado como 1
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
//Anulamos una solicitud cambiando su estado a 2
functionQueries.eliminarCompra = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."compra" SET estado = $2, descripcion = $3 WHERE nserie =$1',[req.body.nserie,"2","ANULADO"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Solicitud aceptada correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}
//Seteamos el estado de un producto a 1 para que este pertenesca a la lista de productos
functionQueries.agregaProductoLista = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."producto" SET estado = $2 WHERE codigo =$1',[req.body.codigo,"1"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Encargado eliminado correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}
//Quitamos un producto de la lista seteandolo como 0
functionQueries.quitarProductoLista = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."producto" SET estado = $2 WHERE codigo =$1',[req.body.codigo,"0"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Encargado eliminado correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Cambiamos el perfil del usuario actual para cambiar su imagen de perfil
functionQueries.cambiarPerfil = (req,res) =>{
    connection.tx(t=>{
        if(req.user.perfil == "Mujer"){
            return t.none('UPDATE public."user" SET perfil = $1',["Hombre"]);
        }else{
            return t.none('UPDATE public."user" SET perfil = $1',["Mujer"]);
        }
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Imagen de perfil cambiada exitosamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Mostramos un producto en lista seteando su estado a 1
functionQueries.mostrarProductoLista = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."producto" SET estado = $2 WHERE codigo =$1',[req.body.codigo,"1"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Encargado eliminado correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Escondemos un producto en lista seteando su estado a 2
functionQueries.esconderProductoLista = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."producto" SET estado = $2 WHERE codigo =$1',[req.body.codigo,"2"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Encargado eliminado correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

//Recuperamos un establecimiento dado de baja seteando su estado como 1
functionQueries.RecuperarEstablecimiento = (req,res) =>{
    connection.tx(t=>{
        return t.none('UPDATE public."jardin" SET estado = $2 WHERE codigo =$1',[req.body.codigo,"1"]);
    })
    .then(data=>{
        res.status(200).json({data: data, msg: "Jardin dado de baja correctamente"})
    })
    .catch(err=>{
        res.status(500).json({err, msg: "Ha ocurrido un error"})
    })
}

export default functionQueries;
