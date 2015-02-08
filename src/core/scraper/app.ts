/// <reference path="typings/async/async.d.ts" />
/// <reference path="typings/winston/winston.d.ts" />
/// <reference path="typings/mongodb/mongodb.d.ts" />

import async = require('async');
var config = require('./config');
require('./config-mongo');
import logger = require('./logger');
import mongodb = require('mongodb');
import ScraperModule = require('./Scraper');

logger.info("Starting scraper...");

mongodb.MongoClient.connect(config.mongo.connection, function (err, db) {
    if (err) throw err;

    logger.debug("Connected to mongo");

    var url = config.initUrl;

    var scraper = new ScraperModule.Scraper();

    async.whilst(
        /* test: */
        () => { return url; },

        /* iterator: */
        callback => {

            scraper.scrapeList(url, (err, data) => {

                if (err) return callback(err);

                async.map(
                    data.movies,
                    (movie, mapped) => {
                        mapped(null, callback => scraper.parseDetailUrl(movie.downloads[0].source, movie, callback));
                    },
                    (err, movieDetailParsers) => {
                        if (err) callback(err);

                        async.parallelLimit(movieDetailParsers, 3,(err, movies: ScraperModule.IMovie[]) => {

                            logger.debug("Saving %s movies...", movies.length);

                            var col: any = db.collection("movies");
                            var date = new Date();

                            var operation = movies.map(m => {
                                m.addedOn = date;
                                return {
                                    replaceOne: {
                                        filter: { name: m.name, year: m.year },
                                        replacement: m,
                                        upsert: true
                                    }
                                }
                            });

                            col.bulkWrite(operation,(err, r) => {
                                if (err) callback(err);
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
        err => {
            db.close();
            if (err) throw err;
            logger.info("Done!");
        });
});