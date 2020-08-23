import Promise from 'bluebird'; //Llamamos a bluebird  y pgp los cuales se encargaran de realizar las promesas 
import pgp from 'pg-promise';
import config from '../config.json'; //Llamos a nuestra configuracion con la base de datos Postgresql

const camelizeColumns = (data) => {
  const template = data[0];

  for (let prop in template) {
    const camel = pgp.utils.camelize(prop);

    if (!(camel in template)) {
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  }
};

//La constante postgresql recibira las columnas 
const postgres = pgp({
  promiseLib: Promise,
  receive: (data, result, e) => { camelizeColumns(data); }
});

//Realizamos la conección con postgresql y la exportamos para utilizarla en otras vistas
const connection = postgres(config.dbUri);

export default connection;