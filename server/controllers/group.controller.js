const express = require('express');
const app = express();
const Group = require('../models/group')
const bcrypt = require('bcrypt');
const { validatorToken, validatorAdminGroup } = require('./../middlewares/authentication')
const _ = require('underscore');

const headerOptions = ("Access-Control-Allow-Origin", "*", "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
app.post('/group/create', validatorToken, function (req, res) {
    const body = req.body;
    const group = new Group({
        description: body.description,
    });

    group.save((err, groupDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            group: groupDB
        })
    })
});


app.put('/group/update/:id', [ validatorToken ],async function (req, res) {
    const id = req.params.id;
    // let body = _.pick(req.body, ['name', 'email', 'group', 'status']);
    const body = req.body;
    try {
        let group = await Group.findByIdAndUpdate(id, body, { new: true, runvalidatorTokens: true });
        res.json({
            ok: true,
            group
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

app.get('/group/getall', [validatorToken], async function (req, res) {
    res.header(this.headerOptions);
    const limit = Number(req.query.limit) || 5;
    const skip = Number(req.query.skip) || 0;
    try {
        const groups = await Group.find({ status: true })
            .skip(skip)
            .limit(limit)
            .exec();
        const count = await Group.countDocuments({ status: true })
            .exec();
        res.json({
            ok: true,
            groups,
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
app.get('/group/:id', validatorToken ,function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});
app.get('/group/delete/:id', validatorToken,  async function (req, res) {
    console.log('asdasdas');
    let id = req.params.id;
    let body = { status: false }
    try {
        Group.findByIdAndUpdate(id, body, { new: true })
            .then(group   => {
                if (group) {
                    res.json({
                        ok: true,
                        group,
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