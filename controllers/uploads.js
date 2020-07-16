const {response} = require('express');
const {v4: uuidv4} = require('uuid');
const path = require('path');
const fs = require('fs');

const {actualizarImagen} =  require('../helpers/actualizar-imagen');

const fileUpload = (req, res = response ) => {

  const tipo = req.params.tipo;
  const id = req.params.id;
  if(!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      ok:false,
      msg: 'No es un id correcto . Error de URL PARAMETERS'
    })
  }
  const tiposValidos = ['hospitales','medicos','usuarios'];
  if(!tiposValidos.includes(tipo)){
    return res.status(400).json({
      ok:false,
      msg: 'No es un Hospital / Medico / Usuario. Error de TIPO'
    })
  }
  //validar que exista algun archivo
  if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).json({
        ok:false,
        msg: 'No hay ningun archivo'
    });
  }

  //procesar la imagen
  const file = req.files.imagen;

  const nombreCortado = file.name.split('.');

  const extensionArchivo = nombreCortado[nombreCortado.length -1];
  const extensionesValidos = ['png','jpeg','jpg','gif'];
  if(!extensionesValidos.includes(extensionArchivo)){
    return res.status(400).json({
      ok:false,
      msg: 'No es un archivo permitido'
    });
  };

  //generar nombre del archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  file.mv(path,function (err) {
    if(err)
      return res.status(500).json({
        ok:false,
        msg: 'Error al mover la imagen'
      });
    actualizarImagen(tipo, id, nombreArchivo)
    res.json({
      ok:true,
      msg:'archivo subido ',
      nombreArchivo
    })
  });
};


const retornaImagen = (req,res) =>{
  const tipo = req.params.tipo;
  const foto = req.params.foto;
  let pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);

  //imagen por defecto
  if(fs.existsSync(pathImg)){
    res.sendFile(pathImg);
  }else {
    pathImg = path.join(__dirname,`../uploads/no-img.jpg`);
    res.sendFile(pathImg);
  }

}

module.exports = {fileUpload,retornaImagen}