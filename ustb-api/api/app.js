const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// In-memory data store
let portfolio = 1000.0; // Initial portfolio value in USD

app.use(bodyParser.json());

// GET /api/portfolio
app.get('/api/portfolio', (req, res) => {
  res.json({ portfolio });
});

// POST /api/buy
app.post('/api/buy', (req, res) => {
  const { buyAmount } = req.body;
  if (!buyAmount || typeof buyAmount !== 'number' || buyAmount <= 0) {
    return res.status(400).json({ error: 'Invalid buy amount' });
  }

  const valueBought = buyAmount;
  portfolio += valueBought;
  res.json({ valueBought });
});

// POST /api/sell
app.post('/api/sell', (req, res) => {
  const { sellAmount } = req.body;
  if (!sellAmount || typeof sellAmount !== 'number' || sellAmount <= 0 || sellAmount > portfolio) {
    return res.status(400).json({ error: 'Invalid sell amount' });
  }

  portfolio -= sellAmount;
  res.json({ sellAmount });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
