import ListeningHistory from '../models/ListeningHistory.js';
import UserPreference from '../models/UserPreference.js';
import * as musicService from './musicService.js';

export const getRecommendations = async (userId) => {
    try {
        // 1. Get user preferences
        let prefs = await UserPreference.findOne({ userId });

        // If no prefs, try to build them from recent history
        if (!prefs) {
            await updateUserPreferences(userId);
            prefs = await UserPreference.findOne({ userId });
        }

        // 2. Formulate query based on top preferences
        let query = 'top hits'; // Default fallback

        if (prefs) {
            // Simple weighting: mix of top artist and top genre
            const topArtist = prefs.topArtists.sort((a, b) => b.count - a.count)[0];
            const topGenre = prefs.topGenres.sort((a, b) => b.count - a.count)[0];

            if (topArtist && Math.random() > 0.5) {
                query = `artist:"${topArtist.artist}"`;
            } else if (topGenre) {
                query = `genre:"${topGenre.genre}"`;
            } else if (topArtist) {
                query = topArtist.artist;
            }
        }

        // 3. Search for recommendations
        // We use 'all' providers to get the best mix
        const recommendations = await musicService.searchTracks(query, 'all');

        // Filter out duplicates or already played songs could be added here
        return recommendations.slice(0, 20);

    } catch (error) {
        console.error('Get recommendations error:', error);
        // Fallback
        return musicService.searchTracks('trending', 'all');
    }
};

export const trackInteraction = async (userId, type, data) => {
    try {
        // Log to history
        await ListeningHistory.create({
            userId,
            action: type, // 'search' or 'play'
            ...data
        });

        // Update preferences asynchronously
        updateUserPreferences(userId).catch(err => console.error('Pref update error:', err));
    } catch (error) {
        console.error('Track interaction error:', error);
    }
};

const updateUserPreferences = async (userId) => {
    try {
        // Aggregate last 50 interactions
        const history = await ListeningHistory.find({ userId })
            .sort({ timestamp: -1 })
            .limit(50);

        if (!history.length) return;

        const artistCounts = {};
        const genreCounts = {};

        history.forEach(item => {
            if (item.artistName) {
                artistCounts[item.artistName] = (artistCounts[item.artistName] || 0) + 1;
            }
            // Note: Genre might not always be available in search logs, 
            // but if we had it from track details it would go here.
            // For now we'll assume a default or extracted genre if available.
        });

        const topArtists = Object.entries(artistCounts)
            .map(([artist, count]) => ({ artist, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        await UserPreference.findOneAndUpdate(
            { userId },
            {
                userId,
                topArtists,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );

    } catch (error) {
        console.error('Update preferences error:', error);
    }
};
