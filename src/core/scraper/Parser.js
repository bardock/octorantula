/// <reference path="typings/request/request.d.ts" />
/// <reference path="typings/cheerio/cheerio.d.ts" />
var logger = require('./logger');
var request = require('request');
var cheerio = require('cheerio');
var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.parseListByUrl = function (url, callback) {
        var _this = this;
        logger.info("Requesting list at url: %s", url);
        request(url, function (err, response, html) {
            if (err)
                callback(err);
            logger.debug("List html obtained from url: %s", url, { html: html });
            var list = _this.parseList(html);
            list.movies.forEach(function (x) { return x.sourceListUrl = url; });
            logger.debug("List parsed from url: %s", url, list);
            callback(null, list);
        });
    };
    Parser.prototype.parseList = function (html) {
        var $ = cheerio.load(html);
        var movies = [];
        $('.browse-movie-wrap').each(function () {
            var $link = $(this).find("a.browse-movie-title");
            var movie = {
                imdbId: null,
                name: $link.text(),
                year: parseInt($(this).find(".browse-movie-year").text()),
                genres: $(this).find("figcaption h4:not(.rating)").map(function (i, x) { return $(x).text(); }).toArray(),
                poster: $(this).find("img").attr("src"),
                rating: {
                    imdb: parseFloat($(this).find(".rating").text())
                },
                downloads: [],
                sourceListUrl: null
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
    Parser.prototype.parseDetailByUrl = function (url, movie, callback) {
        var _this = this;
        logger.info("Requesting detail at url: %s", url);
        request(url, function (err, response, html) {
            if (err)
                callback(err);
            logger.debug("Detail html obtained from url: %s", url, { html: html });
            movie = _this.parseDetail(html, movie);
            logger.debug("Movie parsed from url: %s", url, movie);
            callback(null, movie);
        });
    };
    Parser.prototype.parseDetail = function (html, movie) {
        var $ = cheerio.load(html);
        movie.downloads.forEach(function (d) {
            d.magnetTorrent = $(".modal-download a[href='" + d.torrent + "']").siblings(".download-torrent.magnet").attr("href");
            var versions = $(".tech-quality").toArray();
            var versionIndex = versions.indexOf($(".tech-quality:contains(" + d.quality + ")")[0]);
            var $container = $(".tech-spec-info").eq(versionIndex);
            d.fileSize = $container.find(".icon-folder").first().parent().text().trim();
            d.resolution = $container.find(".icon-expand").first().parent().text().trim();
            d.language = $container.find(".icon-volume-medium").first().parent().text().trim();
            d.fps = parseFloat($container.find(".icon-film").first().parent().text().trim());
            var peersAndSeeds = $container.find(".tech-peers-seeds").first().parent().text().replace("P/S", "").trim().split("/");
            d.peers = parseInt(peersAndSeeds[0]);
            d.seeds = parseInt(peersAndSeeds[1]);
        });
        movie.duration = $(".icon-clock").first().parent().text().trim();
        var trailer = $(".youtube").attr("href");
        if (trailer) {
            if (trailer.indexOf("//") == 0)
                trailer = "http:" + trailer;
            movie.trailers = [trailer];
        }
        movie.imdbUrl = $("a[title='IMDb Rating']").attr("href");
        if (!movie.imdbUrl)
            throw "IMDB url was not found for movie " + movie.name;
        var imdbIdMatch = /\/(tt\d+)/.exec(movie.imdbUrl);
        if (!imdbIdMatch || imdbIdMatch.length != 2)
            throw "Unexpected format in IMDB url " + movie.imdbUrl;
        movie.imdbId = imdbIdMatch[1];
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
    return Parser;
})();
module.exports = Parser;
//# sourceMappingURL=Parser.js.map