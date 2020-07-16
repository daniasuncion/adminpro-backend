const {response} = require('express');
const {generarJWT} = require('../helpers/jwt');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const login = async (req,res = response) => {
  const {email, password} = req.body;

  try {
    //verificar email
    const usuarioDb = await Usuario.findOne({email});
    if(!usuarioDb){
      res.status(400).json({
        ok:false,
        msg: ' Email o Contraseña no son  validos'
      });
    }
    //verificar contraseña
    const validPass = bcrypt.compareSync(password,usuarioDb.password);
    if(!validPass){
      res.status(400).json({
        ok:false,
        msg: 'Contraseña o Email no son  validos'
      });
    }
    //generar el token - JWT
    const token = await generarJWT(usuarioDb.id);
    res.json({
      ok:true,
      token
    });

  }catch (error) {
    res.status(500).json({
      ok:false,
      msg: ' Hable con el administrador '
    });
  }

};

module.exports = {login};