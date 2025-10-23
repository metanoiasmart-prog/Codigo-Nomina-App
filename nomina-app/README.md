# Aplicación de Nómina

Esta es una aplicación web para el cálculo de nómina, generada por Gemini.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- `backend/`: Una API de Node.js/Express que maneja la lógica de negocio y la base de datos (SQLite).
- `frontend/`: Una aplicación de React (usando Vite) que proporciona la interfaz de usuario.

## Cómo ejecutar la aplicación

Siga estos pasos para instalar las dependencias y ejecutar la aplicación. Deberá tener Node.js y npm instalados.

### 1. Configurar el Backend

Abra una terminal y navegue al directorio del backend:

```sh
cd C:\Users\HP\Escritorio\nomina-app\backend
```

Instale las dependencias:

```sh
npm install
```

Una vez instaladas, inicie el servidor de desarrollo:

```sh
npm run dev
```

El servidor del backend se ejecutará en `http://localhost:3001`. La primera vez que se inicie, creará un archivo `nomina.db` con la estructura de la base de datos y datos iniciales.

### 2. Configurar el Frontend

Abra **una nueva terminal** y navegue al directorio del frontend:

```sh
cd C:\Users\HP\Escritorio\nomina-app\frontend
```

Instale las dependencias:

```sh
npm install
```

Una vez instaladas, inicie el servidor de desarrollo de Vite:

```sh
npm run dev
```

La aplicación frontend se abrirá automáticamente en su navegador, generalmente en `http://localhost:5173`.

### 3. Usar la aplicación

- **Rol de Pagos**: La vista principal. Seleccione un período y haga clic en "Calcular Rol" para ver la nómina calculada.
- **Gestionar Empleados**: Aquí puede crear, ver, editar y eliminar empleados.
- **Configuración**: Permite ver y modificar los parámetros globales del sistema, como el Salario Básico Unificado (SBU).

## Compatibilidad con Lovable

Esta estructura de proyecto, con un backend de API REST y un frontend de React, es un patrón estándar que debería ser compatible con plataformas de despliegue y construcción de aplicaciones como Lovable, Vercel, Netlify, etc.

Para desplegar, generalmente se sube el código a un repositorio de Git (como GitHub) y se conecta a la plataforma de despliegue, configurando los comandos de construcción (`npm run build`) y de inicio (`npm start` o `npm run dev`) para cada parte (frontend y backend).

