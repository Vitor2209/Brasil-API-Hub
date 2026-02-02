import axios from 'axios';

export async function buscarDolar(req, res) {
  try {
    const response = await axios.get(
      'https://economia.awesomeapi.com.br/json/last/USD-BRL'
    );

    const dolar = response.data.USDBRL;

    res.json({
      compra: Number(dolar.bid),
      venda: Number(dolar.ask),
      data: dolar.create_date
    });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar cotação' });
  }
}
