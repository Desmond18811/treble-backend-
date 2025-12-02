import mongoose from 'mongoose';

const listeningHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    query: {
        type: String,
        trim: true
    },
    trackId: {
        type: String
    },
    trackName: String,
    artistName: String,
    provider: {
        type: String,
        enum: ['jamendo', 'deezer', 'musicbrainz', 'other']
    },
    searchType: {
        type: String,
        enum: ['text', 'voice'],
        default: 'text'
    },
    action: {
        type: String,
        enum: ['search', 'play'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('ListeningHistory', listeningHistorySchema);
