from fastapi import FastAPI
from app.database import Base,engine
from app.models.livro import Livro
from app.routers.livros import router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(router)

@app.get("/")
def inicio():
    return {"mensagem":"API de livros funcionando"}