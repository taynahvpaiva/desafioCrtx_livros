# Arquitetura

Resumo de como backend, frontend e banco se comunicam e das principais decisões do projeto.

## Visão geral

```
Navegador (React + Vite, porta 5173)
        |
        |  HTTP + JSON (fetch)
        v
API REST (FastAPI + Uvicorn, porta 8000)
        |
        |  SQLAlchemy (ORM)
        v
Banco SQLite (backend/livros.db)
```

O frontend nunca acessa o banco. Toda leitura e escrita passa pela API, que valida os dados antes de gravar.

## Backend (`backend/`)

| Arquivo / pasta | Responsabilidade |
|---|---|
| `app/main.py` | Inicia a aplicação, cria as tabelas, inclui o router e configura o CORS |
| `app/database.py` | Conexão com o SQLite e sessão do banco |
| `app/models/livro.py` | Tabela `livros` (modelo SQLAlchemy) |
| `app/schemas/livro.py` | Modelos Pydantic de entrada (`LivroCreate`, `LivroUpdate`) e saída (`LivroResponse`) |
| `app/routers/livros.py` | Endpoints de `/livros` |
| `tests/test_api.py` | Testes automatizados (pytest) |

Entidade principal: **Livro** (`id`, `titulo`, `autor`, `genero`, `ano`, `lido`).

### Endpoints

- `GET /livros/` (aceita `?genero=` e `?autor=`)
- `POST /livros/`
- `GET /livros/resumo`
- `GET /livros/{id}`
- `PUT /livros/{id}`
- `DELETE /livros/{id}`

A rota `/livros/resumo` é declarada antes de `/livros/{id}` para que o FastAPI não interprete "resumo" como um id.

## Frontend (`frontend/src/`)

| Pasta / arquivo | Responsabilidade |
|---|---|
| `services/api.js` | Centraliza o `fetch`, lê `VITE_API_URL` e converte erros em mensagens compreensíveis |
| `services/livrosService.js` | Uma função por endpoint (listar, buscar, criar, editar, excluir, resumo) |
| `hooks/useLivros.js` | Guarda a lista e os estados (carregando, erro, sucesso, vazio) e expõe `adicionar`, `editar` e `remover` |
| `components/` | `BookForm` (modal de cadastro e edição) e `ExtraFeature` (busca) |
| `utils/validation.js` | Validação dos campos do formulário |
| `styles/theme.css` | Cores, grid de cards, badges e modal, conforme o design |
| `App.jsx` | Monta a tela: resumo, busca, grid de livros e modal |

Fluxo de uma ação (exemplo: salvar um livro): `BookForm` valida os campos, chama `adicionar` do `useLivros`, que usa `criarLivro` em `livrosService`, que chama `request` em `api.js`, que envia o `POST` para a API. Ao terminar, o hook recarrega a lista e o resumo.

## Decisões principais

- **FastAPI + SQLite:** combinação mais simples para o escopo (uma entidade, sete endpoints).
- **ORM (SQLAlchemy):** nenhuma consulta SQL é montada com texto vindo do usuário.
- **Validação nos dois lados:** o frontend valida para melhorar a experiência, e o backend valida sempre (Pydantic).
- **Tratamento de erros:** a API devolve códigos HTTP coerentes (404 para livro inexistente, 422 para dados inválidos) e mensagens genéricas para falhas do banco, sem expor detalhes internos. As operações de escrita fazem `rollback()` em caso de falha.
- **CORS restrito:** apenas `http://localhost:5173`, com os métodos GET, POST, PUT e DELETE e o header `Content-Type`.
- **URL da API configurável:** `VITE_API_URL` no `.env` do frontend, sem endereços espalhados pelo código. O backend não exige variáveis de ambiente.
- **Status do livro simplificado:** a API tem apenas `lido` (verdadeiro ou falso), então a interface mostra os badges **Read** e **To Read**. O estado "Currently Reading" do protótipo não foi implementado.
- **Busca no navegador:** a busca por título ou autor filtra a lista já carregada. O filtro por `genero` e `autor` na API está disponível, mas a interface não o usa.
- **Camada de serviços e hook no frontend:** os componentes cuidam da interface, e a comunicação HTTP fica em `services/`.

## Testes e qualidade

- `python -m pytest` (na pasta `backend`): 12 testes cobrindo cadastro, listagem, atualização, exclusão, resumo, livro inexistente, dados inválidos e persistência.
- `python -m ruff check .` (na pasta `backend`): lint do código Python.
- O frontend não tem testes automatizados; o fluxo principal foi validado manualmente (criar, editar, excluir, buscar).