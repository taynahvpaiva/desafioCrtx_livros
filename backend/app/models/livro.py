from sqlalchemy import Column,Integer,String,Boolean
from app.database import Base

class Livro(Base):
    __tablename__ = "livros"

    id = Column(Integer,primary_key=True,index=True)
    titulo = Column(String,nullable=False)
    autor = Column(String,nullable=False)
    genero = Column(String,nullable=False)
    ano = Column(Integer,nullable=False)
    lido = Column(Boolean,default=False)