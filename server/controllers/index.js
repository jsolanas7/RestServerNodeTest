const express = require('express');

const app = express();

app.use(require('./user.controller'));


module.exports = app;
