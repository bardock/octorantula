/// <reference path="typings/async/async.d.ts" />
/// <reference path="typings/winston/winston.d.ts" />
/// <reference path="typings/mongodb/mongodb.d.ts" />
var async = require('async');
var config = require('./config');
require('./config-mongo');
var logger = require('./logger');
var Scraper = require('./Scraper');
var mongodb = require('mongodb');
logger.info("Starting scraper...");
mongodb.MongoClient.connect(config.mongo.connection, function (err, db) {
    if (err)
        throw err;
    logger.debug("Connected to mongo");
    var sc = new Sc(db);
    sc.init();
});
var Sc = (function () {
    function Sc(db) {
        this.db = db;
        this.scraper = new Scraper();
    }
    Sc.prototype.init = function () {
        var _this = this;
        var url = config.initUrl;
        async.whilst(
        /* test: */
        function () {
            return url;
        }, 
        /* iterator: */
        function (callback) {
            _this.scraper.scrapeList(url, function (err, data) {
                if (err)
                    return callback(err);
                _this.parseDetails(data, function (err, movies) {
                    if (err)
                        callback(err);
                    // save async
                    _this.save(movies, function (err) {
                        if (err)
                            callback(err);
                    });
                    url = data.nextUrl;
                    callback();
                });
            });
        }, 
        /* callback: */
        function (err) {
            _this.close();
            if (err)
                throw err;
            logger.info("Done!");
        });
    };
    Sc.prototype.parseDetails = function (data, callback) {
        var _this = this;
        async.map(data.movies, function (movie, mapped) {
            mapped(null, function (callback) { return _this.scraper.parseDetailUrl(movie.downloads[0].source, movie, callback); });
        }, function (err, movieDetailParsers) {
            if (err)
                callback(err);
            async.parallelLimit(movieDetailParsers, config.parseDetailsInParallel, function (err, movies) {
                callback(null, movies);
            });
        });
    };
    Sc.prototype.save = function (movies, callback) {
        logger.debug("Saving %s movies...", movies.length);
        var col = this.db.collection("movies");
        var date = new Date();
        var operation = movies.map(function (m) {
            m.addedOn = date;
            return {
                replaceOne: {
                    filter: { name: m.name, year: m.year },
                    replacement: m,
                    upsert: true
                }
            };
        });
        col.bulkWrite(operation, function (err, r) {
            if (err)
                callback(err);
            logger.debug("Movies saved", r);
            callback();
        });
    };
    Sc.prototype.close = function () {
        this.db.close();
    };
    return Sc;
})();
//# sourceMappingURL=app.js.map