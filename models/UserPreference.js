import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    topGenres: [{
        genre: String,
        count: { type: Number, default: 1 }
    }],
    topArtists: [{
        artist: String,
        count: { type: Number, default: 1 }
    }],
    searchHistory: [{
        query: String,
        timestamp: { type: Date, default: Date.now },
        source: { type: String, enum: ['text', 'voice'], default: 'text' }
    }],
    listeningHistory: [{
        trackId: String,
        artist: String,
        genre: String,
        timestamp: { type: Date, default: Date.now }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('UserPreference', userPreferenceSchema);
