# Personal Library (Gerenciador de Livros)

Aplicação full stack para cadastrar e acompanhar uma biblioteca pessoal: API REST em Python (FastAPI + SQLite) e interface em React (Vite).

Projeto Integrador CoortechX.

## Funcionalidades

- Cadastrar, listar, editar e excluir livros (CRUD)
- Buscar um livro por id
- Filtrar livros por gênero e autor
- Resumo da biblioteca (total, lidos e a ler)
- Busca por título ou autor na interface
- Mensagens de carregamento, sucesso, erro e lista vazia

## Tecnologias

- **Backend:** Python 3, FastAPI, SQLAlchemy, SQLite, Uvicorn
- **Frontend:** React, Vite
- **Testes e qualidade:** pytest, httpx, Ruff

## Pré-requisitos

- Python 3.10 ou superior
- Node.js e npm
- Git

## Como rodar o projeto

O backend e o frontend precisam rodar ao mesmo tempo, cada um em um terminal.

### 1. Clonar o repositório

```bash
git clone https://github.com/taynahvpaiva/desafioCrtx_livros.git
cd desafioCrtx_livros
```

### 2. Backend (Terminal 1)

```bash
cd backend
python -m venv venv
```

Ativar o ambiente virtual:

- Windows (PowerShell): `venv\Scripts\activate`
- Linux/macOS: `source venv/bin/activate`

Instalar as dependências e iniciar a API:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API fica em http://127.0.0.1:8000 e a documentação (Swagger) em http://127.0.0.1:8000/docs.

O banco SQLite (`livros.db`) é criado automaticamente na primeira execução.

### 3. Frontend (Terminal 2)

A partir da raiz do projeto:

```bash
cd frontend
npm install
```

Criar o arquivo `.env` a partir do exemplo:

- Windows (PowerShell): `copy .env.example .env`
- Linux/macOS: `cp .env.example .env`

Iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse a aplicação em http://localhost:5173/.

A URL da API fica na variável `VITE_API_URL` do `.env` (padrão: `http://127.0.0.1:8000`).

## Como rodar os testes

Com o ambiente virtual do backend ativo:

```bash
cd backend
python -m pytest
```

## Qualidade de código (lint)

```bash
cd backend
python -m ruff check .
```

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/livros/` | Lista os livros. Aceita `?genero=` e `?autor=` (busca parcial) |
| POST | `/livros/` | Cadastra um livro |
| GET | `/livros/resumo` | Resumo: `total_livros`, `livros_lidos`, `livros_pendentes`, `percentual_concluido` |
| GET | `/livros/{id}` | Busca um livro por id |
| PUT | `/livros/{id}` | Atualiza um livro |
| DELETE | `/livros/{id}` | Exclui um livro |

Campos do livro: `titulo`, `autor`, `genero`, `ano` e `lido`.

## Estrutura do projeto

```
desafioCrtx_livros/
├── backend/        # API, banco e testes
│   ├── app/        # main, routers, models, schemas, database
│   └── tests/      # testes automatizados
├── frontend/       # interface React + Vite
│   └── src/        # components, hooks, services, styles, utils
├── docs/           # arquitetura e wireframes
└── README.md
```

## Prototipação

Protótipo no Figma:
https://www.figma.com/design/ZHcSRX4VyhmgUqnN4452JK/Sem-t%C3%ADtulo?node-id=2-534&t=HjfnUJPkUnEEjF9d-1

## Equipe

Projeto desenvolvido em equipe por Taynah, Sofia e Letícia.
