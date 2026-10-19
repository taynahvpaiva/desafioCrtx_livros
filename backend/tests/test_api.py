
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_get_livros():
    response = client.get("/livros")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_livro():
    response = client.post(
        "/livros",
        json={
            "titulo": "Dom Casmurro",
            "autor": "Machado de Assis",
            "genero": "Romance",
            "ano": 1899,
        },
    )

    assert response.status_code in [200, 201]

    data = response.json()
    assert data["titulo"] == "Dom Casmurro"


def test_update_livro():
    response_create = client.post(
        "/livros",
        json={
            "titulo": "Livro para Atualizar",
            "autor": "Autor Teste",
            "genero": "Ficção",
            "ano": 2020,
        },
    )

    assert response_create.status_code in [200, 201]
    livro_id = response_create.json()["id"]

    response_update = client.put(
        f"/livros/{livro_id}",
        json={
            "titulo": "Livro Atualizado",
            "autor": "Autor Teste",
            "genero": "Ficção",
            "ano": 2026,
            "lido": False,
        },
    )

    assert response_update.status_code == 200
    assert response_update.json()["titulo"] == "Livro Atualizado"


def test_delete_livro():
    response_create = client.post(
        "/livros",
        json={
            "titulo": "Livro para Deletar",
            "autor": "Autor Teste",
            "genero": "Terror",
            "ano": 2021,
        },
    )

    assert response_create.status_code in [200, 201]
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


def test_atualizar_livro_nao_encontrado():
    response = client.put(
        "/livros/999999",
        json={
            "titulo": "Livro Inexistente",
            "autor": "Autor Teste",
            "genero": "Ficção",
            "ano": 2026,
            "lido": False,
        },
    )

    assert response.status_code == 404


def test_excluir_livro_nao_encontrado():
    response = client.delete("/livros/999999")

    assert response.status_code == 404


def test_criar_livro_com_dados_invalidos():
    response = client.post(
        "/livros",
        json={
            "titulo": "Livro Inválido",
            "autor": "Autor Teste",
            "genero": "Ficção",
            "ano": "ano inválido",
        },
    )

    assert response.status_code == 422


def test_criar_livro_sem_campo_obrigatorio():
    response = client.post(
        "/livros",
        json={
            "titulo": "Livro Incompleto",
        },
    )

    assert response.status_code == 422


def test_atualizacao_fica_salva():
    response_create = client.post(
        "/livros",
        json={
            "titulo": "Livro Original",
            "autor": "Autor Teste",
            "genero": "Ficção",
            "ano": 2020,
        },
    )

    assert response_create.status_code in [200, 201]
    livro_id = response_create.json()["id"]

    response_update = client.put(
        f"/livros/{livro_id}",
        json={
            "titulo": "Livro Persistido",
            "autor": "Autor Teste",
            "genero": "Ficção",
            "ano": 2026,
            "lido": True,
        },
    )

    assert response_update.status_code == 200

    response_get = client.get(f"/livros/{livro_id}")

    assert response_get.status_code == 200
    assert response_get.json()["titulo"] == "Livro Persistido"
    assert response_get.json()["lido"] is True


def test_livro_excluido_nao_pode_ser_buscado():
    response_create = client.post(
        "/livros",
        json={
            "titulo": "Livro Excluído",
            "autor": "Autor Teste",
            "genero": "Ficção",
            "ano": 2022,
        },
    )

    assert response_create.status_code in [200, 201]
    livro_id = response_create.json()["id"]

    response_delete = client.delete(f"/livros/{livro_id}")

    assert response_delete.status_code in [200, 204]

    response_get = client.get(f"/livros/{livro_id}")

    assert response_get.status_code == 404
    assert response_get.json()["detail"] == "Livro não encontrado"
