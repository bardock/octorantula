/// <reference path="../typings/should/should.d.ts" />
var logger = require('../logger');
var should = require('should');
var fs = require('fs');
var Parser = require('../Parser');
logger.clear();
var parser = new Parser();
describe("parseDetail", function () {
    it("the interview", function (done) {
        fs.readFile('yify-detail.html', 'utf8', function (err, html) {
            if (err)
                throw err;
            var movie = {
                downloads: [
                    {
                        torrent: "https://yts.re/torrent/download/4A5942DD1BB1DF3D2491B18FF48F627415E1947C.torrent",
                        quality: "720p"
                    },
                    {
                        torrent: "https://yts.re/torrent/download/746F5C84A8B21256636A2A93482434DCF73741EB.torrent",
                        quality: "1080p"
                    }
                ],
                rating: { imdb: 7.5 }
            };
            var data = parser.parseDetail(html, movie);
            should(data).be.eql({
                "downloads": [
                    {
                        "torrent": "https:\/\/yts.re\/torrent\/download\/4A5942DD1BB1DF3D2491B18FF48F627415E1947C.torrent",
                        "quality": "720p",
                        "magnetTorrent": "magnet:?xt=urn:btih:4A5942DD1BB1DF3D2491B18FF48F627415E1947C&dn=The+Interview+%282014%29&tr=http:\/\/exodus.desync.com:6969\/announce&tr=udp:\/\/tracker.openbittorrent.com:80\/announce&tr=udp:\/\/open.demonii.com:1337\/announce&tr=udp:\/\/exodus.desync.com:6969\/announce&tr=udp:\/\/tracker.yify-torrents.com\/announce",
                        "fileSize": "812.15 MB",
                        "resolution": "1280*536",
                        "language": "English",
                        "fps": 23.976,
                        "peers": 10301,
                        "seeds": 6743
                    },
                    {
                        "torrent": "https:\/\/yts.re\/torrent\/download\/746F5C84A8B21256636A2A93482434DCF73741EB.torrent",
                        "quality": "1080p",
                        "magnetTorrent": "magnet:?xt=urn:btih:746F5C84A8B21256636A2A93482434DCF73741EB&dn=The+Interview+%282014%29&tr=http:\/\/exodus.desync.com:6969\/announce&tr=udp:\/\/tracker.openbittorrent.com:80\/announce&tr=udp:\/\/open.demonii.com:1337\/announce&tr=udp:\/\/exodus.desync.com:6969\/announce&tr=udp:\/\/tracker.yify-torrents.com\/announce",
                        "fileSize": "1.64 GB",
                        "resolution": "1920*808",
                        "language": "English",
                        "fps": 23.976,
                        "peers": 19727,
                        "seeds": 25272
                    }
                ],
                "rating": {
                    "imdb": 7.5,
                    "rottenTomatoes": {
                        "tomatoMeterPerc": 52,
                        "audiencePerc": 54
                    }
                },
                "duration": "1hr 52 min",
                "trailers": [
                    "http:\/\/www.youtube.com\/embed\/frsvWVEHowg?rel=0&wmode=transparent&border=0&autoplay=1&iv_load_policy=3"
                ],
                "imdbUrl": "http:\/\/www.imdb.com\/title\/tt2788710\/",
                "imdbId": "tt2788710",
                "rottenTomatoesUrl": "http:\/\/www.rottentomatoes.com\/alias?type=imdbid&s=2788710",
                "synopsis": "In the action-comedy The Interview, Dave Skylark (James Franco) and his producer Aaron Rapoport (Seth Rogen) run the popular celebrity tabloid TV show \"Skylark Tonight.\" When they discover that North Korean dictator Kim Jong-un is a fan of the show, they land an interview with him in an attempt to legitimize themselves as journalists. As Dave and Aaron prepare to travel to Pyongyang, their plans change when the CIA recruits them, perhaps the two least-qualified men imaginable, to assassinate Kim Jong-un.",
                "directors": [
                    "Evan Goldberg",
                    "Seth Rogen"
                ],
                "cast": [
                    {
                        "actor": "James Franco",
                        "character": "Dave Skylark"
                    },
                    {
                        "actor": "Seth Rogen",
                        "character": "Aaron Rapaport"
                    },
                    {
                        "actor": "Randall Park",
                        "character": "President Kim"
                    },
                    {
                        "actor": "Lizzy Caplan",
                        "character": "Agent Lacey"
                    }
                ]
            });
            done();
        });
    });
});
//# sourceMappingURL=ParserTestDetail.js.map