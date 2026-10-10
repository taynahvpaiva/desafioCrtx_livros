import { useCallback, useEffect, useState } from "react";
import {
  listarLivros,
  criarLivro,
  atualizarLivro,
  excluirLivro,
  obterResumo,
} from "../services/livrosService";

export function useLivros(filtros = {}) {
  const [livros, setLivros] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const { genero, autor } = filtros;

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const [listaLivros, dadosResumo] = await Promise.all([
        listarLivros({ genero, autor }),
        obterResumo(),
      ]);
      setLivros(listaLivros);
      setResumo(dadosResumo);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [genero, autor]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function executar(acao, mensagemSucesso) {
    setErro("");
    setSucesso("");
    try {
      await acao();
      setSucesso(mensagemSucesso);
      await carregar();
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  }

  const adicionar = (livro) =>
    executar(() => criarLivro(livro), "Book saved successfully.");

  const editar = (id, livro) =>
    executar(() => atualizarLivro(id, livro), "Book updated successfully.");

  const remover = (id) =>
    executar(() => excluirLivro(id), "Book removed successfully.");

  return {
    livros,
    resumo,
    carregando,
    erro,
    sucesso,
    vazio: !carregando && !erro && livros.length === 0,
    adicionar,
    editar,
    remover,
    recarregar: carregar,
  };
}