const express = require('express');
const app = express();
const User = require('../models/user')
const bcrypt = require('bcrypt');
const { validatorToken, validatorAdminRole } = require('./../middlewares/authentication')
const _ = require('underscore');

const headerOptions = ("Access-Control-Allow-Origin", "*", "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
app.post('/user/create', validatorToken, function (req, res) {
    const body = req.body;
    const user = new User({
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


app.put('/user/update/:id', [ validatorToken, validatorAdminRole ],async function (req, res) {
    const id = req.params.id;
    // let body = _.pick(req.body, ['name', 'email', 'role', 'status']);
    const body = req.body;
    try {
        let user = await User.findByIdAndUpdate(id, body, { new: true, runvalidatorTokens: true });
        res.json({
            ok: true,
            user
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
    // User.findByIdAndUpdate(id, body, { new: true, runvalidatorTokens: true }, (err, userDB) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             message: 'Hubo un error: ' + err,
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         user: userDB
    //     })
    // })
});

app.get('/user/getall', [validatorToken, validatorAdminRole ], async function (req, res) {
    res.header(this.headerOptions);
    const limit = Number(req.query.limit) || 5;
    const skip = Number(req.query.skip) || 0;
    try {
        const users = await User.find({ status: true }, 'name email role google')
            .skip(skip)
            .limit(limit)
            .exec();
        const count = await User.countDocuments({ status: true })
            .exec();
        res.json({
            ok: true,
            users,
            count,
            userGet: req.userToken
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
    // User.find({ status: true}, 'name email role google')
    //     .skip(skip)
    //     .limit(limit)
    //     .exec((err, usuarios) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             })
    //         }
    //         User.countDocuments({ status: true })
    //             .exec((err,conteo) => {
    //             if(err) {
    //                 return res.status(400).json({
    //                     ok:false,
    //                     err
    //                 })
    //             }
    //             res.json({
    //                 ok: true,
    //                 usuarios,
    //                 conteo,
    //                 userGet: req.user
    //             })
    //         })
    //     })
});
app.get('/user/:id', validatorToken ,function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});
app.get('/user/delete/:id', validatorToken,  async function (req, res) {
    console.log('asdasdas');
    let id = req.params.id;
    let body = { status: false }
    try {
        User.findByIdAndUpdate(id, body, { new: true })
            .then(user   => {
                if (user) {
                    res.json({
                        ok: true,
                        user,
                    })
                }else{
                    res.json({
                        ok: false,
                        err: {
                            message: 'No existe ese usuario'
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
    // User.findByIdAndUpdate(id, body,{new: true}, (err, userDB) => {
    //     if(err){
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }
    //     res.json({
    //         ok: true,
    //         userDB
    //     })
    // })
});


module.exports = app;