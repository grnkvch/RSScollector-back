
const express = require('express');
const request = require('request');
const Parser = require('rss-parser');
const parser = new Parser();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  next();
});

const asyncRequest = (url) => {
  return new Promise(resolve => {
    request(
      { url },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return res.status(500).json({ type: 'error', message: err.message });
        }
        // console.log('body', body);
        // console.log('response', response);
        // res.send(body);
        parser.parseString(body).then((parsed) => {
          console.log(parsed);
          resolve(parsed);
        });
      }
    )
  });
}

app.get('', async (req, res) => {
  let url;
  console.log(req.query);
  switch (req.query.source) {
    case '1':
      url = 'https://www.onliner.by/feed';
      break;
    case '2':
      url = 'https://news.tut.by/rss';
      break;
    case '3':
      url = 'https://naviny.by/rss/alls.xml';
      break;

    default:
      url = 'https://www.onliner.by/feed';
      break;
  }
  const pars1 = await asyncRequest('https://www.onliner.by/feed');
  const pars2 = await asyncRequest('https://news.tut.by/rss');
  const pars3 = await asyncRequest('https://naviny.by/rss/alls.xml');
  res.send({ pars1, pars2, pars3 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));