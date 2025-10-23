const express = require('express');
const router = express.Router();

// Placeholder for roles API
router.get('/', (req, res) => {
    res.json({message: "API de Roles funcionando"});
});

// This is where the main calculation logic will go
router.post('/calcular', async (req, res) => {
    const { periodo_id } = req.body;
    if (!periodo_id) {
        return res.status(400).json({ message: 'Se requiere periodo_id' });
    }

    try {
        // 1. Get periodo info
        const periodo = await req.db.get('SELECT * FROM PeriodosNomina WHERE id = ?', periodo_id);
        if (!periodo) {
            return res.status(404).json({ message: 'Periodo no encontrado' });
        }

        // 2. Get all active employees for the company
        const empleados = await req.db.all('SELECT * FROM Empleados WHERE estado = \'activo\' AND empresa_id = ?', periodo.empresa_id);

        // 3. Get global parameters
        const params = await req.db.all('SELECT clave, valor FROM Parametros');
        const parametros = params.reduce((acc, p) => ({ ...acc, [p.clave]: parseFloat(p.valor) }), {});

        const SBU = parametros.SBU || 470;
        const HORAS_MES = parametros.HORAS_MES_ESTANDAR || 240;
        const PORC_IESS = parametros.PORCENTAJE_APORTE_IESS || 0.0945;
        const PORC_FONDOS_RESERVA = parametros.PORCENTAJE_FONDOS_RESERVA || (1/12);

        // 4. Process each employee
        const resultados = [];
        for (const empleado of empleados) {
            // For MVP, we assume full month worked. In future, this would come from input.
            const dias_trabajados = periodo.dias_mes;
            const horas_extra_50 = 0; // Placeholder
            const horas_extra_100 = 0; // Placeholder
            const bonificacion = 0; // Placeholder
            const viaticos = 0; // Placeholder
            const prestamo = 0; // Placeholder
            const anticipo = 0; // Placeholder
            const retencion_renta = 0; // Placeholder
            const otros_descuentos = 0; // Placeholder
            const prestamo_iess = 0; // Placeholder

            // Calculations from the prompt
            const sueldo_proporcional = (empleado.sueldo / periodo.dias_mes) * dias_trabajados;
            const valor_hora = empleado.sueldo / HORAS_MES;
            const valor_hex50 = valor_hora * horas_extra_50 * 1.5;
            const valor_hex100 = valor_hora * horas_extra_100 * 2;
            
            const base_decimos = sueldo_proporcional + valor_hex50 + valor_hex100;
            const decimo_tercero = base_decimos / 12;
            const decimo_cuarto = ((SBU / HORAS_MES) * 8 * dias_trabajados) / 12;

            const total_ingresos = sueldo_proporcional + valor_hex50 + valor_hex100 + bonificacion + viaticos + decimo_tercero + decimo_cuarto;

            const base_aporte_iess = sueldo_proporcional + valor_hex50 + valor_hex100 + bonificacion;
            const aporte_iess = base_aporte_iess * PORC_IESS;

            const total_descuentos = prestamo + anticipo + retencion_renta + aporte_iess + otros_descuentos + prestamo_iess;

            const subtotal = total_ingresos - total_descuentos;

            let fondos_reserva = 0;
            if (empleado.recibe_fondos_reserva) {
                fondos_reserva = (sueldo_proporcional + valor_hex50 + valor_hex100) * PORC_FONDOS_RESERVA;
            }

            const neto_recibir = subtotal + fondos_reserva;

            const detalle = {
                empleado_id: empleado.id,
                empleado_nombre: `${empleado.apellidos} ${empleado.nombres}`,
                dias_trabajados,
                sueldo_nominal: empleado.sueldo,
                sueldo_proporcional,
                valor_hex50,
                valor_hex100,
                bonificacion,
                viaticos,
                decimo_tercero,
                decimo_cuarto,
                total_ingresos,
                aporte_iess,
                total_descuentos,
                neto_recibir
            };
            
            resultados.push(detalle);
        }

        res.json(resultados);

    } catch (error) {
        console.error("Error calculating role:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
