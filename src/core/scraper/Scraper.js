/// <reference path="typings/request/request.d.ts" />
/// <reference path="typings/cheerio/cheerio.d.ts" />
var request = require('request');
var cheerio = require('cheerio');
var Scraper = (function () {
    function Scraper() {
    }
    Scraper.prototype.scrapeList = function (url, callback) {
        var _this = this;
        request(url, function (err, response, body) {
            if (err)
                callback(err);
            callback(null, _this.parseList(body));
        });
    };
    Scraper.prototype.parseList = function (body) {
        var $ = cheerio.load(body);
        var movies = [];
        $('.browse-movie-wrap').each(function () {
            var $link = $(this).find("a.browse-movie-title");
            var movie = {
                name: $link.text(),
                year: parseInt($(this).find(".browse-movie-year").text()),
                genres: $(this).find("figcaption h4:not(.rating)").map(function (i, x) { return $(x).text(); }).toArray(),
                rating: {
                    imdb: parseFloat($(this).find(".rating").text())
                },
                downloads: []
            };
            $(this).find(".browse-movie-tags a").each(function (i, elem) { return movie.downloads.push({
                ripper: "yify",
                source: $link.attr("href"),
                torrent: $(elem).attr("href"),
                quality: $(elem).text(),
            }); });
            movies.push(movie);
        });
        return {
            movies: movies,
            nextUrl: $('.tsc_pagination a:contains(Next)').attr("href")
        };
    };
    return Scraper;
})();
exports.Scraper = Scraper;
//# sourceMappingURL=Scraper.js.map