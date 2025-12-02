import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    // Mock recommendations
    res.json({
        message: "Recommendations endpoint",
        results: []
    });
});

export default router;
