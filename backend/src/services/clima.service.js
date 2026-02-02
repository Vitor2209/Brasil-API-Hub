import axios from 'axios';

export async function buscarClima(req, res) {
  try {
    const cidade = req.query.cidade;

    if (!cidade) {
      return res.status(400).json({ error: 'Cidade não informada' });
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({
        error: 'OPENWEATHER_API_KEY não definida no .env'
      });
    }

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: cidade,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric',
          lang: 'pt_br'
        }
      }
    );

    const data = response.data;

    res.json({
      cidade: data.name,
      temperatura: Math.round(data.main.temp),
      condicao: data.weather[0].description,
      umidade: data.main.humidity
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao buscar clima' });
  }
}





