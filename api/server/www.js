require('dotenv').config();

const express = require('express');
const path = require('path');
const app = require('./app');

app.app.use('/docs', express.static(path.join(__dirname, '..', 'apidocs')));

app.startHttpServer();
