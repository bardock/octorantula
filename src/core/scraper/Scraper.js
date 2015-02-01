/// <reference path="typings/cheerio/cheerio.d.ts" />
var cheerio = require('cheerio');
var Scraper = (function () {
    function Scraper() {
    }
    Scraper.prototype.scrape = function (body) {
        var $ = cheerio.load(body);
        var movies = [];
        $('.browse-content').each(function () {
            var $link = $(this).find("span.browseTitleLink a");
            var quality = $(this).find(".browseInfoList :contains(Quality:)").parent().contents().eq(1).text().trim();
            var movie = {
                name: $link.text().replace(quality, "").trim(),
                size: $(this).find(".browseInfoList :contains(Size:)").parent().contents().eq(1).text().trim(),
                genres: $(this).find(".browseInfoList :contains(Genre:)").parent().contents().eq(1).text().trim().split(/[\s|,]+/),
                ratings: {
                    imdb: parseFloat($(this).find(".browseInfoList :contains(IMDB Rating:)").parent().contents().eq(1).text().trim())
                },
                downloads: {
                    yify: {
                        source: $link.attr("href"),
                        torrent: $(this).find(".torrentDwl").attr("href"),
                        quality: quality,
                        peers: $(this).find(".peers").contents().eq(1).text().trim(),
                        seeds: $(this).find(".seeds").contents().eq(1).text().trim()
                    }
                }
            };
            movies.push(movie);
        });
        return {
            movies: movies,
            nextUrl: $('.pagination a:contains(Next)').attr("href")
        };
    };
    return Scraper;
})();
exports.Scraper = Scraper;
//# sourceMappingURL=Scraper.js.map