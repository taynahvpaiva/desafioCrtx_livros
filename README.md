# Gerenciador de Livros - API REST

## Tecnologias
- Python 3
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

## Como rodar o projeto

1. Clone o repositório e entre na pasta do backend:
   git clone https://github.com/taynahvpaiva/desafioCrtx_livros.git
   cd desafioCrtx_livros/backend

2. Crie e ative o ambiente virtual:
   python3 -m venv venv
   source venv/bin/activate

3. Instale as dependências:
   pip install -r requirements.txt

4. Inicie o servidor:
   python3 -m uvicorn app.main:app --reload

Acesse a documentação no navegador: http://127.0.0.1:8000/docs

## Endpoints

- POST /livros/ - Cadastra um livro
- GET /livros/ - Lista os livros
- GET /livros/{id} - Busca livro por ID
- PUT /livros/{id} - Atualiza um livro
- DELETE /livros/{id} - Remove um livro
- GET /livros/resumo - Exibe o resumo e estatísticas do acervo

##Prototipação no figma: https://www.figma.com/design/ZHcSRX4VyhmgUqnN4452JK/Sem-t%C3%ADtulo?node-id=2-534&t=HjfnUJPkUnEEjF9d-1
