const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const nfceRoutes = require('./src/routes/nfceRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rotas
app.use('/api/nfce', nfceRoutes);

app.get('/', (req, res) => {
  res.send('API NFC-e Própria Rodando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
