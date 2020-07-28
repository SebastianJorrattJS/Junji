import express from 'express';
import path from 'path';
import config from './config.json';
import apiRoutes from './routes/api';
import Pg from 'pg';
import BodyParser from 'body-parser';
import MethodOverride from 'method-override';
import ConnectPg from 'connect-pg-simple';
import Passport from 'passport';
import Session from 'express-session';
import CookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import user from './models/user';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(MethodOverride());
app.use(BodyParser.urlencoded({ extended: false }));
const pgSession = ConnectPg(Session);
app.use(CookieParser());
app.use(Session({
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

app.use(Passport.initialize());
app.use(Passport.session());

Passport.use(user.createStrategy());
Passport.serializeUser(user.serializeUser());
Passport.deserializeUser(user.deserializeUser());

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }else{
    res.redirect('/');
  }
};

app.get('/',(req,res)=>{
    res.render('login');
})

app.get('/inicio', isAuthenticated,(req,res)=>{
  res.render('menuAdmin');
})

app.get('/requerimiento', isAuthenticated,(req,res)=>{
  res.render('requerimiento');
})

//Jardines
app.get('/compania', isAuthenticated,(req,res)=>{
  res.render('compania');
})

app.get('/agregarJardin', isAuthenticated,(req,res)=>{
  res.render('agregarJardin');
})

app.get('/editEstablecimiento/:id', isAuthenticated, (req,res)=>{
  res.render('editEstablecimiento',{id:req.params.id});
})

app.get('/proveedor', isAuthenticated,(req,res)=>{
  res.render('proveedor');
})

app.get('/categoria', isAuthenticated,(req,res)=>{
  res.render('categoria');
})

app.get('/administrador', isAuthenticated,(req,res)=>{
  res.render('administrador');
})

//Encargado
app.get('/encargadoEstablecimiento', isAuthenticated,(req,res)=>{
  res.render('encargadoEstablecimiento');
})

app.get('/agregarEncargado', isAuthenticated,(req,res)=>{
  res.render('agregarEncargado');
})

app.get('/editEncargado/:id', isAuthenticated, (req,res)=>{
  res.render('editEncargado',{id:req.params.id});
})

//PRODUCTOS
app.get('/producto', isAuthenticated,(req,res)=>{
  res.render('producto');
})

app.get('/agregarProducto', isAuthenticated,(req,res)=>{
  res.render('agregarProducto');
})

app.get('/editProducto/:id', isAuthenticated, (req,res)=>{
  res.render('editProducto',{id:req.params.id});
})

app.get('/compra', isAuthenticated,(req,res)=>{
  res.render('compra');
})

app.get('/pendiente', isAuthenticated,(req,res)=>{
  res.render('pendiente');
})

app.get('/detalleCompras/:id', isAuthenticated,(req,res)=>{
  res.render('detalleCompras',{id:req.params.id});
})

app.use(`/auth`, authRoutes);
app.use(`/api`, isAuthenticated , apiRoutes);

let port = 3000;

if (process.env.NODE_PORT) port = process.env.NODE_PORT;

app.listen(port, () => {
    console.log(`El servidor está escuchando en el puerto ${port}`);
}); // escuchar el puerto
