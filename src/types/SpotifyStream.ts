export interface Welcome {
    item: Item;
}

export interface Item {
    date:       Date;
    isPlaying:  boolean;
    progressMs: number;
    deviceName: string;
    track:      Track;
    platform:   string;
}

export interface Track {
    albums:            Album[];
    artists:           Album[];
    durationMs:        number;
    explicit:          boolean;
    externalIds:       ExternalIDS;
    id:                number;
    name:              string;
    spotifyPopularity: number;
    spotifyPreview:    string;
    appleMusicPreview: null;
}

export interface Album {
    id:    number;
    image: string;
    name:  string;
}

export interface ExternalIDS {
    spotify:    string[];
    appleMusic: string[];
}
