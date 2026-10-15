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
    <form onSubmit={handleSubmit}>
      <h3>{livroInicial ? "Edit Book" : "Add New Book"}</h3>

      <div>
        <label>
          Title
          <input name="titulo" value={form.titulo} onChange={handleChange} />
        </label>
        {erros.titulo && <p style={{ color: "red" }}>{erros.titulo}</p>}
      </div>

      <div>
        <label>
          Author
          <input name="autor" value={form.autor} onChange={handleChange} />
        </label>
        {erros.autor && <p style={{ color: "red" }}>{erros.autor}</p>}
      </div>

      <div>
        <label>
          Year
          <input
            name="ano"
            type="number"
            value={form.ano}
            onChange={handleChange}
          />
        </label>
        {erros.ano && <p style={{ color: "red" }}>{erros.ano}</p>}
      </div>

      <div>
        <label>
          Genre
          <input name="genero" value={form.genero} onChange={handleChange} />
        </label>
        {erros.genero && <p style={{ color: "red" }}>{erros.genero}</p>}
      </div>

      <div>
        <label>
          <input
            name="lido"
            type="checkbox"
            checked={form.lido}
            onChange={handleChange}
          />
          Have you read it?
        </label>
      </div>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit">Save Book</button>
    </form>
  );
}