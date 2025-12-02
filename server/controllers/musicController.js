import * as musicService from '../services/musicService.js';

export const searchMusic = async (req, res) => {
    try {
        const { query, provider } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const tracks = await musicService.searchTracks(query, provider);
        res.json({ results: tracks });
    } catch (error) {
        console.error('Music search error:', error);
        res.status(500).json({ error: 'Failed to fetch music' });
    }
};
