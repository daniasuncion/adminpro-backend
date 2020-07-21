const {response} = require('express');
const {generarJWT} = require('../helpers/jwt');
const {googleVerify} = require('../helpers/google-verify');
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


const googleSignIn = async ( req, res = response) => {
  const googleToken = req.body.token;
  
  try {
    const {name, email, picture} = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({email});
    if(!usuarioDB){
      usuario = new Usuario({
        nombre: name,
        email: email,
        password: '@@@',
        img : picture,
        google: true
      });
    }else{
      usuario = usuarioDB;
      usuario.google = true;
    }

    //guardar en bbdd
    await usuario.save();

    //generar el token - JWT
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok:true,
      token
    });
  }catch (error) {
    res.status(401).json({
      ok:false,
      msg: 'Token no es correcto',
      googleToken
    });
  }
}

const renewToken = async (req,res = response) => {
  const uid = req.uid;
  //generar el token - JWT
  const token = await generarJWT(uid);
  const usuario = await Usuario.findById(uid);

  res.json({
    ok:true,
    token,
    usuario
  });
}

module.exports = {login,googleSignIn,renewToken};