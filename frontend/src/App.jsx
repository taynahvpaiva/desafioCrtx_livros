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
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1>Personal Library</h1>

      {resumo && (
        <p>
          Total Books: {resumo.total_livros} | Read Books:{" "}
          {resumo.livros_lidos} | Books to Read: {resumo.livros_pendentes}
        </p>
      )}

      {erro && <p style={{ color: "red" }}>Error: {erro}</p>}
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

      <button onClick={abrirNovo}>+ New Book</button>

      {mostrarForm && (
        <BookForm
          key={livroEditando ? livroEditando.id : "novo"}
          livroInicial={livroEditando}
          onSubmit={salvar}
          onCancel={fecharForm}
        />
      )}

      <ExtraFeature onSearch={setTermoPesquisa} />

      <h2>Book List</h2>

      {carregando && <p>Loading...</p>}
      {vazio && <p>No books found yet. Register your first book.</p>}

      {!carregando && !vazio && livrosFiltrados.length === 0 && (
        <p>No books match your search.</p>
      )}

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {livrosFiltrados.map((livro) => (
          <li
            key={livro.id}
            style={{
              padding: "10px",
              marginBottom: "8px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <strong>{livro.titulo}</strong> — {livro.autor} ({livro.ano}) |{" "}
            {livro.genero} | {livro.lido ? "Read" : "To Read"}{" "}
            <button onClick={() => abrirEdicao(livro)}>Edit</button>{" "}
            <button onClick={() => excluir(livro)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;