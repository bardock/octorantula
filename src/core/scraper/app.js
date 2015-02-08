/// <reference path="typings/async/async.d.ts" />
/// <reference path="typings/winston/winston.d.ts" />
/// <reference path="typings/mongodb/mongodb.d.ts" />
var async = require('async');
var logger = require('./logger');
var mongodb = require('mongodb');
var ScraperModule = require('./Scraper');
logger.info("Starting scraper...");
// Connection URL
var mongoUrl = 'mongodb://admin:fedefede@ds052837.mongolab.com:52837/octorantula';
// Use connect method to connect to the Server
mongodb.MongoClient.connect(mongoUrl, function (err, db) {
    if (err)
        throw err;
    logger.debug("Connected to mongo");
    var url = "https://yts.re/browse-movie/0/All/All/0/latest/";
    var scraper = new ScraperModule.Scraper();
    async.whilst(
    /* test: */
    function () {
        return url;
    }, 
    /* iterator: */
    function (callback) {
        scraper.scrapeList(url, function (err, data) {
            if (err)
                return callback(err);
            async.map(data.movies, function (movie, mapped) {
                mapped(null, function (callback) { return scraper.parseDetailUrl(movie.downloads[0].source, movie, callback); });
            }, function (err, movieDetailParsers) {
                if (err)
                    callback(err);
                async.parallelLimit(movieDetailParsers, 3, function (err, movies) {
                    logger.debug("Saving %s movies...", movies.length);
                    var col = db.collection("movies");
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
                    });
                    url = data.nextUrl;
                    //url = null;
                    callback();
                });
            });
        });
    }, 
    /* callback: */
    function (err) {
        db.close();
        if (err)
            throw err;
        logger.info("Done!");
    });
});
//# sourceMappingURL=app.js.map