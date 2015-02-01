/// <reference path="typings/request/request.d.ts" />
/// <reference path="typings/cheerio/cheerio.d.ts" />

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
    rating: { imdb: number; }
    downloads: IDownload[];
}

export interface IDownload {
    ripper: string;
    source: string;
    quality: string;
    torrent?: string;
    magnetTorrent?: string;
}

export class Scraper {

    scrapeList(url: string, callback: (err?: Error, data?: IScrapedList) => void) {
        request(url, (err, response, body) => {
            if (err) callback(err);
            callback(null, this.parseList(body));
        });
    }

    parseList(body: string): IScrapedList {

        var $ = cheerio.load(body);

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
}