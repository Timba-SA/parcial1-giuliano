from sqlmodel import create_engine, SQLModel, Session
import os

# Normalmente usamos pydantic_settings cargandolo en .env
# Pero acá lo dejamos hardcodeado para simplificar el ejemplo. 
# En producción, usar variables de entorno o un sistema de configuración más robusto.
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/parcial1_db")

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
