import { request } from "./api";

export function listarLivros({ genero, autor } = {}) {
  const params = new URLSearchParams();

  if (genero) params.append("genero", genero);
  if (autor) params.append("autor", autor);

  const query = params.toString();
  return request(`/livros/${query ? `?${query}` : ""}`);
}

export function buscarLivro(id) {
  return request(`/livros/${id}`);
}

export function criarLivro(livro) {
  return request("/livros/", {
    method: "POST",
    body: JSON.stringify(livro),
  });
}

export function atualizarLivro(id, livro) {
  return request(`/livros/${id}`, {
    method: "PUT",
    body: JSON.stringify(livro),
  });
}

export function excluirLivro(id) {
  return request(`/livros/${id}`, {
    method: "DELETE",
  });
}

export function obterResumo() {
  return request("/livros/resumo");
}