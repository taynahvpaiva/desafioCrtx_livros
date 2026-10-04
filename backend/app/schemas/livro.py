from pydantic import BaseModel, ConfigDict

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

class LivroResponse(BaseModel):
    id: int
    titulo: str
    autor: str
    genero: str
    ano: int
    lido: bool

    model_config = ConfigDict(from_attributes=True)