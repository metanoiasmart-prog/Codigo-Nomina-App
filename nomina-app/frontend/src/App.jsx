import React, { useState } from 'react';
import Empleados from './components/Empleados';
import RolDePagos from './components/RolDePagos';
import Parametros from './components/Parametros';

function App() {
  const [view, setView] = useState('rol'); // 'rol', 'empleados', 'parametros'

  return (
    <div>
      <h1>Aplicación de Nómina</h1>
      <nav>
        <button onClick={() => setView('rol')}>Rol de Pagos</button>
        <button onClick={() => setView('empleados')}>Gestionar Empleados</button>
        <button onClick={() => setView('parametros')}>Configuración</button>
      </nav>

      <hr />

      {view === 'rol' && <RolDePagos />}
      {view === 'empleados' && <Empleados />}
      {view === 'parametros' && <Parametros />}

    </div>
  );
}

export default App;
