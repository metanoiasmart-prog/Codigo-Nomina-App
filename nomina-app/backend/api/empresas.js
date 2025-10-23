const express = require('express');
const router = express.Router();

// Placeholder for empresas API
router.get('/', async (req, res) => {
    try {
        const empresas = await req.db.all('SELECT * FROM Empresas');
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
