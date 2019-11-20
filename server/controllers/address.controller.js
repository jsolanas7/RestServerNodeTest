const express = require('express');
const app = express();
const Address = require('../models/address')
const bcrypt = require('bcrypt');
const { validatorToken} = require('./../middlewares/authentication')
const _ = require('underscore');

const headerOptions = ("Access-Control-Allow-Origin", "*", "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
app.post('/address/create', validatorToken, function (req, res) {
    const body = req.body;
    const address = new Address({
        name: body.name,
    });

    address.save((err, addressDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            address: addressDB
        })
    })
});


app.put('/address/update/:id', [ validatorToken ],async function (req, res) {
    const id = req.params.id;
    // let body = _.pick(req.body, ['name', 'email', 'address', 'status']);
    const body = req.body;
    try {
        let address = await Address.findByIdAndUpdate(id, body, { new: true, runvalidatorTokens: true });
        res.json({
            ok: true,
            address
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

app.get('/address/getall', [validatorToken], async function (req, res) {
    res.header(this.headerOptions);
    const limit = Number(req.query.limit) || 5;
    const skip = Number(req.query.skip) || 0;
    try {
        const addresss = await Address.find({ status: true })
            .skip(skip)
            .limit(limit)
            .exec();
        const count = await Address.countDocuments({ status: true })
            .exec();
        res.json({
            ok: true,
            addresss,
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
app.get('/address/:id', validatorToken ,function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});
app.get('/address/delete/:id', validatorToken,  async function (req, res) {
    console.log('asdasdas');
    let id = req.params.id;
    let body = { status: false }
    try {
        Address.findByIdAndUpdate(id, body, { new: true })
            .then(address   => {
                if (address) {
                    res.json({
                        ok: true,
                        address,
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