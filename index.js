const express = require('express')
const OpenAI = require('openai')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()

const app = express()

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

app.use(cors({
  origin: process.env.MODE === 'PRODUCTION' ? process.env.FRONT_URL : 'http://localhost:5173',
  credentials: true,
  sameSite: 'none'
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/api/openai', async (req, res) => {
  const { emotions,type } = req.body
  try {
    const prompt = `Recomiendame 5 ${type==='movie'?'peliculas':'series'} si ${emotions}, usa el formato pelicula (año) : descripcion`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const recommendationsText = completion.choices[0].message.content;

    const recommendationsList = recommendationsText
      .split("\n")
      .filter((movie) => movie);
    console.log(recommendationsList);
    res.json({ recommendationsList })
  } catch (error) {

  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server on');
})