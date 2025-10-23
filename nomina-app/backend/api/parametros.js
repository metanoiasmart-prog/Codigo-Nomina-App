const express = require('express');
const router = express.Router();

// Placeholder for parametros API
router.get('/', async (req, res) => {
    try {
        const parametros = await req.db.all('SELECT * FROM Parametros');
        res.json(parametros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/', async (req, res) => {
    const { clave, valor } = req.body;
    if (!clave || valor === undefined) {
        return res.status(400).json({ message: 'Se requieren clave y valor' });
    }

    try {
        const result = await req.db.run(
            'UPDATE Parametros SET valor = ? WHERE clave = ?',
            [valor, clave]
        );
        if (result.changes > 0) {
            res.json({ message: `Parámetro ${clave} actualizado` });
        } else {
            // If it doesn't exist, create it
            await req.db.run('INSERT INTO Parametros (clave, valor) VALUES (?, ?)', [clave, valor]);
            res.status(201).json({ message: `Parámetro ${clave} creado` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
