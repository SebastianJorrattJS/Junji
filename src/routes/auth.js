import Express from 'express';
import Passport from 'passport';
import User from '../models/user';
import db from '../middleware/postgresAPI';

const router = new Express.Router();

router.post('/login', Passport.authenticate('local'), (req, res) => {
  return res.json({
    success: true,
    message: 'Ha logrado ingresar al sistema con éxito!',
    user: req.user
  });
});

router.get('/checkLogin', (req, res) => {
  res.status(200).json({
    logged: true
  });
});

router.get('/logout', function (req, res) {
  req.logOut();
  res.redirect('/');
});


router.get('/register', (req, res) => {
  User.register(
    {nick: req.nick, tipo_usuario_id: req.user.tipo, correo: req.user.correo, nombre: req.user.nombre, apellido: req.user.apellido, telefono: req.user.telefono},
    'test',
    (err, user) => 
    {
      console.log(req);
      res.json({user, err})
    }
  );
});

router.get('/register2', (req, res) => {
  User.register(
    {nick: 'Sebastian', tipo_usuario_id: '1', name: 'test'},
    'test',
    (err, user) => 
    {
      console.log(err);
      res.json({user, err})
    }
  );
});
export default router;