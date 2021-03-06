// ===================
// Port    
// ===================

process.env.PORT = process.env.PORT || 3000;

// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Lifetime token
process.env.TOKEN_LIFE = process.env.TOKEN_LIFE || 60 * 60 * 24 * 30;

//SEED

process.env.SEED = process.env.SEED || 'este-es-el-seed-dev';

// Base de datos

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;