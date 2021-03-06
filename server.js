const express = require('express');
const nunjucks = require('nunjucks');
const expressFileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));
app.use(express.static('node_modules/bootstrap/dist'));

nunjucks.configure('views', { express: app, autoescape: true, watch: true });
app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: 'Peso del archivo mayor al permitido (5 MB)',
  })
);

app.get('/', (req, res) => {
  res.render('formulario.html');
});

app.get('/collage', (req, res) => {
  res.render('collage.html');
});

app.post('/imagen', async (req, res) => {
  try {
    const posicion = req.body.posicion;
    const imagen = req.files.target_file;
    if (!imagen || !posicion) throw 'Error, faltan datos';

    const { name } = imagen;
    const formato = name.split('.').slice(-1)[0];
    if (formato !== 'jpg') throw 'Formato de imagen invalido (solo JPG)';

    imagen.mv(`static/imgs/imagen-${posicion}.jpg`, error => {
      res.redirect('/collage');
    });
  } catch (error) {
    console.log(error.message);
    res.redirect('/collage');
  }
});

app.get('/deleteImg/:imagen', async (req, res) => {
  const { imagen } = req.params;
  console.log(imagen);
  fs.unlink(`static/imgs/${imagen}`, error => {
    console.log('imagen eliminada');
    res.redirect('/collage');
  });
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));
