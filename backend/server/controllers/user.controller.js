const express = require('express');
const app = express();
const User = require('../models/user')
const bcrypt = require('bcrypt');
const _ = require('underscore');

const headerOptions = ("Access-Control-Allow-Origin", "*","Access-Control-Allow-Headers",
                 "Origin, X-Requested-With, Content-Type, Accept")
app.post('/usuario/create', function (req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
});


app.put('/usuario/update/:id', function (req, res) {
    let id = req.params.id;
    // let body = _.pick(req.body, ['name', 'email', 'role', 'status']);
    let body = req.body;
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Hubo un error: ' + err,
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
});

app.get('/usuario/getall', function (req, res) {
    res.header(this.headerOptions);
    let limit = Number(req.query.limit) || 5;
    let skip = Number(req.query.skip) || 0;
    User.find({ status: true}, 'name email role google')
        .skip(skip)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            User.count({ status: true })
                .exec((err,conteo) => {
                if(err) {
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })
        })
});
app.get('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});
app.get('/usuario/delete/:id', function (req, res) {
    let id = req.params.id;
    let body = {status: false}
    User.findByIdAndUpdate(id, body,{new: true}, (err, userDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            userDB
        })
    })
});


module.exports = app;