const express = require('express');
const cors = require('cors');
const setupDatabase = require('./database');
const empleadosRouter = require('./api/empleados');
const periodosRouter = require('./api/periodos');
const rolesRouter = require('./api/roles');
const empresasRouter = require('./api/empresas');
const parametrosRouter = require('./api/parametros');


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let db;

(async () => {
    db = await setupDatabase();
    console.log('Database setup complete.');

    // Middleware to attach db to req
    app.use((req, res, next) => {
        req.db = db;
        next();
    });
    
    // API routes
    app.use('/api/empleados', empleadosRouter);
    app.use('/api/periodos', periodosRouter);
    app.use('/api/roles', rolesRouter);
    app.use('/api/empresas', empresasRouter);
    app.use('/api/parametros', parametrosRouter);


    app.listen(port, () => {
        console.log(`Backend server listening at http://localhost:${port}`);
    });
})();
