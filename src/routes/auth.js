import Express from 'express'; //Llamamos a express para cargar las rutas
import Passport from 'passport'; //passport nos permitira logearnos según el modelo de nuestro usuario
import User from '../models/user'; //Modelo de usuario

const router = new Express.Router();

//Iniciar secion con passport
router.post('/login', Passport.authenticate('local'), (req, res) => {
  return res.json({
    success: true,
    message: 'Ha logrado ingresar al sistema con éxito!',
    user: req.user
  });
});

//Revisar si el usuario esta logeado
router.get('/checkLogin', (req, res) => {
  res.status(200).json({
    logged: true
  });
});

//Cerrar secion
router.get('/logout', function (req, res) {
  req.logOut();
  res.redirect('/');
});

//Registrarse
router.get('/register', (req, res) => {
  User.register(
    {nick: req.nick, tipo_usuario_id: req.user.tipo, correo: req.user.correo, nombre: req.user.nombre, apellido: req.user.apellido, telefono: req.user.telefono, estado: '1'},
    'test',
    (err, user) => 
    {
      console.log(req);
      res.json({user, err})
    }
  );
});

//Registro por defecto, este registro se hace solo con indicar la ruta localhost:3000/auth/register2 y se creara un usuario por defecto según los datos indicados en la función
//test es la contraseña por defecto
router.get('/register2', (req, res) => {
  User.register(
    {nick: 'Sebastian', tipo_usuario_id: '1', name: 'test', estado: '1'},
    'test',
    (err, user) => 
    {
      console.log(err);
      res.json({user, err})
    }
  );
});
export default router;