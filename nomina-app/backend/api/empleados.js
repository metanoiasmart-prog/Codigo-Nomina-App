const express = require('express');
const router = express.Router();

// GET all employees
router.get('/', async (req, res) => {
    try {
        const empleados = await req.db.all('SELECT * FROM Empleados');
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET one employee
router.get('/:id', async (req, res) => {
    try {
        const empleado = await req.db.get('SELECT * FROM Empleados WHERE id = ?', [req.params.id]);
        if (empleado) {
            res.json(empleado);
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE an employee
router.post('/', async (req, res) => {
    const { empresa_id, apellidos, nombres, cargo_id, fecha_ingreso, sueldo, numero_afiliacion, cedula, recibe_fondos_reserva } = req.body;
    try {
        const result = await req.db.run(
            'INSERT INTO Empleados (empresa_id, apellidos, nombres, cargo_id, fecha_ingreso, sueldo, numero_afiliacion, cedula, recibe_fondos_reserva) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [empresa_id, apellidos, nombres, cargo_id, fecha_ingreso, sueldo, numero_afiliacion, cedula, recibe_fondos_reserva]
        );
        res.status(201).json({ id: result.lastID, ...req.body });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE an employee
router.put('/:id', async (req, res) => {
    const { empresa_id, apellidos, nombres, cargo_id, fecha_ingreso, fecha_salida, sueldo, numero_afiliacion, cedula, estado, recibe_fondos_reserva } = req.body;
    try {
        const result = await req.db.run(
            'UPDATE Empleados SET empresa_id = ?, apellidos = ?, nombres = ?, cargo_id = ?, fecha_ingreso = ?, fecha_salida = ?, sueldo = ?, numero_afiliacion = ?, cedula = ?, estado = ?, recibe_fondos_reserva = ? WHERE id = ?',
            [empresa_id, apellidos, nombres, cargo_id, fecha_ingreso, fecha_salida, sueldo, numero_afiliacion, cedula, estado, recibe_fondos_reserva, req.params.id]
        );
        if (result.changes > 0) {
            res.json({ message: 'Empleado actualizado' });
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE an employee
router.delete('/:id', async (req, res) => {
    try {
        const result = await req.db.run('DELETE FROM Empleados WHERE id = ?', [req.params.id]);
        if (result.changes > 0) {
            res.json({ message: 'Empleado eliminado' });
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
