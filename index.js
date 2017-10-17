require('dotenv').config();
require('babel-register');
global.config = require('./config/config');
require('./config/logger');
require('./src/app');
