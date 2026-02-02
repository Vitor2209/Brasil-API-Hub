import axios from 'axios';

export async function buscarCep(req, res) {
  try {
    const { cep } = req.params;

    const response = await axios.get(
      `https://viacep.com.br/ws/${cep}/json/`
    );

    if (response.data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }

    res.json(response.data);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar CEP' });
  }
}
