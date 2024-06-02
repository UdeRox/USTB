const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
const port = process.env.PORT || 3000;

// In-memory data store
let portfolioUsd = 10000000.0; // Initial portfolio value in USD
let tbillValue = 0.0; // Initial T-bill value
let userTbillMap = {}; // Map to store T-bill value for each userAddress

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// GET /api/portfolio
app.get('/api/portfolio', (req, res) => {
  res.json({ portfolioUsd, tbillValue });
});

// POST /api/buy
app.post('/api/buy', (req, res) => {
  const { buyAmount, userAddress } = req.body;
  if (!buyAmount || typeof buyAmount !== 'number' || buyAmount <= 0) {
    return res.status(400).json({ error: 'Invalid buy amount' });
  }

  if (!userAddress || typeof userAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid user address' });
  }

  if (buyAmount > portfolioUsd) {
    return res.status(400).json({ error: 'Insufficient funds in portfolio' });
  }

  tbillValue += buyAmount;
  portfolioUsd -= buyAmount;

  if (!userTbillMap[userAddress]) {
    userTbillMap[userAddress] = 0;
  }
  userTbillMap[userAddress] += buyAmount;

  res.json({ buyAmount, userAddress, tbillValue, portfolioUsd });
});

// POST /api/sell
app.post('/api/sell', (req, res) => {
  const { sellAmount, userAddress } = req.body;
  if (!sellAmount || typeof sellAmount !== 'number' || sellAmount <= 0) {
    return res.status(400).json({ error: 'Invalid sell amount' });
  }

  if (!userAddress || typeof userAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid user address' });
  }

  if (!userTbillMap[userAddress] || userTbillMap[userAddress] < sellAmount) {
    return res.status(400).json({ error: 'Insufficient T-bill balance for user' });
  }

  tbillValue -= sellAmount;
  portfolioUsd += sellAmount;
  userTbillMap[userAddress] -= sellAmount;

  res.json({ sellAmount, userAddress, tbillValue, portfolioUsd });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
