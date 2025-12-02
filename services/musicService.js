import axios from 'axios';

const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

export const searchTracks = async (query, provider = 'all') => {
    try {
        const promises = [];

        if (provider === 'jamendo' || provider === 'all') {
            promises.push(searchJamendo(query));
        }

        if (provider === 'deezer' || provider === 'all') {
            promises.push(searchDeezer(query));
        }

        const results = await Promise.allSettled(promises);

        // Flatten results and filter out failed requests
        return results
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => result.value);

    } catch (error) {
        console.error('Search tracks error:', error);
        throw error;
    }
};

const searchJamendo = async (query) => {
    try {
        const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
            params: {
                client_id: JAMENDO_CLIENT_ID,
                format: 'json',
                limit: 10, // Reduced limit to balance with Deezer
                search: query,
                include: 'musicinfo',
                audioformat: 'mp32'
            }
        });

        return response.data.results.map(track => ({
            trackId: `jamendo-${track.id}`,
            trackName: track.name,
            artistName: track.artist_name,
            collectionName: track.album_name,
            artworkUrl100: track.image,
            previewUrl: track.audio,
            releaseDate: track.releasedate,
            primaryGenreName: 'Music',
            provider: 'jamendo'
        }));
    } catch (error) {
        console.error('Jamendo search error:', error.message);
        return [];
    }
};

const searchDeezer = async (query) => {
    try {
        const response = await axios.get('https://api.deezer.com/search', {
            params: {
                q: query,
                limit: 10
            }
        });

        return response.data.data.map(track => ({
            trackId: `deezer-${track.id}`,
            trackName: track.title,
            artistName: track.artist.name,
            collectionName: track.album.title,
            artworkUrl100: track.album.cover_medium,
            previewUrl: track.preview,
            releaseDate: null, // Deezer search endpoint doesn't always return release date
            primaryGenreName: 'Music',
            provider: 'deezer'
        }));
    } catch (error) {
        console.error('Deezer search error:', error.message);
        return [];
    }
};
