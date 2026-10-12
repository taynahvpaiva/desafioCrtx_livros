import React, { useState, useEffect } from 'react'
import { ExtraFeature } from './components/ExtraFeature'
import { request } from './services/api'

function App() {
  const [livros, setLivros] = useState([])
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function carregarLivros() {
      try {
        const dados = await request('/livros/')
        setLivros(dados)
        setErro(null)
      } catch (err) {
        setErro(err.message)
      }
    }
    carregarLivros()
  }, [])

  const handleSearch = (termo) => {
    setTermoPesquisa(termo)
  }

  const livrosFiltrados = livros.filter(livro => {
    const titulo = livro.titulo || livro.title || ''
    const autor = livro.autor || livro.author || ''
    const termo = termoPesquisa.toLowerCase()
    return titulo.toLowerCase().includes(termo) || autor.toLowerCase().includes(termo)
  })

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Gerenciador de Livros</h1>

      {erro && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px' }}>
          <strong>Erro:</strong> {erro}
        </div>
      )}
      
      <ExtraFeature onSearch={handleSearch} />

      <h2>Lista de Livros</h2>
      
      {livros.length === 0 && !erro ? (
        <p>A carregar livros ou nenhum registo encontrado...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {livrosFiltrados.length > 0 ? (
            livrosFiltrados.map((livro, index) => (
              <li 
                key={livro.id || index} 
                style={{ 
                  padding: '10px', 
                  borderBottom: '1px solid #ddd', 
                  marginBottom: '8px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px'
                }}
              >
                <strong>{livro.titulo || livro.title}</strong> 
                <span style={{ color: '#555' }}> — {livro.autor || livro.author}</span>
              </li>
            ))
          ) : (
            <p>Nenhum livro corresponde à tua pesquisa.</p>
          )}
        </ul>
      )}
    </div>
  )
}

export default App