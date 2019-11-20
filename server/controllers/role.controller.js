const express = require('express');
const app = express();
const Role = require('../models/role')
const bcrypt = require('bcrypt');
const { validatorToken, validatorAdminRole } = require('./../middlewares/authentication')
const _ = require('underscore');

const headerOptions = ("Access-Control-Allow-Origin", "*", "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
app.post('/role/create', validatorToken, function (req, res) {
    const body = req.body;
    const role = new Role({
        description: body.description,
        group: body.group
    });

    role.save((err, roleDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            role: roleDB
        })
    })
});


app.put('/role/update/:id', [ validatorToken ],async function (req, res) {
    const id = req.params.id;
    // let body = _.pick(req.body, ['name', 'email', 'role', 'status']);
    const body = req.body;
    try {
        let role = await Role.findByIdAndUpdate(id, body, { new: true, runvalidatorTokens: true });
        res.json({
            ok: true,
            role
        })
    } catch (err) {
        res.status(400).json({
            ok: false,
            err: {
                message: 'Hubo un error',
                err
            }
        })
    }
});

app.get('/role/getall', [validatorToken], async function (req, res) {
    res.header(this.headerOptions);
    const limit = Number(req.query.limit) || 5;
    const skip = Number(req.query.skip) || 0;
    try {
        const roles = await Role.find({ status: true })
            .skip(skip)
            .limit(limit)
            .exec();
        const count = await Role.countDocuments({ status: true })
            .exec();
        res.json({
            ok: true,
            roles,
            count
        })
    } catch (err) {
        res.status(400).json({
            ok: false,
            err: {
                message: 'Hubo un error',
                err
            }
        })
    }
});
app.get('/role/:id', validatorToken ,function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});
app.get('/role/delete/:id', validatorToken,  async function (req, res) {
    console.log('asdasdas');
    let id = req.params.id;
    let body = { status: false }
    try {
        Role.findByIdAndUpdate(id, body, { new: true })
            .then(role   => {
                if (role) {
                    res.json({
                        ok: true,
                        role,
                    })
                }else{
                    res.json({
                        ok: false,
                        err: {
                            message: 'No existe ese rol'
                        }
                    })
                }

            })
            .catch(err => {
                res.status(400).json({
                    message: 'Hubo un error',
                    err
                })
            })

    }
    catch (err) {
    res.json({
        ok: false,
        err: {
            message: 'Hubo un error',
            err
        }
    })
}
});


module.exports = app;