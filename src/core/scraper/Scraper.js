/// <reference path="typings/async/async.d.ts" />
/// <reference path="typings/winston/winston.d.ts" />
/// <reference path="typings/mongodb/mongodb.d.ts" />
var async = require('async');
var config = require('./config');
require('./config-mongo');
var logger = require('./logger');
var Parser = require('./Parser');
var mongodb = require('mongodb');
logger.info("Connecting to mongo...");
mongodb.MongoClient.connect(config.mongo.connection, function (err, db) {
    if (err)
        throw err;
    logger.debug("Connected to mongo");
    var moviesCollection = db.collection("movies");
    moviesCollection.find().sort({ _id: -1 }).limit(1).nextObject(function (err, lastExistingMovie) {
        if (err)
            throw err;
        if (lastExistingMovie == null) {
            logger.debug("Collection is empty");
            moviesCollection.ensureIndex({ imdbId: 1 }, { unique: true }, function (err) {
                if (err)
                    throw err;
                logger.debug("Collection's unique index configured");
                start(db);
            });
        }
        else {
            start(db, lastExistingMovie);
        }
    });
});
function start(db, lastExistingMovie) {
    logger.debug("Starting scraper...", { lastExistingMovie: lastExistingMovie });
    var scraper = new Scraper(db, lastExistingMovie);
    scraper.start(function (err) {
        scraper.close();
        if (err)
            throw err;
    });
}
var Scraper = (function () {
    function Scraper(db, lastExistingMovie) {
        this.firstPage = true;
        this.db = db;
        this.parser = new Parser();
        this.lastExistingMovie = lastExistingMovie;
    }
    Scraper.prototype.start = function (callback) {
        var _this = this;
        var url = config.initUrl;
        // continue from last saved movie
        if (this.lastExistingMovie)
            url = this.lastExistingMovie.sourceListUrl;
        async.whilst(
        /* test: */
        function () {
            return url;
        }, 
        /* iterator: */
        function (callback) {
            _this.parser.parseListByUrl(url, function (err, data) {
                if (err)
                    return callback(err);
                _this.parseDetails(data.movies, function (err, movies) {
                    if (err)
                        callback(err);
                    // save async
                    _this.save(movies, function (err) {
                        if (err)
                            callback(err);
                    });
                    _this.firstPage = false;
                    url = data.nextUrl;
                    callback();
                });
            });
        }, 
        /* callback: */
        function (err) {
            if (err)
                callback(err);
            logger.info("Done!");
            callback();
        });
    };
    Scraper.prototype.parseDetails = function (movies, callback) {
        var _this = this;
        if (this.firstPage && this.lastExistingMovie) {
            // remove existing movies
            var lastMovieFound = false;
            movies = movies.filter(function (m) {
                if (m.name == _this.lastExistingMovie.name && m.year == _this.lastExistingMovie.year) {
                    lastMovieFound = true;
                    return false;
                }
                return lastMovieFound;
            });
        }
        if (!movies.length)
            callback(null, []);
        async.map(movies, function (movie, mapped) {
            mapped(null, function (callback) { return _this.parser.parseDetailByUrl(movie.downloads[0].source, movie, callback); });
        }, function (err, movieDetailParsers) {
            if (err)
                callback(err);
            async.parallelLimit(movieDetailParsers, config.parseDetailsInParallel, function (err, movies) {
                callback(null, movies);
            });
        });
    };
    Scraper.prototype.save = function (movies, callback) {
        if (!movies.length) {
            logger.debug("Nothing to save");
            return callback();
        }
        logger.debug("Saving %s movies...", movies.length);
        var col = this.db.collection("movies");
        var date = new Date();
        var operation = movies.map(function (m) {
            m.addedOn = date;
            return {
                insertOne: { document: m }
            };
        });
        col.bulkWrite(operation, function (err, r) {
            if (err)
                callback(err);
            logger.debug("Movies saved", r);
            callback();
        });
    };
    Scraper.prototype.close = function () {
        this.db.close();
    };
    return Scraper;
})();
//# sourceMappingURL=Scraper.js.map