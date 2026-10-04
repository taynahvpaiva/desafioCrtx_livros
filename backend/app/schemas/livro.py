from pydantic import BaseModel

class LivroCreate(BaseModel):
    titulo: str
    autor: str
    genero: str
    ano: int
    lido: bool = False

class LivroUpdate(BaseModel):
    titulo: str
    autor: str
    genero: str
    ano: int
    lido: bool