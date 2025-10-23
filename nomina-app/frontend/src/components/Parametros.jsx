import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Parametros() {
    const [parametros, setParametros] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchParametros = () => {
        setLoading(true);
        api.getParametros()
            .then(response => {
                setParametros(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching parametros:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchParametros();
    }, []);

    const handleValueChange = (clave, valor) => {
        setParametros(parametros.map(p => p.clave === clave ? { ...p, valor } : p));
    };

    const handleSave = async (param) => {
        try {
            await api.updateParametro({ clave: param.clave, valor: param.valor });
            alert(`Parámetro ${param.clave} guardado.`);
            fetchParametros();
        } catch (error) {
            console.error("Error saving parametro:", error);
            alert('Error al guardar el parámetro.');
        }
    };

    if (loading) {
        return <div>Cargando parámetros...</div>;
    }

    return (
        <div>
            <h2>Configuración de Parámetros Globales</h2>
            <table>
                <thead>
                    <tr>
                        <th>Clave</th>
                        <th>Valor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {parametros.map(param => (
                        <tr key={param.id}>
                            <td>{param.clave}</td>
                            <td>
                                <input 
                                    type="text" 
                                    value={param.valor} 
                                    onChange={(e) => handleValueChange(param.clave, e.target.value)} 
                                />
                            </td>
                            <td>
                                <button onClick={() => handleSave(param)}>Guardar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Parametros;
