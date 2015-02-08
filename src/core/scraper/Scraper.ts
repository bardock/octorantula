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

logger.info("Connecting to mongo...");

mongodb.MongoClient.connect(config.mongo.connection, function (err, db) {
    if (err) throw err;

    logger.debug("Connected to mongo");

    var moviesCollection = db.collection("movies");

    moviesCollection
        .find()
        .sort({ _id: -1 })
        .limit(1)
        .nextObject((err, lastExistingMovie: Models.IMovie) => {
            if (err) throw err;

            if (lastExistingMovie == null) {

                logger.debug("Collection is empty");

                moviesCollection.ensureIndex({ imdbId: 1 }, { unique: true }, err => {
                    if (err) throw err;
                    logger.debug("Collection's unique index configured");

                    start(db);
                });

            } else {
                start(db, lastExistingMovie);
            }
        });
});

function start(db: mongodb.Db, lastExistingMovie?: Models.IMovie) {
    logger.debug("Starting scraper...", { lastExistingMovie: lastExistingMovie });

    var scraper = new Scraper(db, lastExistingMovie);

    scraper.start(err => {
        scraper.close();
        if (err) throw err;
    });
}

class Scraper {

    private db: mongodb.Db
    private parser: Parser
    private lastExistingMovie: Models.IMovie
    private firstPage = true;

    constructor(db: mongodb.Db, lastExistingMovie: Models.IMovie) {
        this.db = db;
        this.parser = new Parser();
        this.lastExistingMovie = lastExistingMovie;
    }

    start(callback: (err?: Error) => void) {
        var url = config.initUrl;

        // continue from last saved movie
        if (this.lastExistingMovie)
            url = this.lastExistingMovie.sourceListUrl;

        async.whilst(
            /* test: */
            () => { return url; },

            /* iterator: */
            callback => {

                this.parser.parseListByUrl(url,(err, data) => {
                    if (err) return callback(err);

                    this.parseDetails(data.movies, (err, movies) => {
                        if (err) callback(err);

                        // save async
                        this.save(movies, err => {
                            if (err) callback(err)
                        });

                        this.firstPage = false;
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

    private parseDetails(movies: Models.IMovie[], callback: (err: Error, movies?: Models.IMovie[]) => void) {
        if (this.firstPage && this.lastExistingMovie) {
            // remove existing movies
            var lastMovieFound = false;
            movies = movies.filter(m => {
                if (m.name == this.lastExistingMovie.name && m.year == this.lastExistingMovie.year) {
                    lastMovieFound = true;
                    return false;
                }
                return lastMovieFound;
            });
            if (!lastMovieFound)
                throw "Last existing movie was not found in page";
        }
        if (!movies.length)
            callback(null, []);

        async.map(
            movies,
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
        if (!movies.length) {
            logger.debug("Nothing to save");
            return callback();
        }

        logger.debug("Saving %s movies...", movies.length);

        var col: any = this.db.collection("movies");
        var date = new Date();

        var operation = movies.map(m => {
            m.addedOn = date;
            return {
                insertOne: { document: m }
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