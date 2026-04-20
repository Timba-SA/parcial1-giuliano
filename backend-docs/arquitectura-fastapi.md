# Documentación de Estructura y Tecnologías: FastAPI Backend

Esta documentación fue generada utilizando los principios de OpenSpec para capturar la estructura arquitectónica y las tecnologías del backend en `@fastapi-productos/`. Su propósito es servir como plantilla y guía técnica para inicializar y escalar nuevos proyectos bajo la misma arquitectura (Modular/Domain-Driven).

## Tecnologías Principales (Tech Stack)

El proyecto se basa en un stack moderno, asíncrono y ligero para Python:

- **Framework Web**: `FastAPI` (v0.115.0) - Para la creación de la API de alto rendimiento con validación automática y documentación interactiva (Swagger/ReDoc).
- **Servidor ASGI**: `Uvicorn` (v0.30.6) - Servidor web de alto rendimiento necesario para correr aplicaciones asíncronas de FastAPI.
- **Validación y Serialización**: `Pydantic` (v2.9.2) - Utilizado para la validación de datos (Schemas/DTOs) y tipado estricto.

## Estructura de Carpetas y Arquitectura

El proyecto adopta una **Arquitectura Modular (Domain-Driven)** donde el código se agrupa por entidad/dominio de negocio (ej. `producto`, `categoria`), en lugar de separar por capa técnica (controladores, modelos, servicios separados globalmente).

### Árbol de Directorios Principal

```text
fastapi-productos/
├── app/
│   ├── core/                   # Configuraciones globales, base de datos, utilidades y excepciones
│   ├── categoria/              # Dominio: Categorías
│   ├── producto/               # Dominio: Productos
│   ├── producto_categoria/     # Dominio: Relaciones (si aplica)
│   ├── main.py                 # Punto de entrada de la aplicación y configuración de FastAPI
│   └── __init__.py
├── requirements.txt            # Dependencias del proyecto
├── .gitignore
├── README.md
└── rest-client.http            # Archivo para pruebas de API locales (extensión REST Client)
```

### Estructura Interna por Dominio (Ejemplo: `producto/`)

Cada módulo o dominio sigue un patrón de diseño en capas para separar responsabilidades (Separation of Concerns):

```text
app/producto/
├── model.py      # Entidades de la Base de Datos (ej. SQLAlchemy/SQLModel Models)
├── schema.py     # DTOs y validación de entrada/salida (Pydantic Models)
├── service.py    # Lógica de negocio, reglas y operaciones de CRUD (Use Cases)
├── router.py     # Endpoints y Controladores de API (FastAPI APIRouters)
└── __init__.py
```

#### Responsabilidades por Archivo:

1. **`router.py` (Capa de Presentación / API)**: Define las rutas HTTP (GET, POST, etc.). Recibe las peticiones, llama al servicio correspondiente, y devuelve las respuestas. No debe contener lógica de negocio profunda.
2. **`schema.py` (Capa de Validación)**: Define las estructuras de datos esperadas usando Pydantic. Se encarga de validar los datos que entran (requests) y serializar los que salen (responses).
3. **`service.py` (Capa de Negocio)**: Contiene toda la lógica central de la aplicación. Es responsable de hacer validaciones de negocio y comunicarse con la capa de datos/repositorio.
4. **`model.py` (Capa de Datos)**: Define la estructura de las tablas en la base de datos (Entidades).

## Guía para Inicializar un Nuevo Proyecto

Para crear un nuevo proyecto basado en esta estructura, sigue estos pasos:

1. **Copiar Estructura Base**:
   Crea la carpeta `app/` con los submódulos básicos (al menos `core/` y tu primer dominio).
2. **Instalar Dependencias**:
   Crea el `requirements.txt` con `fastapi`, `uvicorn`, y `pydantic`. Ejecuta `pip install -r requirements.txt`.
3. **Punto de Entrada**:
   Crea `app/main.py` e inicializa `FastAPI()`. Asegúrate de importar e incluir los routers de tus dominios (ej. `app.include_router(producto.router)`).
4. **Desarrollar por Dominio**:
   Al agregar una nueva entidad al sistema (ej. `Usuario`), crea una carpeta `app/usuario/` y dentro sus respectivos `model.py`, `schema.py`, `service.py`, y `router.py`.

## Ventajas de esta Arquitectura
- **Escalabilidad**: Fácil de agregar nuevos módulos sin afectar a los demás.
- **Mantenibilidad**: La separación de responsabilidades hace que los tests y la corrección de errores sean más localizados.
- **Microservicios Ready**: Si un módulo crece demasiado, es más fácil separarlo en un microservicio independiente.