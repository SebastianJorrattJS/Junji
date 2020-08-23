import Express from 'express'; //Llamamos a express para indicar las rutas donde realizaremos cada consulta a la base de datos
import db from '../middleware/postgresAPI'; //Esta ruta es en la cual se realizarán las consultas a la base de datos (Back-end) siendo esta solo una especie de "interface"

const router = Express.Router();

//router.(get si obtiene datos, post si ingresa datos, put si reemplaza datos y delete en caso de que elimine datos)
//El primer parametro se utiliza para indicar la ruta, la cual se llama desde front-end  "static/js/views_js"  y la segúnda el nombre de la funcion de la ruta postgresAPI llamada arriba

//GET
router.get("/listaProductos",db.getProductos);
router.get("/ProductosLista",db.getProductosLista);
router.get("/ProductosaListar",db.getProductosaListar);
router.get("/ListaSolicitud",db.getListaSolicitud);
router.get("/BuscarSerie",db.getBuscarSerie);
router.get("/cargaExportar",db.cargaExportar);
router.get("/ObtenerUser",db.getUser);
router.get("/getProducto/:id",db.getDatosProducto);
router.get("/buscarCodigo/:id",db.buscarCodigo);
router.get("/cargaEstablecimientos/:id",db.cargaEstablecimientos);
router.get("/cargaMisEstablecimientos",db.cargaMisEstablecimientos);
router.get("/getEncargado",db.getEncargado);
router.get("/getAdmin",db.getAdmin);
router.get("/getDatosEncargado/:id",db.getDatosEncargado);
router.get("/getConfiguracion",db.getConfiguracion);
router.get("/getDatosEstablecimiento/:id",db.getDatosEstablecimiento);
router.get("/getEstablecimientos",db.getEstablecimiento);
router.get("/getBaja",db.getBaja);
router.get("/getAlternativos",db.getAlternativos);
router.get("/getClasicos",db.getClasicos);
router.get("/getMDS",db.getMDS);
router.get("/listaCompras",db.getCompras);
router.get("/listaMisCompras",db.listaMisCompras);
router.get("/listaMisComprasNulas",db.listaMisComprasNulas);
router.get("/comprasPendientes",db.getcomprasPendientes);
router.get("/getDetalles/:id",db.getDetalles);
router.get("/LlenarUsuarios",db.LlenarUsuarios);

//Post
router.post("/addProducto",db.postProductos);
router.post("/addEncargado",db.postEncargado);
router.post("/addAdmin",db.postAdmin);
router.post("/addEstablecimiento",db.postEstablecimiento);
router.post("/creaCompra",db.creaCompra);
router.post("/compraProducto",db.compraProducto);

//Delete
router.put('/deleteProducto/:id',db.deleteProducto);
router.delete('/deleteAdmin/:id',db.deleteAdmin);

//PUT
router.put('/editProducto/',db.editProducto)
router.put('/editProductoCompra/',db.editProductoCompra)
router.put('/editEncargado/',db.editEncargado)
router.put('/editEstablecimiento/',db.editEstablecimiento)
router.put('/editConfiguracion/',db.editConfiguracion)
router.put('/cambiarNickjardin1/',db.cambiarNickjardin1)
router.put('/cambiarPerfil/',db.cambiarPerfil)
router.put('/quitarCompra/',db.quitarCompra)
router.put('/aceptarCompra/',db.aceptarCompra)
router.put('/eliminarCompra/',db.eliminarCompra)
router.put('/agregaProductoLista/',db.agregaProductoLista);
router.put('/quitarProductoLista/',db.quitarProductoLista);
router.put('/mostrarProductoLista/',db.mostrarProductoLista);
router.put('/esconderProductoLista/',db.esconderProductoLista);
router.put('/RecuperarEstablecimiento/',db.RecuperarEstablecimiento);
router.put('/deleteEncargado/',db.deleteEncargado);
router.put('/deleteEncargadoJardin/',db.deleteEncargadoJardin);
router.put('/deleteEstablecimiento/',db.deleteEstablecimiento);
export default router;