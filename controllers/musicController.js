import * as musicService from '../services/musicService.js';
import * as recommendationService from '../services/recommendationService.js';

export const searchMusic = async (req, res) => {
    try {
        const { query, provider, source, userId } = req.query; // Added source (voice/text) and userId
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        // Track the search
        if (userId) {
            recommendationService.trackInteraction(userId, 'search', {
                query,
                searchType: source === 'voice' ? 'voice' : 'text',
                provider
            });
        }

        const tracks = await musicService.searchTracks(query, provider);
        res.json({ results: tracks });
    } catch (error) {
        console.error('Music search error:', error);
        res.status(500).json({ error: 'Failed to fetch music' });
    }
};

export const getRecommendations = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            // If no user ID, return generic trending/popular
            const trending = await musicService.searchTracks('trending', 'all');
            return res.json({ results: trending });
        }

        const recommendations = await recommendationService.getRecommendations(userId);
        res.json({ results: recommendations });
    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
};
