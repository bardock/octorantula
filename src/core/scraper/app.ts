/// <reference path="typings/async/async.d.ts" />
/// <reference path="typings/mongodb/mongodb.d.ts" />

import async = require('async');
import mongodb = require('mongodb');
import ScraperModule = require('./Scraper');

// Connection URL
var mongoUrl = 'mongodb://admin:fedefede@ds052837.mongolab.com:52837/octorantula';

// Use connect method to connect to the Server
mongodb.MongoClient.connect(mongoUrl, function (err, db) {
    if (err) throw err;
    console.log("Connected correctly to mongo");

    var url = "https://yts.re/browse-movie/0/All/All/0/latest/";

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
                                console.log(r);
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
            if (err) throw err;
            db.close();
            console.log("DONE!");
        });
});