import Sequelize from 'sequelize'; //Llamamos al sequelize el cual nos permitira modelar nuestro usuario y nos facilitara su manejo de datos.
import PassportLocalSequelize from 'passport-local-sequelize'; //Llamamos a passport el cual nos permite autenticar a un usuario según nuestro modelo
import config from '../config.json'; //Llamamos a nuestra configuracion de postgresql

//Creamos una nueva variable sequelize la cual esta hecha a partir de nuestra configuración
const db = new Sequelize(config.dbUri, { logging: false });

//Creamos el modelos de usuario según los datos mas importantes de este para identificarlo
const User = db.define(
  'user',
  {
    nick: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    tipo_usuario_id: Sequelize.STRING,
    correo: Sequelize.STRING,
    nombre: Sequelize.STRING,
    apellido: Sequelize.STRING,
    telefono: Sequelize.STRING,
    estado: Sequelize.STRING,
    password_hash: Sequelize.STRING,
    password_salt: Sequelize.STRING,
    perfil: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

//Indicamos las variables para que passport pueda identificar al usuario
//La contraseña estará encodeada por seguridad por lo que en la base de datos se dividira en 2 y no se podrá reconocer exactamente 
PassportLocalSequelize.attachToUser(User, {
  usernameField: 'nick',
  hashField: 'password_hash',
  saltField: 'password_salt'
});

//Función que nos permite modificar la contraseña de un usuario encontrado según su nick en la plataforma (id = nick)
User.update = (id, password) => {
  //Encontramos al usuario con la siguiente función
  User.findByUsername(id, (err, user) => {
    if (err)
      return false;

    if (!user)
      return false;
    //Seteamos la constraseña del usuario encontrado
    user.setPassword(password, (err, user) => {
      if (err)
        return false;
      //Indicar Variable usada para encontrar al usuario
      user.setActivationKey((err, user) => {
        if (err)
          return false;
        //En este caso nick es como se llama al "nick" del usuario literalmente en la base de datos
        user['nick'] = id;
        //Función que guarda los cambios
        user.save()
          .then(() => {
            true;
          })
          .catch((err) => {
            false
          });
      });
    });
  });
};

export default User;