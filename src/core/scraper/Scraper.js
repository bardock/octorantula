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
    Scraper.prototype.parseList = function (html) {
        var $ = cheerio.load(html);
        var movies = [];
        $('.browse-movie-wrap').each(function () {
            var $link = $(this).find("a.browse-movie-title");
            var movie = {
                name: $link.text(),
                year: parseInt($(this).find(".browse-movie-year").text()),
                genres: $(this).find("figcaption h4:not(.rating)").map(function (i, x) { return $(x).text(); }).toArray(),
                poster: $(this).find("img").attr("src"),
                rating: {
                    imdb: parseFloat($(this).find(".rating").text())
                },
                downloads: []
            };
            $(this).find(".browse-movie-tags a").each(function (i, elem) { return movie.downloads.push({
                ripper: "yify",
                source: $link.attr("href"),
                quality: $(elem).text(),
                torrent: $(elem).attr("href"),
            }); });
            movies.push(movie);
        });
        return {
            nextUrl: $('.tsc_pagination a:contains(Next)').attr("href"),
            movies: movies,
        };
    };
    Scraper.prototype.parseDetail = function (html, movie) {
        var $ = cheerio.load(html);
        movie.downloads.forEach(function (d) {
            d.magnetTorrent = $(".modal-download a[href='" + d.torrent + "']").siblings(".download-torrent.magnet").attr("href");
            //var versions = $(".tech-quality").toArray();
            //var versionIndex = versions.indexOf($(".tech-quality:contains(" + d.quality + ")")[0]);
            //var $container = $(".tech-spec-info:eq(" + versionIndex + ")");
            // TODO
        });
        var trailer = $(".youtube").attr("href");
        if (trailer) {
            if (trailer.indexOf("//") == 0)
                trailer = "http:" + trailer;
            movie.trailers = [trailer];
        }
        movie.imdbUrl = $("a[title=IMDb Rating]").attr("href");
        movie.rottenTomatoesUrl = $("a[href^='http://www.rottentomatoes.com']").attr("href");
        var rottenTomatoes = {
            tomatoMeterPerc: parseInt($("span:contains( - Critics)").siblings("span:contains(%)").text()),
            audiencePerc: parseInt($("span:contains( - Audience)").siblings("span:contains(%)").text())
        };
        if (rottenTomatoes.tomatoMeterPerc && rottenTomatoes.audiencePerc)
            movie.rating.rottenTomatoes = rottenTomatoes;
        movie.synopsis = $("h3:contains(Synopsis)").next().next().text().trim();
        movie.directors = $(".directors .name-cast").map(function (i, x) { return $(x).text(); }).toArray();
        movie.cast = [];
        $(".actors .name-cast").parent().each(function (i, x) {
            var actorAndCharacter = $(x).text().split("as");
            movie.cast.push({
                actor: actorAndCharacter[0].trim(),
                character: actorAndCharacter[1].trim()
            });
        });
        return movie;
    };
    return Scraper;
})();
exports.Scraper = Scraper;
//# sourceMappingURL=Scraper.js.map