import assert = require('assert');
import fs = require('fs');
import _Scraper = require('../Scraper');

describe("parseList", () => {

    it("20 items",(done) => {
        
        fs.readFile('yify-list.html', 'utf8', function (err, html) {
            if (err) throw err;
            
            var scraper = new _Scraper.Scraper();
            var data = scraper.parseList(html);

            assert.ok(data);
            assert.ok(data.nextUrl);
            assert.ok(data.nextUrl.length > 0);
            assert.ok(data.movies);
            assert.ok(data.movies.length == 20);

            assert.ok(data.movies[0].name == "Man Hunt");
            assert.ok(data.movies[0].year == 1941);
            assert.ok(data.movies[0].genres.length == 2);
            assert.ok(data.movies[0].genres[0] == "Drama");
            assert.ok(data.movies[0].genres[1] == "Thriller");
            assert.ok(data.movies[0].rating.imdb == 7.4);
            assert.ok(data.movies[0].downloads.length == 1);
            assert.ok(data.movies[0].downloads[0].ripper == "yify");
            assert.ok(data.movies[0].downloads[0].source == "https://yts.re/movie/man-hunt-1941");
            assert.ok(data.movies[0].downloads[0].torrent == "https://yts.re/torrent/download/EC70141F8005A5123CEFDFE273AB033FDE177533.torrent");
            assert.ok(data.movies[0].downloads[0].quality == "1080p");

            done();
        });
    });
});
