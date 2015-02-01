var async = require('async')
  , Scraper = require('./Scraper.js').Scraper;

var url = "https://yts.re/browse-movie/0/All/All/0/latest/";

var scraper = new Scraper();

async.whilst(
    /* test: */ function () { return url; },

    /* iterator: */ function (callback) {

        scraper.scrapeList(url, function (err, data) {

            if (err) return callback(err);
            
            console.log('----- URL: %s', url);
            
            async.forEach(
                data.movies, 
                function (movie) { console.log(movie) },
                function () {
                    url = data.nextUrl;
                    url = null;
                    callback();
                });
        });
    },
    /* callback: */ function (err) {
        if (err) throw err;
        console.log("DONE!");
    });
