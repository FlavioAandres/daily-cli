const express = require('express')
const app = express()
const router = require('./router')
const bodyParser = require('body-parser');

// midlewares
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({extended: true}));

// routes
app.use('/', router)

module.exports = app