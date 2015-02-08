module Models {

    export interface IScrapedList {
        nextUrl: string;
        movies: IMovie[];
    }

    export interface IMovie {
        imdbId: string;
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
        sourceListUrl: string;
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
}

export = Models;