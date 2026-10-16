import { useState } from "react";
import { validateBook } from "../utils/validation";

const VAZIO = { titulo: "", autor: "", genero: "", ano: "", lido: false };

export function BookForm({ livroInicial = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(livroInicial ?? VAZIO);
  const [erros, setErros] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validateBook(form);
    if (!String(form.genero).trim()) {
      novosErros.genero = "Genre is required.";
    }
    if (!form.ano && !novosErros.ano) {
      novosErros.ano = "Publication year is required.";
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    await onSubmit({
      titulo: form.titulo.trim(),
      autor: form.autor.trim(),
      genero: String(form.genero).trim(),
      ano: Number(form.ano),
      lido: form.lido,
    });
  }

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <h3>{livroInicial ? "Edit Book" : "Add New Book"}</h3>

        <div className="field">
          <label htmlFor="titulo">Title</label>
          <input
            id="titulo"
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
          />
          {erros.titulo && <p className="field-error">{erros.titulo}</p>}
        </div>

        <div className="field">
          <label htmlFor="autor">Author</label>
          <input
            id="autor"
            type="text"
            name="autor"
            value={form.autor}
            onChange={handleChange}
          />
          {erros.autor && <p className="field-error">{erros.autor}</p>}
        </div>

        <div className="field">
          <label htmlFor="ano">Publication Year</label>
          <input
            id="ano"
            type="number"
            name="ano"
            value={form.ano}
            onChange={handleChange}
          />
          {erros.ano && <p className="field-error">{erros.ano}</p>}
        </div>

        <div className="field">
          <label htmlFor="genero">Genre</label>
          <input
            id="genero"
            type="text"
            name="genero"
            value={form.genero}
            onChange={handleChange}
          />
          {erros.genero && <p className="field-error">{erros.genero}</p>}
        </div>

        <div className="field">
          <label>
            <input
              name="lido"
              type="checkbox"
              checked={form.lido}
              onChange={handleChange}
            />{" "}
            Have you read it?
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Book
          </button>
        </div>
      </form>
    </div>
  );
}