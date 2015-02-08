/// <reference path="typings/request/request.d.ts" />
/// <reference path="typings/cheerio/cheerio.d.ts" />

import logger = require('./logger');
import request = require('request');
import cheerio = require('cheerio');

export interface IScrapedList {
    nextUrl: string;
    movies: IMovie[];
}

export interface IMovie {
    name: string;
    year: number;
    genres: string[];
    poster: string;
    rating: {
        imdb: number;
        rottenTomatoes?: {
            tomatoMeterPerc: number;
            audiencePerc: number;
        };
    };
    downloads: IDownload[];
    trailers?: string[];
    imdbUrl?: string;
    rottenTomatoesUrl?: string;
    duration?: string;
    synopsis?: string;
    directors?: string[];
    cast?: {
        actor: string;
        character: string;
    }[];
    addedOn?: Date;
}

export interface IDownload {
    ripper: string;
    source: string;
    quality: string;
    torrent?: string;
    magnetTorrent?: string;
    fileSize?: string;
    resolution?: string;
    language?: string;
    fps?: number;
    peers?: number;
    seeds?: number;
}

export class Scraper {

    scrapeList(url: string, callback: (err?: Error, data?: IScrapedList) => void) {
        logger.info("Requesting list at url: %s", url);

        request(url,(err, response, html) => {
            if (err) callback(err);

            logger.debug("List html obtained from url: %s", url);

            var list = this.parseList(html);
            logger.debug("List parsed from url: %s", url, list);

            callback(null, list);
        });
    }

    parseList(html: string): IScrapedList {

        var $ = cheerio.load(html);

        var movies = [];

        $('.browse-movie-wrap').each(function () {
            var $link = $(this).find("a.browse-movie-title");
            var movie: IMovie = {
                name: $link.text(),
                year: parseInt($(this).find(".browse-movie-year").text()),
                genres: $(this).find("figcaption h4:not(.rating)").map((i, x) => $(x).text()).toArray<string>(),
                poster: $(this).find("img").attr("src"),
                rating: {
                    imdb: parseFloat($(this).find(".rating").text())
                },
                downloads: []
            };
            $(this).find(".browse-movie-tags a").each((i, elem) => movie.downloads.push({
                ripper: "yify",
                source: $link.attr("href"),
                quality: $(elem).text(),
                torrent: $(elem).attr("href"),
            }));
            movies.push(movie);
        });

        return {
            nextUrl: $('.tsc_pagination a:contains(Next)').attr("href"),
            movies: movies,
        }
    }

    parseDetailUrl(url: string, movie: IMovie, callback: (err?: Error, movie?: IMovie) => void) {
        logger.info("Requesting detail at url: %s", url);

        request(url, (err, response, html) => {
            if (err) callback(err);

            logger.debug("Detail html obtained from url: %s", url);

            movie = this.parseDetail(html, movie);
            logger.debug("Movie parsed from url: %s", url, movie);

            callback(null, movie);
        });
    }

    parseDetail(html: string, movie: IMovie): IMovie {
        var $ = cheerio.load(html);

        movie.downloads.forEach(d => {
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

        var trailer: string = $(".youtube").attr("href");
        if (trailer) {
            if (trailer.indexOf("//") == 0)
                trailer = "http:" + trailer;
            movie.trailers = [trailer];
        }

        movie.imdbUrl = $("a[title='IMDb Rating']").attr("href");
        movie.rottenTomatoesUrl = $("a[href^='http://www.rottentomatoes.com']").attr("href");

        var rottenTomatoes = {
            tomatoMeterPerc: parseInt($("span:contains( - Critics)").siblings("span:contains(%)").text()),
            audiencePerc: parseInt($("span:contains( - Audience)").siblings("span:contains(%)").text())
        };
        if (rottenTomatoes.tomatoMeterPerc && rottenTomatoes.audiencePerc)
            movie.rating.rottenTomatoes = rottenTomatoes;

        movie.synopsis = $("h3:contains(Synopsis)").next().next().text().trim();

        movie.directors = $(".directors .name-cast").map((i, x) => $(x).text()).toArray<string>();

        movie.cast = [];
        $(".actors .name-cast").parent().each((i, x) => {
            var actorAndCharacter = $(x).text().split("as");
            movie.cast.push({
                actor: actorAndCharacter[0].trim(),
                character: actorAndCharacter[1].trim()
            });
        });
        
        return movie;
    }
}