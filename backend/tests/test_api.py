from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_livros():
    response = client.get("/livros")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_livro():
    response = client.post("/livros", json={
        "titulo": "Dom Casmurro",
        "autor": "Machado de Assis",
        "genero": "Romance",
        "ano": 1899
    })
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["titulo"] == "Dom Casmurro"

def test_update_livro():
    response_create = client.post("/livros", json={
        "titulo": "Livro para Atualizar",
        "autor": "Autor Teste",
        "genero": "Ficção",
        "ano": 2020
    })
    livro_id = response_create.json()["id"]

    response_update = client.put(f"/livros/{livro_id}", json={
        "titulo": "Livro Atualizado",
        "autor": "Autor Teste",
        "genero": "Ficção",
        "ano": 2026,
        "lido": False
    })
    assert response_update.status_code == 200
    assert response_update.json()["titulo"] == "Livro Atualizado"

def test_delete_livro():
    response_create = client.post("/livros", json={
        "titulo": "Livro para Deletar",
        "autor": "Autor Teste",
        "genero": "Terror",
        "ano": 2021
    })
    livro_id = response_create.json()["id"]

    response_delete = client.delete(f"/livros/{livro_id}")
    assert response_delete.status_code in [200, 204]

def test_livro_nao_encontrado():
    response = client.get("/livros/999999")
    assert response.status_code == 404

def test_resumo_livros():
    response = client.get("/livros/resumo")
    assert response.status_code == 200
    data = response.json()
    assert "total_livros" in data