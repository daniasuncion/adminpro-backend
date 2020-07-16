/*
* RUTA '/api/medicos'
* */

const { Router} = require('express');
const {check} = require('express-validator');
const {getMedicos, crearMedico, actualizarMedico,borrarMedico} = require('../controllers/medicos')
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',getMedicos);

router.post(
    '/',
    [
      validarJWT,
      check('nombre','El nombre del Medico es necesario').not().isEmpty(),
      check('usuario','El usuario del Medico es necesario').not().isEmpty(),
      check('hospital','El hospital del Medico es necesario').isMongoId(),
      validarCampos
    ],
    crearMedico);


router.put('/:id',
    [

    ],
    actualizarMedico);

router.delete('/:id',borrarMedico);


module.exports = router;