import axios from 'axios';

export async function buscarFeriados(req, res) {
  try {
    const { ano } = req.params;

    const response = await axios.get(
      `https://brasilapi.com.br/api/feriados/v1/${ano}`
    );

    res.json(response.data);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar feriados' });
  }
}

