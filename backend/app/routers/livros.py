from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.livro import Livro
from app.schemas.livro import LivroCreate,LivroUpdate,LivroResponse

router = APIRouter(prefix="/livros",tags=["Livros"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def criar_livro(livro: LivroCreate,db: Session = Depends(get_db)):
    novo_livro = Livro(
        titulo=livro.titulo,
        autor=livro.autor,
        genero=livro.genero,
        ano=livro.ano,
        lido=livro.lido
    )

    db.add(novo_livro)
    db.commit()
    db.refresh(novo_livro)

    return novo_livro

@router.put("/{id}")
def atualizar_livro(id: int,livro: LivroUpdate,db: Session = Depends(get_db)):
    livro_db = db.query(Livro).filter(Livro.id == id).first()

    if livro_db is None:
        raise HTTPException(status_code=404,detail="Livro não encontrado")

    livro_db.titulo = livro.titulo
    livro_db.autor = livro.autor
    livro_db.genero = livro.genero
    livro_db.ano = livro.ano
    livro_db.lido = livro.lido

    db.commit()
    db.refresh(livro_db)

    return livro_db

@router.get("/", response_model=list[LivroResponse])
def listar_livros(
    genero: str | None = None,
    autor: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Livro)

    if genero:
        query = query.filter(Livro.genero.ilike(f"%{genero}%"))

    if autor:
        query = query.filter(Livro.autor.ilike(f"%{autor}%"))

    return query.all()

@router.delete("/{id}")
def excluir_livro(id: int, db: Session = Depends(get_db)):
    livro_db = db.query(Livro).filter(Livro.id == id).first()

    if livro_db is None:
        raise HTTPException(status_code=404, detail="Livro não encontrado")

    db.delete(livro_db)
    db.commit()

    return {"mensagem": "Livro excluído com sucesso"}

@router.get("/{id}", response_model=LivroResponse)
def buscar_livro(id: int, db: Session = Depends(get_db)):
    livro_db = db.query(Livro).filter(Livro.id == id).first()

    if livro_db is None:
        raise HTTPException(status_code=404, detail="Livro não encontrado")

    return livro_db