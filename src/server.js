//Aquí llamamos a todas las librerias, dependencias y otros JS
import express from 'express'; //Nos permite abrir cada vista en alguna ruta
import path from 'path'; //Nos permite modificar la direccion por defecto de nuestros archivos como los html (ejs)
import config from './config.json'; //Configuracion de la base de datos
import apiRoutes from './routes/api'; //API de la pagina
import Pg from 'pg'; //Coneccion para una secion 
import BodyParser from 'body-parser';
import MethodOverride from 'method-override';
import ConnectPg from 'connect-pg-simple';
import Passport from 'passport'; //Nos permite autenticar un inicio de secion
import Session from 'express-session';
import CookieParser from 'cookie-parser';
import authRoutes from './routes/auth'; // API para logeo y logout
import user from './models/user'; //Modelo de Usuario para SEQUELIZE

const app = express();

app.set('view engine', 'ejs'); //Indicamos que nuestros html serán ejs
app.set('views', path.join(__dirname, 'views')); //Indicamos que nuestras vistas se encontrarán en la carpeta views
app.use(express.static(path.join(__dirname, 'static'))); //Indicamos que los archivos que necesitaremos para nuestros HTML tendrán como directorio la carpeta static
app.use(MethodOverride());
app.use(BodyParser.urlencoded({ extended: false }));
const pgSession = ConnectPg(Session); //Creamos una secion al iniciar la pagina
app.use(CookieParser()); //Usamos una Cookie
app.use(Session({ //Creamos la secion
  store: new pgSession({
    pg: Pg,
    conString: config.dbUri,
    tableName: 'session',
    schemaName: 'public',
  }),
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {httpOnly: true, secure: false}
}));

//Iniciamos la secion con Passport
app.use(Passport.initialize());
app.use(Passport.session());

//Le indicamos nuestro modelo de user a nuestro passport
Passport.use(user.createStrategy());
Passport.serializeUser(user.serializeUser());
Passport.deserializeUser(user.deserializeUser());

//Funcion que identifica en todo momento si estamos logeados a la pagina
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }else{
    res.redirect('/');
  }
};

//Ruta de inicio de secion que habre el ejs de login.ejs de la carpeta views
app.get('/',(req,res)=>{
    res.render('login');
})

// El usuario de tipo 1 = Administrador
// El usuario de tipo 1 = Encargado
//Inicio de un Administrador
app.get('/inicio', isAuthenticated,(req,res)=>{
  //Solo se podrá acceder si su tipo de usuario es administrador
  if(req.user.tipo_usuario_id == '1'){
    res.render('menuAdmin');
  }else{
    //Si no será redireccionado al login
    res.redirect('/');
  }
})

//Inicio de un Encargado
//isAuthenticated llama a la funcion para verificar que el usuario este logeado para acceder a la ruta
app.get('/inicioEncargado', isAuthenticated,(req,res)=>{
  //Solo se podrá acceder si su tipo de usuario es encargado
  if(req.user.tipo_usuario_id == '2'){
    res.render('menuEncargado');
  }else{
    //Si no será redireccionado al login
    res.redirect('/');
  }
})

//Carga vista en la que el administrador admite productos a la lista de productos enviada a los encargados
app.get('/requerimiento', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('requerimiento');
  }else{
    res.redirect('/');
  }
})

//Vista en la que un admin crea una solicitud a uno de los establecimientos
app.get('/solicitud', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('solicitud');
  }else{
    res.redirect('/');
  }
})

//Vista en la que un encargado realiza una solicitud a uno de sus establecimientos
app.get('/solicitudEncargado', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '2'){
    res.render('solicitudEncargado');
  }else{
    res.redirect('/');
  }
})

//Vista en la que un encargado revisa sus solicitudes 
app.get('/missolicitudes', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '2'){
    res.render('missolicitudes');
  }else{
    res.redirect('/');
  }
})

