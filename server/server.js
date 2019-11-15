const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./config/config');
 
const app = express();

const port = process.env.PORT;
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
// Global routes configuration
app.use(require('./controllers/index'));
// use all controllers with this routes
mongoose.connect(process.env.URLDB,
                { useNewUrlParser: true , useCreateIndex: true, useUnifiedTopology: true},
                 (err,res) => {
  if( err ) throw 'No se pudo conectar a la base, error : '+ err;
  console.log('Base de datos ONLINE');
});

app.listen(port, () => {
    console.log('Escuchando el puerto:', port)
})