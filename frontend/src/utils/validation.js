export const validateBook = (formData) => {
  const errors = {};

  if (!formData.titulo || !formData.titulo.trim()) {
    errors.titulo = 'Title is required.';
  }

  if (!formData.autor || !formData.autor.trim()) {
    errors.autor = 'Author is required.';
  }

  if (formData.ano && (formData.ano < 0 || formData.ano > new Date().getFullYear())) {
    errors.ano = 'Please enter a valid publication year.';
  }

  return errors;
} 