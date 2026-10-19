from app.database import Base
from sqlalchemy import Boolean, Column, Integer, String


class Livro(Base):
    __tablename__ = "livros"

    id = Column(Integer,primary_key=True,index=True)
    titulo = Column(String,nullable=False)
    autor = Column(String,nullable=False)
    genero = Column(String,nullable=False)
    ano = Column(Integer,nullable=False)
    lido = Column(Boolean,default=False)