
from app.database import SessionLocal
from app.models.livro import Livro
from app.schemas.livro import LivroCreate, LivroResponse, LivroUpdate
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

router = APIRouter(prefix="/livros", tags=["Livros"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def obter_livro_ou_erro(id: int, db: Session) -> Livro:
    livro = db.query(Livro).filter(Livro.id == id).first()

    if livro is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livro não encontrado",
        )

    return livro


@router.post("/", response_model=LivroResponse, status_code=status.HTTP_201_CREATED)
def criar_livro(livro: LivroCreate, db: Session = Depends(get_db)):
    novo_livro = Livro(
        titulo=livro.titulo,
        autor=livro.autor,
        genero=livro.genero,
        ano=livro.ano,
        lido=livro.lido,
    )

    try:
        db.add(novo_livro)
        db.commit()
        db.refresh(novo_livro)
        return novo_livro
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao cadastrar livro",
        ) from None


@router.put("/{id}", response_model=LivroResponse)
def atualizar_livro(
    id: int,
    livro: LivroUpdate,
    db: Session = Depends(get_db),
):
    livro_db = obter_livro_ou_erro(id, db)

    livro_db.titulo = livro.titulo
    livro_db.autor = livro.autor
    livro_db.genero = livro.genero
    livro_db.ano = livro.ano
    livro_db.lido = livro.lido

    try:
        db.commit()
        db.refresh(livro_db)
        return livro_db
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar livro",
        ) from None


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
    livro_db = obter_livro_ou_erro(id, db)

    try:
        db.delete(livro_db)
        db.commit()
        return {"mensagem": "Livro excluído com sucesso"}
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao excluir livro",
        ) from None


@router.get("/resumo")
def obter_resumo_livros(db: Session = Depends(get_db)):
    total_livros = db.query(Livro).count()
    livros_lidos = db.query(Livro).filter(Livro.lido).count()
    livros_pendentes = total_livros - livros_lidos

    percentual_lido = (
        round(livros_lidos / total_livros * 100, 2)
        if total_livros > 0
        else 0.0
    )

    return {
        "total_livros": total_livros,
        "livros_lidos": livros_lidos,
        "livros_pendentes": livros_pendentes,
        "percentual_concluido": f"{percentual_lido}%",
    }


@router.get("/{id}", response_model=LivroResponse)
def buscar_livro(id: int, db: Session = Depends(get_db)):
    return obter_livro_ou_erro(id, db)
