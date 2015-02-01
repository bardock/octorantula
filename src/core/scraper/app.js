var request = require('request')
  , cheerio = require('cheerio')
  , async = require('async')
  , format = require('util').format
  , Scraper = require('./Scraper.js').Scraper;

var url = "https://yts.re/browse-movie/0/All/All/0/latest/";

var scraper = new Scraper();
async.whilst(
    function () { return url; },
    function (callback) {
        request(url, function (err, response, body) {
            if (err) return callback(err);
            
            console.log('----- URL: %s', url);

            var data = scraper.scrape(body);
            
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
    function (err) {
        if (err) throw err;
        console.log("DONE!");
    });
