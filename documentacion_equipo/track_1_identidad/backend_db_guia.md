# Guía de Backend: Track 1 - Identidad

## Modelos (SQLModel)
- **User**:
  ```python
  from sqlmodel import Field, SQLModel, Relationship
  from typing import Annotated, Optional
  from fastapi import Query, Path

  class UserBase(SQLModel):
      email: str = Field(index=True, unique=True)
      full_name: str
      is_active: bool = True
  
  class User(UserBase, table=True):
      id: Optional[int] = Field(default=None, primary_key=True)
      hashed_password: str
      orders: list["Order"] = Relationship(back_populates="user")
  ```

## Endpoints (FastAPI)
Estructura de módulos: `app/api/routes/users.py`, `app/api/routes/auth.py`

- `POST /auth/login`: Autenticación y generación de token JWT.
- `GET /users/`: Lista de usuarios (paginación con `Query(default=0)`, `limit: int = Query(default=100)`).
- `GET /users/{user_id}`: Detalle de usuario usando `Path(title="The ID of the user to get")`.
- `POST /users/`: Crear usuario (validaciones con Pydantic).
- `PUT /users/{user_id}`: Actualizar usuario.
- `DELETE /users/{user_id}`: Desactivar/eliminar usuario.
