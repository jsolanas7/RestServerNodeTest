const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { validator } = require('./../middlewares/authentication')
const tokenTime = process.env.TOKEN_LIFE;
const seed = process.env.SEED;
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;
    if(!body.email){
        return res.json({
            ok:false,
            err: {
                message: 'Debe ingresar un mail'
            }
        })
    }
    User.findOne({email: body.email}, (err, userDB) => {
        if(err) {
            return res.status(400).json({
                ok:false,
                err 
            })
        }
        if(userDB){
            if(body.password){
                if(!bcrypt.compareSync(body.password, userDB.password)){
                    return res.status(200).json({
                        ok: false,
                        err: {
                            message:'Mail o (password) invalidos'
                        }
                    })
                }else{
                    let token = jwt.sign({
                        user: userDB
                    }, seed, {expiresIn: 60 * 60 * 24 * 30});
                    return res.status(200).json({
                        ok: true,
                        user: userDB,
                        token
                    })
                }
            }else{
                return res.status(200).json({
                    ok: false,
                    err: {
                        Message:'Debe ingresar password.'
                    }
                })
            }
        } else{
            return res.json({
                ok: false
            })
        }
    })
})

module.exports = app;
