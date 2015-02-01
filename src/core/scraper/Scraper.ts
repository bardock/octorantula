/// <reference path="typings/request/request.d.ts" />
/// <reference path="typings/cheerio/cheerio.d.ts" />

import request = require('request');
import cheerio = require('cheerio');

export class Scraper {

    scrapeList(url: string, callback: (Error?, any?) => void) {
        request(url, (err, response, body) => {
            if (err) callback(err);
            callback(null, this.parseList(body));
        });
    }

    parseList(body: string) {

        var $ = cheerio.load(body);

        var movies = [];

        $('.browse-movie-wrap').each(function () {
            var $link = $(this).find("a.browse-movie-title");
            var movie = {
                name: $link.text(),
                year: parseInt($(this).find(".browse-movie-year").text()),
                genres: $(this).find("figcaption h4:not(.rating)").map((i, x) => $(x).text()).toArray(),
                rating: {
                    imdb: parseFloat($(this).find(".rating").text())
                },
                downloads: []
            };
            $(this).find(".browse-movie-tags a").each((i, elem) => movie.downloads.push({
                ripper: "yify",
                source: $link.attr("href"),
                torrent: $(elem).attr("href"),
                quality: $(elem).text(),
            }));
            movies.push(movie);
        });

        return {
            movies: movies,
            nextUrl: $('.tsc_pagination a:contains(Next)').attr("href")
        }
    }
}