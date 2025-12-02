import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: String, // Can be user ID or username for now
        required: false, // Optional for now until auth is fully implemented
    },
    tracks: [{
        trackId: String,
        trackName: String,
        artistName: String,
        collectionName: String,
        artworkUrl100: String,
        previewUrl: String,
        releaseDate: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;
