import Express from 'express';
import db from '../middleware/postgresAPI';
import FormValidator from '../middleware/FormValidator'
import multer from 'multer'
import fs from 'fs-extra'

const router = Express.Router();

const requestFormValidation = (preValidation, callback) => {
    return (req, res, next) => {
        if (req.body && req.body.data)
        req.body = JSON.parse(req.body.data);
        const formValidation = preValidation(req.body, req.method);
        if (formValidation.isValid)
        return callback(req, res, next);
        res.status(400).json(formValidation);
    };
};

router.get('/userInfo', (req, res) => {
    res.status(200).json({
      nombre: req.user.name,
      nick: req.user['nick'],
      type: req.user['tipo_usuario_id']
    });
});

//GET
router.get("/listaProductos",db.getProductos);
router.get("/ProductosLista",db.getProductosLista);
router.get("/ProductosaListar",db.getProductosaListar);
router.get("/ListaSolicitud",db.getListaSolicitud);
router.get("/cargaExportar",db.cargaExportar);
router.get("/ObtenerUser",db.getUser);
router.get("/getProducto/:id",db.getDatosProducto);
router.get("/buscarCodigo/:id",db.buscarCodigo);
router.get("/cargaEstablecimientos/:id",db.cargaEstablecimientos);
router.get("/getEncargado",db.getEncargado);
router.get("/getAdmin",db.getAdmin);
router.get("/getDatosEncargado/:id",db.getDatosEncargado);
router.get("/getDatosEstablecimiento/:id",db.getDatosEstablecimiento);
router.get("/getEstablecimientos",db.getEstablecimiento);
router.get("/getAlternativos",db.getAlternativos);
router.get("/getClasicos",db.getClasicos);
router.get("/listaCompras",db.getCompras);
router.get("/comprasPendientes",db.getcomprasPendientes);
router.get("/getDetalles/:id",db.getDetalles);
//Post
router.post("/addProducto",db.postProductos);
router.post("/addEncargado",db.postEncargado);
router.post("/addAdmin",db.postAdmin);
router.post("/addEstablecimiento",db.postEstablecimiento);
router.post("/creaCompra",db.creaCompra);
router.post("/compraProducto",db.compraProducto);

//Delete
router.delete('/deleteProducto/:id',db.deleteProducto);
router.delete('/deleteAdmin/:id',db.deleteAdmin);
router.put('/deleteEncargado/',db.deleteEncargado);
router.put('/deleteEncargadoJardin/',db.deleteEncargadoJardin);
router.put('/deleteEstablecimiento/',db.deleteEstablecimiento);

//PUT
router.put('/editProducto/',db.editProducto)
router.put('/editEncargado/',db.editEncargado)
router.put('/editEstablecimiento/',db.editEstablecimiento)
router.put('/quitarCompra/',db.quitarCompra)
router.put('/aceptarCompra/',db.aceptarCompra)
router.put('/eliminarCompra/',db.eliminarCompra)
router.put('/agregaProductoLista/',db.agregaProductoLista);
router.put('/quitarProductoLista/',db.quitarProductoLista);
router.put('/mostrarProductoLista/',db.mostrarProductoLista);
router.put('/esconderProductoLista/',db.esconderProductoLista);
export default router;