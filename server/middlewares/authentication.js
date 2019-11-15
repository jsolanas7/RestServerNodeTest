//===================================
// Authorization
//===================================
const jwt = require('jsonwebtoken')

const SEED = process.env.SEED;


let validatorToken = async (req, res, next) => {
try{
    let token = await req.get('token');
    const decode = jwt.verify(token,SEED);
    res.user = decode.user;
    next();
}catch(err){
    return res.status(401).json({
        ok:false,
        err: {
            Message: "Token invalido",
            err
        }
    })
}
}

//==========================
//{{Verificate role administrator}}
//==========================

let validatorAdminRole = async (req,res,next) => {
    const token = await req.get('token');
    const decode = jwt.verify(token,SEED);
    if(decode.user.role == 'ADMIN_ROLE'){
        req.userToken = decode.user;
        next();
    }else{
        return res.json({
            ok:false,
            err: {
                message: "El usuario no es administrador"
            }
        })
    }  
}
module.exports = {
    validatorToken,
    validatorAdminRole
}