const express = require('express')
var bodyParser = require('body-parser')
 
var app = express()
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.post('/usuario/create', function (req, res) {
    let body = req.body;
    if(req.body.name === undefined){
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario',
            
        })
    }else{
        res.json({
        body
    })
    }
    
});


app.get('/', function (req, res) {
    res.send('Hello World')
});

app.get('/usuario', function (req, res) {
    res.send('Get Usuario')
});
app.get('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});



app.listen(3000, () => {
    console.log('Escuchando el puerto:', 3000)
})