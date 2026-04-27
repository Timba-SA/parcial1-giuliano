# Parcial 1 - Catálogo de Productos

Breve guía para levantar el proyecto localmente y con Docker (PostgreSQL).

Requisitos previos
- Python 3.10+ (recomendado)
- Docker & Docker Compose (para la base de datos)

Pasos — Opción A: Ejecutar la app localmente y usar la base de datos en Docker

1. Copiar el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
# editar .env si querés cambiar credenciales
```

2. Levantar PostgreSQL via Docker Compose (desde la raíz del repo):

```bash
docker-compose up -d
```

3. Crear y activar un entorno virtual, e instalar dependencias:

Windows (PowerShell):
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Linux / macOS:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

4. Asegurate que en `.env` `DB_HOST` esté `localhost` (porque la app corre localmente y Docker mapea el puerto 5432).

5. Ejecutar la app con Uvicorn (desde la raíz del repo):

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

6. Verificar health-check:

Abrir `http://127.0.0.1:8000/` — debe devolver `{ "status": "ok" }`.

Notas:
- Al iniciar, la app ejecuta la función `create_db_and_tables()` y crea las tablas necesarias automáticamente.
- Si necesitás cambiar credenciales o usar un `DATABASE_URL` completo, podés descomentar/añadir `DATABASE_URL` en `.env`.
- Si te aparece un error de SQLAlchemy al arrancar, asegurate de estar usando el entorno virtual del proyecto y no el Python global de Conda.

Pasos — Opción B: Ejecutar app y base de datos dentro de Docker (opcional)

Actualmente `docker-compose.yml` solo define el servicio `db` (Postgres). Si querés que incluya un servicio `web` para la app y ejecutar todo con `docker-compose up`, avisame y lo agrego (recomendado para replicar el entorno de producción).

Comandos útiles
- Ver logs del contenedor DB:

```bash
docker-compose logs -f db
```

- Parar y eliminar contenedores y volúmenes:

```bash
docker-compose down -v
```

Contacto
- Si querés, agrego también un servicio `web` en `docker-compose.yml` y un Dockerfile para la app para poder levantar todo con un solo comando.
