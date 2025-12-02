import Playlist from '../models/Playlist.js';

export const getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch playlists' });
    }
};

export const createPlaylist = async (req, res) => {
    try {
        const { name, userId } = req.body;
        const newPlaylist = new Playlist({
            name,
            user: userId,
            tracks: []
        });
        const savedPlaylist = await newPlaylist.save();
        res.status(201).json(savedPlaylist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create playlist' });
    }
};

export const addTrackToPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { track } = req.body;

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        playlist.tracks.push(track);
        await playlist.save();
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add track to playlist' });
    }
};
