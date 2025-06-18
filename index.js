require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// In-memory URL store
let urlDatabase = {};
let urlCount = 1;

// POST a URL to shorten it
app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url;

  const urlRegex = /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
  if (!urlRegex.test(original_url)) {
    return res.json({ error: 'invalid url' });
  }

  const short_url = urlCount++;
  urlDatabase[short_url] = original_url;

  res.json({ original_url, short_url });
});

// GET and redirect to original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = req.params.short_url;
  const original_url = urlDatabase[short_url];

  if (original_url) {
    return res.redirect(original_url);
  } else {
    return res.status(404).json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port http://localhost:${port}`);
});
