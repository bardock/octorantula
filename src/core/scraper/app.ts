/// <reference path="typings/async/async.d.ts" />
/// <reference path="typings/winston/winston.d.ts" />
/// <reference path="typings/mongodb/mongodb.d.ts" />

import async = require('async');
var config = require('./config');
require('./config-mongo');
import logger = require('./logger');
import Models = require('./Models');
import Scraper = require('./Scraper');
import mongodb = require('mongodb');

logger.info("Starting scraper...");

mongodb.MongoClient.connect(config.mongo.connection, function (err, db) {
    if (err) throw err;

    logger.debug("Connected to mongo");

    var sc = new Sc(db);
    sc.init();
});

class Sc {

    private db: mongodb.Db
    private scraper: Scraper

    constructor(db: mongodb.Db) {
        this.db = db;
        this.scraper = new Scraper();
    }

    init() {
        var url = config.initUrl;

        async.whilst(
            /* test: */
            () => { return url; },

            /* iterator: */
            callback => {

                this.scraper.scrapeList(url,(err, data) => {
                    if (err) return callback(err);

                    this.parseDetails(data,(err, movies) => {
                        if (err) callback(err);

                        // save async
                        this.save(movies, err => {
                            if (err) callback(err)
                        });

                        url = data.nextUrl;
                        callback();
                    });
                });
            },
            /* callback: */
            err => {
                this.close();
                if (err) throw err;
                logger.info("Done!");
            });
    }

    private parseDetails(data: Models.IScrapedList, callback: (err: Error, movies?: Models.IMovie[]) => void) {
        async.map(
            data.movies,
            (movie, mapped) => {
                mapped(null, callback => this.scraper.parseDetailUrl(movie.downloads[0].source, movie, callback));
            },
            (err, movieDetailParsers) => {
                if (err) callback(err);

                async.parallelLimit(
                    movieDetailParsers,
                    config.parseDetailsInParallel,
                    (err, movies: Models.IMovie[]) => {
                        callback(null, movies);
                    });
            });
    }

    private save(movies: Models.IMovie[], callback) {
        logger.debug("Saving %s movies...", movies.length);

        var col: any = this.db.collection("movies");
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
            callback();
        });
    }

    private close() {
        this.db.close();
    }
}