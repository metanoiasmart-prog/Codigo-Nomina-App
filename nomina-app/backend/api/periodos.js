const express = require('express');
const router = express.Router();

// Placeholder for periodos API
router.get('/', (req, res) => {
    res.json({message: "API de Periodos funcionando"});
});

module.exports = router;
