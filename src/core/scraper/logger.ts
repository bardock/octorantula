/// <reference path="typings/winston/winston.d.ts" />

import winston = require('winston');
require("winston-loggly");

var config = require('./config-loggly');

var logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            level: "debug",
            handleExceptions: true,
            prettyPrint: true
        }),
        new (winston.transports.File)({
            level: "debug",
            filename: "logs.log"
        })
    ]
});

if (config && config.loggly) {
    logger.add(winston.transports.Loggly, {
        level: "debug",
        subdomain: config.loggly.subdomain,
        inputToken: config.loggly.inputToken,
        json: true
    });
}

logger.cli();

export = logger;