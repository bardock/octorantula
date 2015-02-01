/// <reference path="../typings/should/should.d.ts" />

import should = require('should');
import fs = require('fs');
import _Scraper = require('../Scraper');

describe("parseList", () => {

    it("20 items",(done) => {
        
        fs.readFile('yify-list.html', 'utf8', function (err, html) {
            if (err) throw err;

            var scraper = new _Scraper.Scraper();
            var data = scraper.parseList(html);

            should(data).be.ok;

            should(data.nextUrl).be.ok.String.and.match(/^https?:\/\//);

            should(data.movies).be.ok.and.an.Array.of.length(20);

            data.movies[0].should.be.eql({
                name: "Man Hunt",
                year: 1941,
                genres: ["Drama", "Thriller"],
                rating: { imdb: 7.4 },
                downloads: [{
                    ripper: "yify",
                    source: "https://yts.re/movie/man-hunt-1941",
                    torrent: "https://yts.re/torrent/download/EC70141F8005A5123CEFDFE273AB033FDE177533.torrent",
                    quality: "1080p"
                }]
            });
            done();
        });
    });
});
