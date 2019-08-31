
const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  next();
});

app.get('', (req, res) => {
  // console.log(req.query);
  // console.log(req);
  const url = req.query.source === "onliner" ? 'https://www.onliner.by/feed' : 'https://news.tut.by/rss'
  request(
    { url },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }
      // console.log('body', body);
      // console.log('response', response);
      res.send(body);
      // res.json(JSON.parse(body));
    }
  )
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));