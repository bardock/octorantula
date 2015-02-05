/// <reference path="typings/async/async.d.ts" />
var async = require('async');
var ScraperModule = require('./Scraper');
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
                url = data.nextUrl;
                //url = null;
                callback();
            });
        });
    });
}, 
/* callback: */
function (err) {
    if (err)
        throw err;
    console.log("DONE!");
});
//# sourceMappingURL=app.js.map