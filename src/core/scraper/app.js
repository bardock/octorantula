var request = require('request')
  , cheerio = require('cheerio')
  , async = require('async')
  , format = require('util').format
  , endOfLine = require('os').EOL;

var concurrency = 2
  , url = "https://yts.re/browse-movie/0/All/All/0/latest/";

async.whilst(
    function () { return url; },
    function (callback) {
        request(url, function (err, response, body) {
            if (err) return callback(err);

            var $ = cheerio.load(body);
            
            console.log('----- URL: %s%s', url, endOfLine);
            
            $('span.browseTitleLink a').each(function () {
                console.log('%s%s', $(this).text(), endOfLine);
            });
            
            url = $('.pagination a:contains(Next)').attr("href");

            callback();
        });
    },
    function (err) {
        if (err) throw err;
        console.log("DONE!");
    });
