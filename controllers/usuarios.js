const {response} = require('express');
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt');
const bcrypt = require('bcryptjs');

const getUsuarios = async (req, res) => {

  const desde = Number(req.query.desde) || 0;

  const [usuarios, total] = await Promise.all([
    Usuario
      .find({},'nombre email role google img')
      .skip(desde).limit(5),
    Usuario.countDocuments()
  ]);
  res.json({
    ok: true,
    usuarios: usuarios,
    total
    // uid : req.uid
  });
};


const crearUsuario = async (req, res = response) => {

  const {email, password, nombre} = req.body;


  try {
    const existeEmail = await Usuario.findOne({email});
    if(existeEmail){
      return res.status(400).json({
            ok: false,
            msg: 'El correo ya esta en uso'
          });

    }


    const usuario = new Usuario(req.body);

    //encriptar Contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //generar el token - JWT
    const token = await generarJWT(usuario.id);

    await usuario.save();
    res.json({
      ok: true,
      usuario: usuario,
      token
    });
  }catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... Revisar Logs'}
    );
  }


};

const borrarUsuario = async  (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDb = await Usuario.findById(uid);
    if(!usuarioDb){
      res.status(404).json({
        ok: false,
        msg: 'No existe usuario con es id'}
      );
    }
    //eliminar usuario

    await Usuario.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: 'Usuario eliminado'
    });


  }catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... Revisar Logs'}
    );
  }
};
const actualizarUsuario = async (req, res = response) => {
  // TODO: Validar TOken y comprobar si el usuario es el correcto

  const uid = req.params.id;

  try {
    const usuarioDb = await Usuario.findById(uid);
    if(!usuarioDb){
      res.status(404).json({
        ok: false,
        msg: 'No existe usuario con es id'}
      );
    }
    //actualizacion
    const {password, google,email, ...campos} = req.body;

    if(usuarioDb.email !== email){

      const existeEmail = await Usuario.findOne({email : email});
      if(existeEmail){
        return res.status(400).json({
          ok:false,
          msg: 'Ya existe usuario con ese email'
        });
      }
    }
    campos.email = email;

    const UsuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new :true });

    res.json({
      ok: true,
      UsuarioActualizado
    });


  }catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... Revisar Logs'}
    );
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario
}