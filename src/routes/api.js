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

export default router;