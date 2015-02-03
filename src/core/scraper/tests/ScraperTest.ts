/// <reference path="../typings/should/should.d.ts" />

import should = require('should');
import fs = require('fs');
import ScraperModule = require('../Scraper');

var scraper = new ScraperModule.Scraper();

describe("parseList", () => {

    it("20 items",(done) => {
        
        fs.readFile('yify-list.html', 'utf8', function (err, html) {
            if (err) throw err;

            var data = scraper.parseList(html);

            should(data).be.eql({
                "nextUrl": "http:\/\/yts.re\/browse-movie\/0\/All\/All\/0\/latest?page=9",
                "movies": [
                    {
                        "name": "Man Hunt",
                        "year": 1941,
                        "genres": [
                            "Drama",
                            "Thriller"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Man_Hunt_1941\/medium-cover.jpg",
                        "rating": {
                            "imdb": 7.4
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/man-hunt-1941",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/EC70141F8005A5123CEFDFE273AB033FDE177533.torrent"
                            }
                        ]
                    },
                    {
                        "name": "Hellion",
                        "year": 2014,
                        "genres": [
                            "Drama",
                            "Thriller"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Hellion_2014\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.3
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/hellion-2014",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/3C1EF5D159F69435F53AF7D0C395422D6D0FCFA3.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/hellion-2014",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/06ED4E4659AE361B160F280C1CAF82C9E9FFA682.torrent"
                            }
                        ]
                    },
                    {
                        "name": "The Signal",
                        "year": 2014,
                        "genres": [
                            "Sci-Fi",
                            "Thriller"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/The_Signal_2014\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.2
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-signal-2014",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/BBD7B865BC14E44C26DA4EB6CEE9343DE3032E1D.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-signal-2014",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/482E6B46CD9D48BA711CB577E1342D6CF3D2FA4F.torrent"
                            }
                        ]
                    },
                    {
                        "name": "Canopy",
                        "year": 2013,
                        "genres": [
                            "Adventure",
                            "Drama"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Canopy_2013\/medium-cover.jpg",
                        "rating": {
                            "imdb": 5
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/canopy-2013",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/F3C11F98ACAA57B673865C1B833C3F0E88E8C2DA.torrent"
                            }
                        ]
                    },
                    {
                        "name": "The Emerald Forest",
                        "year": 1985,
                        "genres": [
                            "Action",
                            "Adventure"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/The_Emerald_Forest_1985\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.9
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-emerald-forest-1985",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/2822D69B2D7EFB92BD6264130D7297E1DF5C7A7C.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-emerald-forest-1985",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/F47032D9CB490C02D3607BE6E1DAA52EBAC22983.torrent"
                            }
                        ]
                    },
                    {
                        "name": "Menace II Society",
                        "year": 1993,
                        "genres": [
                            "Crime",
                            "Drama"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Menace_II_Society_1993\/medium-cover.jpg",
                        "rating": {
                            "imdb": 7.5
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/menace-ii-society-1993",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/0E3448BFDC802CA3667B33DF698FA066D82E7E15.torrent"
                            }
                        ]
                    },
                    {
                        "name": "Mickey, Donald, Goofy: The Three Musketeers",
                        "year": 2004,
                        "genres": [
                            "Animation",
                            "Adventure"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Mickey_Donald_Goofy_The_Three_Musketeers_2004\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.4
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/mickey-donald-goofy-the-three-musketeers-2004",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/147FB970C238B0EA6F5F803F2CC4FC8126361C8F.torrent"
                            }
                        ]
                    },
                    {
                        "name": "The Guest",
                        "year": 2014,
                        "genres": [
                            "Action",
                            "Mystery"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/The_Guest_2014\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.7
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-guest-2014",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/7CFA1BE24072795701386ABA248AD5E26C7F18AE.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-guest-2014",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/C0E6E2013925A063FEDBD9DB3F0F18F328C08C9B.torrent"
                            }
                        ]
                    },
                    {
                        "name": "Get on Up",
                        "year": 2014,
                        "genres": [
                            "Biography",
                            "Drama"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Get_on_Up_2014\/medium-cover.jpg",
                        "rating": {
                            "imdb": 7
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/get-on-up-2014",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/20EEE76ACA000D1BE199C0E60B023146492D86BA.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/get-on-up-2014",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/16CF571DF87FB1A9AD5B1E197C04C80C06F6DF1D.torrent"
                            }
                        ]
                    },
                    {
                        "name": "Dolls",
                        "year": 1987,
                        "genres": [
                            "Fantasy",
                            "Horror"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Dolls_1987\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.4
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/dolls-1987",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/C3D4198FB0875EDE5B1900B6DB2318876C037331.torrent"
                            }
                        ]
                    },
                    {
                        "name": "Gone Girl",
                        "year": 2014,
                        "genres": [
                            "Drama",
                            "Mystery"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Gone_Girl_2014\/medium-cover.jpg",
                        "rating": {
                            "imdb": 8.3
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/gone-girl-2014",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/A06130D93965BCA27A04CCB9A54CACEB1F5FBCB1.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/gone-girl-2014",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/D2310F718EB02F98665266786F7D00B42A20F055.torrent"
                            }
                        ]
                    },
                    {
                        "name": "Uncle Buck",
                        "year": 1989,
                        "genres": [
                            "Comedy",
                            "Drama"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Uncle_Buck_1989\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.9
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/uncle-buck-1989",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/C0D8C035BA4EC680E5142A811F831D84AB79EED0.torrent"
                            }
                        ]
                    },
                    {
                        "name": "Order of Chaos",
                        "year": 2010,
                        "genres": [
                            "Thriller"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Order_of_Chaos_2010\/medium-cover.jpg",
                        "rating": {
                            "imdb": 4.8
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/order-of-chaos-2010",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/F377F36816F40B09DCDDCA94595A84D3E134F4E1.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/order-of-chaos-2010",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/B617A1AB0D7AC35B995FDB59A688445575605EA3.torrent"
                            }
                        ]
                    },
                    {
                        "name": "The Boxtrolls",
                        "year": 2014,
                        "genres": [
                            "Animation",
                            "Adventure"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/The_Boxtrolls_2014\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.9
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-boxtrolls-2014",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/064F18673E7A6ACBA8745CA4A71413509521D182.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-boxtrolls-2014",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/205F03DB95617F7EAC3E9ED4415BB89FC6E362A8.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-boxtrolls-2014",
                                "quality": "3D",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/43EA6DD24AC404E48F27A5CB4C43430E58C1D34F.torrent"
                            }
                        ]
                    },
                    {
                        "name": "The Elevator: Three Minutes Can Change Your Life",
                        "year": 2013,
                        "genres": [
                            "Drama",
                            "Thriller"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/The_Elevator_Three_Minutes_Can_Change_Your_Life_2013\/medium-cover.jpg",
                        "rating": {
                            "imdb": 4.6
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-elevator-three-minutes-can-change-your-life-2013",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/64B2F94B3769F88398B182123B3224FD2C0E7C70.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-elevator-three-minutes-can-change-your-life-2013",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/56EFDC6E48C833C8241A784E93BD5D363553ECB1.torrent"
                            }
                        ]
                    },
                    {
                        "name": "When a Stranger Calls",
                        "year": 1979,
                        "genres": [
                            "Horror",
                            "Thriller"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/When_a_Stranger_Calls_1979\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.6
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/when-a-stranger-calls-1979",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/4EC46EA0BBF26C7B186E9FF49338163B7FCADCAB.torrent"
                            }
                        ]
                    },
                    {
                        "name": "I Origins",
                        "year": 2014,
                        "genres": [
                            "Drama",
                            "Sci-Fi"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/I_Origins_2014\/medium-cover.jpg",
                        "rating": {
                            "imdb": 7.3
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/i-origins-2014",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/6B6A3A5EB90818AA0B184390492335A4DDD3EDFD.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/i-origins-2014",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/62CA78D3A9E36C4B8CC35FC585621100FBB9D9E6.torrent"
                            }
                        ]
                    },
                    {
                        "name": "Tusk",
                        "year": 2014,
                        "genres": [
                            "Comedy",
                            "Drama"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/Tusk_2014\/medium-cover.jpg",
                        "rating": {
                            "imdb": 5.6
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/tusk-2014",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/F0AE04CDC9F77552F2BA7305438BE91E44BE2F4B.torrent"
                            },
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/tusk-2014",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/ED8C77F151F1A66D60F63D5C7E8D841DF2B58F42.torrent"
                            }
                        ]
                    },
                    {
                        "name": "TMNT",
                        "year": 2007,
                        "genres": [
                            "Animation",
                            "Action"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/TMNT_2007\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.4
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/tmnt-2007",
                                "quality": "1080p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/FAEB78A46502DFAF2F650287A4721C81F6BCCFAA.torrent"
                            }
                        ]
                    },
                    {
                        "name": "The Devil's Playground",
                        "year": 1976,
                        "genres": [
                            "Drama"
                        ],
                        "poster": "https:\/\/s.ynet.io\/assets\/images\/movies\/The_Devils_Playground_1976\/medium-cover.jpg",
                        "rating": {
                            "imdb": 6.9
                        },
                        "downloads": [
                            {
                                "ripper": "yify",
                                "source": "https:\/\/yts.re\/movie\/the-devils-playground-1976",
                                "quality": "720p",
                                "torrent": "https:\/\/yts.re\/torrent\/download\/069D525395DE2C82BCEF8119FE17D74FD62A644C.torrent"
                            }
                        ]
                    }
                ]
            });

            done();
        });
    });
});



describe("parseDetail",() => {

    it("the interview",(done) => {

        fs.readFile('yify-detail.html', 'utf8', function (err, html) {
            if (err) throw err;

            var movie: ScraperModule.IMovie = <any>{
                downloads: [
                    {
                        torrent: "https://yts.re/torrent/download/4A5942DD1BB1DF3D2491B18FF48F627415E1947C.torrent",
                        quality: "720p"
                    },
                    {
                        torrent: "https://yts.re/torrent/download/746F5C84A8B21256636A2A93482434DCF73741EB.torrent",
                        quality: "1080p"
                    }
                ]
            };
            var data = scraper.parseDetail(html, movie);

            //should(data).be.eql({

            done();
        });
    });
});
