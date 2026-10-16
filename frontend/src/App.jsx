import { useState } from "react";
import { ExtraFeature } from "./components/ExtraFeature";
import { BookForm } from "./components/BookForm";
import { useLivros } from "./hooks/useLivros";

function App() {
  const {
    livros,
    resumo,
    carregando,
    erro,
    sucesso,
    vazio,
    adicionar,
    editar,
    remover,
  } = useLivros();

  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [livroEditando, setLivroEditando] = useState(null);

  const livrosFiltrados = livros.filter((livro) => {
    const termo = termoPesquisa.toLowerCase();
    return (
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor.toLowerCase().includes(termo)
    );
  });

  function abrirNovo() {
    setLivroEditando(null);
    setMostrarForm(true);
  }

  function abrirEdicao(livro) {
    setLivroEditando(livro);
    setMostrarForm(true);
  }

  function fecharForm() {
    setMostrarForm(false);
    setLivroEditando(null);
  }

  async function salvar(dados) {
    const ok = livroEditando
      ? await editar(livroEditando.id, dados)
      : await adicionar(dados);
    if (ok) fecharForm();
  }

  async function excluir(livro) {
    if (window.confirm(`Remove "${livro.titulo}"?`)) {
      await remover(livro.id);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Personal Library</h1>
        <button className="btn btn-primary" onClick={abrirNovo}>
          + New Book
        </button>
      </header>

      {resumo && (
        <section className="metrics">
          <div className="metric-card">
            <strong>{resumo.total_livros}</strong>
            Total Books
          </div>
          <div className="metric-card">
            <strong>{resumo.livros_lidos}</strong>
            Read Books
          </div>
          <div className="metric-card">
            <strong>{resumo.livros_pendentes}</strong>
            Books to Read
          </div>
        </section>
      )}

      {erro && <div className="message message-error">{erro}</div>}
      {sucesso && <div className="message message-success">{sucesso}</div>}

      <ExtraFeature onSearch={setTermoPesquisa} />

      {carregando && <p>Loading...</p>}

      {vazio && (
        <div className="empty">
          <p>No books found yet. Register your first book.</p>
        </div>
      )}

      {!carregando && !vazio && livrosFiltrados.length === 0 && (
        <div className="empty">
          <p>No books match your search.</p>
        </div>
      )}

      <ul className="books-grid">
        {livrosFiltrados.map((livro) => (
          <li key={livro.id} className="book-card">
            <h3>{livro.titulo}</h3>
            <p>{livro.autor}</p>
            <p>
              {livro.genero} · {livro.ano}
            </p>
            <span
              className={`badge ${livro.lido ? "badge-read" : "badge-toread"}`}
            >
              {livro.lido ? "Read" : "To Read"}
            </span>
            <div className="card-actions">
              <button
                className="btn btn-secondary"
                onClick={() => abrirEdicao(livro)}
              >
                ✏️ Edit
              </button>
              <button className="btn btn-remove" onClick={() => excluir(livro)}>
                🗑️ Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {mostrarForm && (
        <BookForm
          key={livroEditando ? livroEditando.id : "novo"}
          livroInicial={livroEditando}
          onSubmit={salvar}
          onCancel={fecharForm}
        />
      )}
    </div>
  );
}

export default App;