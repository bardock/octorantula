/// <reference path="typings/winston/winston.d.ts" />

import winston = require('winston');
require("winston-loggly");

var config = require('./config');
require('./config-logger-loggly');

var logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            level: config.logger.level,
            handleExceptions: true,
            prettyPrint: true
        }),
        new (winston.transports.File)({
            level: config.logger.level,
            handleExceptions: true,
            filename: "logs.log"
        })
    ]
});

if (config.logger.loggly) {
    logger.add(winston.transports.Loggly, {
        level: config.logger.level,
        handleExceptions: true,
        subdomain: config.logger.loggly.subdomain,
        inputToken: config.logger.loggly.inputToken,
        json: true
    });
}

logger.cli();

export = logger;