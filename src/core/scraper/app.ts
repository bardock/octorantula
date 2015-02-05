/// <reference path="typings/async/async.d.ts" />

import async = require('async');
import ScraperModule = require('./Scraper');

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
                    
                    async.parallelLimit(movieDetailParsers, 3, (err, movies) => {
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
        console.log("DONE!");
    });