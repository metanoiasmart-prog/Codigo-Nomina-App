import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Empleados() {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null); // employee object or null
    const [formData, setFormData] = useState({});

    const fetchEmpleados = () => {
        setLoading(true);
        api.getEmpleados()
            .then(response => {
                setEmpleados(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching empleados:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleEdit = (empleado) => {
        setEditing(empleado);
        setFormData(empleado);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este empleado?')) {
            try {
                await api.deleteEmpleado(id);
                fetchEmpleados();
            } catch (error) {
                console.error("Error deleting empleado:", error);
                alert('Error al eliminar el empleado.');
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.updateEmpleado(editing.id, formData);
            } else {
                await api.createEmpleado(formData);
            }
            setEditing(null);
            setFormData({});
            fetchEmpleados();
        } catch (error) {
            console.error("Error saving empleado:", error);
            alert('Error al guardar el empleado.');
        }
    };

    if (loading) {
        return <div>Cargando empleados...</div>;
    }

    return (
        <div>
            <h2>Gestión de Empleados</h2>
            
            <form onSubmit={handleFormSubmit}>
                <h3>{editing ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
                <input name="nombres" value={formData.nombres || ''} onChange={handleInputChange} placeholder="Nombres" required />
                <input name="apellidos" value={formData.apellidos || ''} onChange={handleInputChange} placeholder="Apellidos" required />
                <input name="cedula" value={formData.cedula || ''} onChange={handleInputChange} placeholder="Cédula" required />
                <input name="sueldo" type="number" step="0.01" value={formData.sueldo || ''} onChange={handleInputChange} placeholder="Sueldo" required />
                <input name="fecha_ingreso" type="date" value={formData.fecha_ingreso || ''} onChange={handleInputChange} placeholder="Fecha de Ingreso" />
                <input name="numero_afiliacion" value={formData.numero_afiliacion || ''} onChange={handleInputChange} placeholder="N° Afiliación IESS" />
                <div>
                    <label>
                        <input type="checkbox" name="recibe_fondos_reserva" checked={formData.recibe_fondos_reserva || false} onChange={handleInputChange} />
                        ¿Recibe Fondos de Reserva mensualmente?
                    </label>
                </div>
                <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setFormData({}); }}>Cancelar</button>}
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Apellidos</th>
                        <th>Nombres</th>
                        <th>Cédula</th>
                        <th>Sueldo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empleados.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.apellidos}</td>
                            <td>{emp.nombres}</td>
                            <td>{emp.cedula}</td>
                            <td>{emp.sueldo}</td>
                            <td>
                                <button onClick={() => handleEdit(emp)}>Editar</button>
                                <button onClick={() => handleDelete(emp.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Empleados;
