/*
* RUTA '/api/hospitales'
* */

const { Router} = require('express');
const {check} = require('express-validator');
const {getHospitales, crearHospital, actualizarHospital,borrarHospital} = require('../controllers/hospitales')
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',getHospitales);

router.post(
    '/',
    [
        validarJWT,
        check('nombre','El nombre del Hospital es necesario').not().isEmpty(),
        check('usuario','El Usuario del Hospital es necesario').isMongoId(),
        validarCampos
    ],
    crearHospital);


router.put('/:id',
    [
      validarJWT,
      check('nombre','El nombre del Hospital es necesario').not().isEmpty(),
      validarCampos,
    ],
    actualizarHospital);

router.delete('/:id',validarJWT,borrarHospital);


module.exports = router;