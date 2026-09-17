# Frontend - Portal de equipo

Frontend de la aplicación web desarrollado con Angular y TypeScript.

## Tecnologías

- Angular
- TypeScript
- Angular CDK
- HTML
- CSS

---

# Requisitos

Para ejecución manual:

- Node.js 20+
- npm
- Angular CLI

Para ejecución mediante Docker:

- Docker
- Docker Compose

---

# Instalación

Desde esta carpeta:

```bash
npm install
```

---

# Ejecución en desarrollo

```bash
npm start
```

La aplicación estará disponible normalmente en:

```text
http://localhost:4200
```

---

# Compilación

```bash
npm run build
```

---

# Funcionalidades

## Login

Permite iniciar sesión utilizando las cuentas de demostración.

Administrador:

```text
admin@test.com
Admin123
```

Usuario:

```text
user@test.com
User123
```

---

## Dashboard

Muestra:

- Total de notas.
- Pendientes.
- En curso.
- Hechas.

Las métricas se obtienen desde la API.

---

## Tablero

Permite:

- Crear notas.
- Editar título.
- Editar texto.
- Cambiar estado.
- Guardar cambios.
- Eliminar notas.
- Mover notas mediante drag and drop.

La posición se guarda automáticamente al finalizar el movimiento.

---

## Administración de usuarios

Disponible únicamente para administradores.

Permite:

- Listar usuarios.
- Crear usuarios.
- Editar usuarios.
- Asignar roles.
- Activar usuarios.
- Desactivar usuarios.

---

# Comunicación con el backend

El frontend utiliza la API:

```text
http://localhost:3000
```

Los servicios principales son:

```text
AuthService
UsersService
NotesService
DashboardService
```

El token JWT se almacena después del inicio de sesión y se utiliza para acceder a las rutas protegidas.

---

# Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

El frontend se sirve mediante Nginx.

La aplicación estará disponible en:

```text
http://localhost:4200
```

---

# Estructura principal

```text
src/app/
├── auth/
├── board/
├── dashboard/
├── users/
├── core/
│   ├── services/
│   ├── guards/
│   └── auth.interceptor.ts
└── layout/
```

---

# Flujo de uso

1. Abrir la aplicación.
2. Iniciar sesión.
3. Acceder al dashboard o tablero.
4. Crear y administrar notas.
5. Mover notas.
6. Guardar cambios.
7. Administrar usuarios si se utiliza una cuenta de administrador.
8. Cerrar sesión.
