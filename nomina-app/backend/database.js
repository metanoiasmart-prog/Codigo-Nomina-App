const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function setupDatabase() {
    const db = await open({
        filename: './nomina.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS Empresas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            razon_social TEXT NOT NULL,
            ruc TEXT,
            direccion TEXT,
            activa BOOLEAN DEFAULT TRUE
        );

        CREATE TABLE IF NOT EXISTS PeriodosNomina (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            empresa_id INTEGER,
            mes TEXT NOT NULL,
            anio INTEGER NOT NULL,
            fecha_corte DATE,
            dias_mes INTEGER,
            numero_mes INTEGER,
            estado TEXT DEFAULT 'abierto',
            FOREIGN KEY (empresa_id) REFERENCES Empresas(id)
        );

        CREATE TABLE IF NOT EXISTS Cargos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT
        );

        CREATE TABLE IF NOT EXISTS Empleados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            empresa_id INTEGER,
            apellidos TEXT NOT NULL,
            nombres TEXT NOT NULL,
            cargo_id INTEGER,
            fecha_ingreso DATE,
            fecha_salida DATE,
            sueldo REAL,
            numero_afiliacion TEXT,
            cedula TEXT UNIQUE,
            estado TEXT DEFAULT 'activo',
            recibe_fondos_reserva BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (empresa_id) REFERENCES Empresas(id),
            FOREIGN KEY (cargo_id) REFERENCES Cargos(id)
        );

        CREATE TABLE IF NOT EXISTS DetalleRol (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            periodo_id INTEGER,
            empleado_id INTEGER,
            dias_mes INTEGER,
            dias_trabajados INTEGER,
            sueldo_nominal REAL,
            sueldo_proporcional REAL,
            horas_extra_50 INTEGER,
            horas_extra_100 INTEGER,
            valor_hex50 REAL,
            valor_hex100 REAL,
            bonificacion REAL,
            viaticos REAL,
            decimo_tercero REAL,
            decimo_cuarto REAL,
            total_ingresos REAL,
            prestamo REAL,
            anticipo REAL,
            retencion_renta REAL,
            aporte_iess REAL,
            otros_descuentos REAL,
            prestamo_iess REAL,
            total_descuentos REAL,
            subtotal REAL,
            fondos_reserva REAL,
            neto_recibir REAL,
            FOREIGN KEY (periodo_id) REFERENCES PeriodosNomina(id),
            FOREIGN KEY (empleado_id) REFERENCES Empleados(id)
        );

        CREATE TABLE IF NOT EXISTS Parametros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clave TEXT UNIQUE NOT NULL,
            valor TEXT NOT NULL,
            fecha_vigencia DATE
        );
    `);

    // Insert default parameters if they don't exist
    await db.run("INSERT OR IGNORE INTO Parametros (clave, valor, fecha_vigencia) VALUES (?, ?, ?)", 'SBU', '470', '2025-01-01');
    await db.run("INSERT OR IGNORE INTO Parametros (clave, valor) VALUES (?, ?)", 'PORCENTAJE_APORTE_IESS', '0.0945');
    await db.run("INSERT OR IGNORE INTO Parametros (clave, valor) VALUES (?, ?)", 'HORAS_MES_ESTANDAR', '240');
    await db.run("INSERT OR IGNORE INTO Parametros (clave, valor) VALUES (?, ?)", 'PORCENTAJE_FONDOS_RESERVA', '0.0833333333');

    // Insert default company
    await db.run("INSERT OR IGNORE INTO Empresas (id, razon_social, ruc) VALUES (?, ?, ?)", 1, 'BIOREMEDIACION BIOX CIA. LTDA.', '1234567890001');


    return db;
}

module.exports = setupDatabase;
