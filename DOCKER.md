# Docker: levantar PostgreSQL

Pasos rápidos:

1. Copiar el archivo de ejemplo y ajustar valores si es necesario:

```bash
cp .env.example .env
# (editar .env con tu editor preferido)
```

2. Levantar el servicio de PostgreSQL:

```bash
docker-compose up -d
```

3. Ver logs del servicio:

```bash
docker-compose logs -f db
```

4. Parar y eliminar contenedores/volumenes (opcional):

```bash
docker-compose down -v
```

Notas:
- Si ejecutás la aplicación localmente (no en Docker), dejá `DB_HOST=localhost` y el puerto `5432` mapeado funcionará.
- Si ejecutás la aplicación también dentro de Docker (en otro servicio dentro del mismo `docker-compose`), pon `DB_HOST=db` en la configuración para que use el hostname del servicio.
- Las credenciales por defecto están en `.env.example`. Cámbialas en producción.
