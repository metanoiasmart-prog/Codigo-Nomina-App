import React, { useState, useEffect } from 'react';
import api from '../services/api';

function RolDePagos() {
    const [periodos, setPeriodos] = useState([]);
    const [selectedPeriodo, setSelectedPeriodo] = useState('');
    const [rol, setRol] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Mock periodos for now, as the API is a placeholder
        const mockPeriodos = [
            { id: 1, mes: 'SEPTIEMBRE', anio: 2025 },
            { id: 2, mes: 'OCTUBRE', anio: 2025 },
        ];
        setPeriodos(mockPeriodos);
        // In a real scenario, you would fetch this from the backend:
        /* 
        api.getPeriodos()
            .then(response => setPeriodos(response.data))
            .catch(err => setError('No se pudieron cargar los períodos.'));
        */
    }, []);

    const handleCalcular = async () => {
        if (!selectedPeriodo) {
            alert('Por favor, seleccione un período.');
            return;
        }
        setLoading(true);
        setError('');
        setRol([]);
        try {
            const response = await api.calcularRol(selectedPeriodo);
            setRol(response.data);
        } catch (err) {
            setError('Error al calcular el rol de pagos. Verifique que el backend esté funcionando.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Cálculo de Rol de Pagos</h2>
            
            <div>
                <select value={selectedPeriodo} onChange={(e) => setSelectedPeriodo(e.target.value)}>
                    <option value="">Seleccione un período</option>
                    {periodos.map(p => (
                        <option key={p.id} value={p.id}>{p.mes} {p.anio}</option>
                    ))}
                </select>
                <button onClick={handleCalcular} disabled={loading}>
                    {loading ? 'Calculando...' : 'Calcular Rol'}
                </button>
            </div>

            {error && <p style={{color: 'red'}}>{error}</p>}

            {rol.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Empleado</th>
                            <th>Sueldo Nominal</th>
                            <th>Días Trabajados</th>
                            <th>Sueldo Proporcional</th>
                            <th>Total Ingresos</th>
                            <th>Aporte IESS</th>
                            <th>Total Descuentos</th>
                            <th>Neto a Recibir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rol.map(item => (
                            <tr key={item.empleado_id}>
                                <td>{item.empleado_nombre}</td>
                                <td>${item.sueldo_nominal?.toFixed(2)}</td>
                                <td>{item.dias_trabajados}</td>
                                <td>${item.sueldo_proporcional?.toFixed(2)}</td>
                                <td>${item.total_ingresos?.toFixed(2)}</td>
                                <td>${item.aporte_iess?.toFixed(2)}</td>
                                <td>${item.total_descuentos?.toFixed(2)}</td>
                                <td><strong>${item.neto_recibir?.toFixed(2)}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default RolDePagos;
