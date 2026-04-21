# Parcial 1 - Track 1: Identidad y Accesos 🚀

Este repositorio contiene la implementación completa del Track 1 (Identidad) del Parcial 1 de Programación IV. Se encuentra **100% Dockerizado**, lo que significa que no necesitás instalar Node.js, Python ni PostgreSQL en tu máquina para correr el proyecto.

---

## 🛠️ Requisitos Previos

Lo único que necesitás tener instalado en tu computadora es:
1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Asegurate de que el motor de Docker esté corriendo).
2. **VS Code** (o tu editor favorito).
3. La extensión **"SQLTools"** en VS Code (con su driver "SQLTools PostgreSQL/Redshift Driver") para ver la base de datos sin salir del editor.

---

## 🚀 Cómo levantar el proyecto completo

En la terminal (parado en la raíz de la carpeta del proyecto, donde está el `docker-compose.yml`), corré el siguiente comando:

```bash
docker compose up --build -d
```

**¿Qué hace este comando?**
- Descarga las imágenes de PostgreSQL, Python y Node.
- Levanta **3 contenedores**:
  1. `parcial1_postgres`: El motor de base de datos en el puerto **`5432`**.
  2. `parcial1_backend`: La API con FastAPI en el puerto **`8000`** conectada a la DB.
  3. `parcial1_frontend`: La app en React/Vite en el puerto **`5173`** conectada al backend.

### 🔗 Accesos Directos (Una vez levantado)
- **Frontend (Web App):** [http://localhost:5173](http://localhost:5173)
- **Backend (Documentación Swagger API):** [http://localhost:8000/docs](http://localhost:8000/docs)

### Ejecutar tests que requieren Postgres

Algunos tests avanzados del Track 4 requieren una instancia de Postgres en Docker. Para correrlos:

1. Levantá la DB y el backend (en otra terminal podés dejar corriendo solo la DB si preferís):

```bash
docker compose up -d db
```

2. Asegurate que la variable de entorno DATABASE_URL apunte a la instancia del contenedor (docker-compose.yml ya configura la API para usar `postgresql://postgres:postgres@db:5432/parcial1_db`).

3. Luego ejecutá los tests marcados para Postgres en tu entorno local:

```bash
pytest -q tests/test_pedidos_postgres.py
```

Si preferís no usar Docker, podés ajustar DATABASE_URL para apuntar a tu Postgres local.

---

## 💾 ¿Cómo conectarme a la Base de Datos para el video?

Para mostrar las consultas SQL (SELECT, INSERT, etc.) al profesor en tu video demostrativo usando la extensión **SQLTools** de VS Code:

1. Abrí el panel lateral de SQLTools en VS Code.
2. Hacé clic en **Add New Connection** y elegí el ícono del elefante (PostgreSQL).
3. Completá **EXACTAMENTE** con estos datos:
   - **Connection name***: `Parcial 1 - DB Local`
   - **Connection group**: *(Dejalo vacío o poné UTN)*
   - **Connect using***: `Server and Port`
   - **Server Address***: `localhost` o `127.0.0.1` *(El puerto se expone desde Docker hacia tu compu)*
   - **Port***: `5432`
   - **Database***: `parcial1_db`
   - **Username***: `postgres`
   - **Use password**: Cambiá a `Save as plaintext in settings` y escribí la contraseña `postgres`.

4. Dale clic al botón azul **"TEST CONNECTION"**. Si todo está bien, te mostrará un cartel verde. Luego hacé clic en **"SAVE CONNECTION"**.
5. Desde el panel izquierdo de SQLTools, hacé clic derecho en "Parcial 1 - DB Local" -> **Connect**. ¡Listo! Ya podés tirar las consultas en pantalla.

---

## 🛑 Cómo detener el proyecto

Cuando termines de grabar o de trabajar, bajá todo el entorno con:

```bash
docker compose down
```
> **Nota:** La base de datos persistirá en tu máquina gracias al volumen `postgres_data`. Si alguna vez querés **borrar todos los datos y empezar de cero**, tirá `docker compose down -v`.
