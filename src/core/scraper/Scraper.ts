/// <reference path="typings/async/async.d.ts" />
/// <reference path="typings/winston/winston.d.ts" />
/// <reference path="typings/mongodb/mongodb.d.ts" />

import async = require('async');
var config = require('./config');
require('./config-mongo');
import logger = require('./logger');
import Models = require('./Models');
import Parser = require('./Parser');
import mongodb = require('mongodb');

logger.info("Starting scraper...");

mongodb.MongoClient.connect(config.mongo.connection, function (err, db) {
    if (err) throw err;

    logger.debug("Connected to mongo");

    db.collection("movies").ensureIndex({ imdbId: 1 }, { unique: true }, err => {
        if (err) throw err;

        var scraper = new Scraper(db);

        scraper.start(err => {
            scraper.close();
            if (err) throw err;
        });
    });

});

class Scraper {

    private db: mongodb.Db
    private parser: Parser

    constructor(db: mongodb.Db) {
        this.db = db;
        this.parser = new Parser();
    }

    start(callback: (err?: Error) => void) {
        var url = config.initUrl;

        async.whilst(
            /* test: */
            () => { return url; },

            /* iterator: */
            callback => {

                this.parser.parseListByUrl(url,(err, data) => {
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
                if (err) callback(err);
                logger.info("Done!");
                callback();
            });
    }

    private parseDetails(data: Models.IScrapedList, callback: (err: Error, movies?: Models.IMovie[]) => void) {
        async.map(
            data.movies,
            (movie, mapped) => {
                mapped(null, callback => this.parser.parseDetailByUrl(movie.downloads[0].source, movie, callback));
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
                    filter: { imdbId: m.imdbId },
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

    close() {
        this.db.close();
    }
}