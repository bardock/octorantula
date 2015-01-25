var request = require('request')
  , cheerio = require('cheerio')
  , async = require('async')
  , format = require('util').format
  , endOfLine = require('os').EOL;

var url = "https://yts.re/browse-movie/0/All/All/0/latest/";

async.whilst(
    function () { return url; },
    function (callback) {
        request(url, function (err, response, body) {
            if (err) return callback(err);

            var $ = cheerio.load(body);
            
            console.log('----- URL: %s%s', url, endOfLine);
            
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
                console.log(movie, endOfLine);
            });
            
            url = $('.pagination a:contains(Next)').attr("href");

            callback();
        });
    },
    function (err) {
        if (err) throw err;
        console.log("DONE!");
    });