//Vista en la que un encargado puede editar sus datos
app.get('/configuracion', isAuthenticated,(req,res)=>{
  res.render('configuracion');
})

//Vista en la que el admin puede revisar la lista de productos que manda a los encargados
app.get('/verlista', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('verlista');
  }else{
    res.redirect('/');
  }
})

//Lista de todos los establecimientos
app.get('/compania', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('compania');
  }else{
    res.redirect('/');
  }
})

//Lista de establecimientos dados de baja
app.get('/baja', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('baja');
  }else{
    res.redirect('/');
  }
})

//Vista para agregar un nuevo establecimiento
app.get('/agregarJardin', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('agregarJardin');
  }else{
    res.redirect('/');
  }
})

//Vista para editar un establecimiento 
app.get('/compania/:id', isAuthenticated, (req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    //A Esta vista se le pasa el codigo del establecimiento por ruta
    res.render('editEstablecimiento',{id:req.params.id});
  }else{
    res.redirect('/');
  }
})

//Lista de Administradores
app.get('/administrador', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('administrador');
  }else{
    res.redirect('/');
  }
})

//Lista de Encargados
app.get('/encargadoEstablecimiento', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('encargadoEstablecimiento');
  }else{
    res.redirect('/');
  }
})

//Vista para agregar a un nuevo encargado
app.get('/agregarEncargado', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('agregarEncargado');
  }else{
    res.redirect('/');
  }
})

//Vista para agregar un nuevo administrador
app.get('/agregarAdmin', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('agregarAdmin');
  }else{
    res.redirect('/');
  }
})

//Vista para editar un encargado, donde id sera su numero de serie
app.get('/editEncargado/:id', isAuthenticated, (req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('editEncargado',{id:req.params.id});
  }else{
    res.redirect('/');
  }
})

//Vista para editar un administrador, donde id sera su numero de serie
app.get('/editAdmin/:id', isAuthenticated, (req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('editAdmin',{id:req.params.id});
  }else{
    res.redirect('/');
  }
})

//Lista de productos
app.get('/producto', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('producto');
  }else{
    res.redirect('/');
  }
})

//Vista para agregar un nuevo producto
app.get('/agregarProducto', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('agregarProducto');
  }else{
    res.redirect('/');
  }
})

//Vista para editar un producto, donde id será su codigo
app.get('/editProducto/:id', isAuthenticated, (req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('editProducto',{id:req.params.id});
  }else{
    res.redirect('/');
  }
})

//Solicitudes actuales de cada establecimiento
app.get('/compra', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('compra');
  }else{
    res.redirect('/');
  }
})

//Vista donde se realizara el cálculo de valores entre las solicitudes actuales
app.get('/RealizarCompra', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('RealizarCompra');
  }else{
    res.redirect('/');
  }
})

//Vista de historial de solicitudes pasadas y solicitudes anuladas
app.get('/pendiente', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('pendiente');
  }else{
    res.redirect('/');
  }
})

//Vista para visualizar los detalles de las solicitudes
app.get('/detalleCompras/:id', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '1'){
    res.render('detalleCompras',{id:req.params.id});
  }else{
    res.redirect('/');
  }
})

//Vista para visualizar los detalles de las solicitudes del encargado logeado
app.get('/detalleMisCompras/:id', isAuthenticated,(req,res)=>{
  if(req.user.tipo_usuario_id == '2'){
    res.render('detalleMisCompras',{id:req.params.id});
  }else{
    res.redirect('/');
  }
})

//Indicamos nuestros API's
app.use(`/auth`, authRoutes);
app.use(`/api`, isAuthenticated , apiRoutes);

//Indicamos el puerto
let port = 3000;

if (process.env.NODE_PORT) port = process.env.NODE_PORT;

app.listen(port, () => {
    console.log(`El servidor está escuchando en el puerto ${port}`);
}); // escuchar el puerto
