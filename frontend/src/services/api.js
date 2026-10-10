const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function mensagemPorStatus(status) {
  if (status === 404) return "Book not found.";
  if (status === 422) return "Invalid data. Please check the fields.";
  if (status >= 500) return "Server error. Please try again later.";
  return "Something went wrong. Please try again.";
}

export async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(
      "Could not connect to the server. Is the API running?",
      0
    );
  }

  if (!response.ok) {
    throw new ApiError(mensagemPorStatus(response.status), response.status);
  }

  return response.json();
}