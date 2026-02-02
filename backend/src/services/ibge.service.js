import axios from 'axios';

export async function listarEstados(req, res) {
  try {
    const response = await axios.get(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
    );

    const estados = response.data.map(e => ({
      sigla: e.sigla,
      nome: e.nome,
      regiao: e.regiao.nome
    }));

    res.json(estados);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar dados do IBGE' });
  }
}

