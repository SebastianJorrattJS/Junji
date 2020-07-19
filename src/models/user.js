import Sequelize from 'sequelize';
import PassportLocalSequelize from 'passport-local-sequelize';
import config from '../config.json';

const db = new Sequelize(config.dbUri, { logging: false });

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
    password_salt: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

PassportLocalSequelize.attachToUser(User, {
  usernameField: 'nick',
  hashField: 'password_hash',
  saltField: 'password_salt'
});

User.update = (id, password) => {
  User.findByUsername(id, (err, user) => {
    if (err)
      return false;

    if (!user)
      return false;

    user.setPassword(password, (err, user) => {
      if (err)
        return false;

      user.setActivationKey((err, user) => {
        if (err)
          return false;

        user['nick'] = id;

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