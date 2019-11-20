const express = require('express');
const app = express();
const User = require('../models/user')
const Address = require('../models/address')
const bcrypt = require('bcrypt');
const { validatorToken, validatorAdminRole } = require('./../middlewares/authentication')
const _ = require('underscore');

const headerOptions = ("Access-Control-Allow-Origin", "*", "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
app.post('/user/create', async function (req, res) {
    console.log(req.body);
    const body = req.body;
    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });
    try {
        if (body.addresses) {
            const newAddresses = await Address.insertMany(body.addresses);
        }
        newAddresses.forEach(function (item) {
            user.addresses.push(item._id);
        })
        const newUser = await user.save();
        res.json({
            ok: true,
            user: newUser
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            ok: false,
            err
        })
    }
});
app.put('/user/update/:id', [validatorToken, validatorAdminRole], async function (req, res) {
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
});

app.get('/user/getall', [validatorToken], async function (req, res) {
    res.header(this.headerOptions);
    const limit = Number(req.query.limit) || 5;
    const skip = Number(req.query.skip) || 0;
    try {
        const that = this;
        const users = await User.find({ status: true }, 'name email role google addresses')
            .lean()
            .populate({
                path: "role",
                populate: { path: 'group' }
            })
            .populate({ path: 'addresses' })
            .skip(skip)
            .limit(limit)
            .exec();


        res.json({
            ok: true,
            users,
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
});
app.get('/user/getbyid/:id', validatorToken, async function (req, res) {
    let id = req.params.id;
    console.log(id);
    try {
        const user = await User.findById(id, 'name email role google addresses')
            .populate({
                path: "role",
                populate: { path: 'group' }
            })
            .exec();
        if (user) {
            const addresses = await Address.find({ user: user._id })
                .exec();
            if (addresses) {
                user.addresses = addresses;
            }
        }
        console.log(user);
        res.status(400).json({
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

});
app.get('/user/delete/:id', validatorToken, async function (req, res) {
    console.log('asdasdas');
    let id = req.params.id;
    let body = { statuss: false }
    try {
        User.findByIdAndUpdate(id, body, { new: true })
            .then(user => {
                if (user) {
                    res.json({
                        ok: true,
                        user,
                    })
                } else {
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
});


module.exports = app;