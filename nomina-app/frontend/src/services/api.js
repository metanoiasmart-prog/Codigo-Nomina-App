import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Empleados
  getEmpleados: () => apiClient.get('/empleados'),
  createEmpleado: (data) => apiClient.post('/empleados', data),
  updateEmpleado: (id, data) => apiClient.put(`/empleados/${id}`, data),
  deleteEmpleado: (id) => apiClient.delete(`/empleados/${id}`),

  // Periodos
  getPeriodos: () => apiClient.get('/periodos'),

  // Roles
  calcularRol: (periodo_id) => apiClient.post('/roles/calcular', { periodo_id }),
  
  // Parametros
  getParametros: () => apiClient.get('/parametros'),
  updateParametro: (data) => apiClient.put('/parametros', data),
};
