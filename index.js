
const express = require('express');
const request = require('request');


const app = express();

const { parseFeed } = require('./xmlParser');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  next();
});

const asyncRequest = (url, sourceTitle = '') => {
  return new Promise(resolve => {
    request(
      { url },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          resolve({ error: response.status(500).json({ type: 'error', message: err.message }) });
        }

        resolve({ body: parseFeed(body, sourceTitle) });
      }
    )
  });
}

app.get('', async (req, res) => {

  let data = [];

  for (const item of req.query.source) {
    let url;
    let sourceTitle;
    switch (item) {
      case '1':
        url = 'https://www.onliner.by/feed';
        sourceTitle = 'onliner'
        break;
      case '2':
        url = 'https://news.tut.by/rss';
        sourceTitle = 'TUT.BY'
        break;
      case '3':
        url = 'https://naviny.by/rss/alls.xml';
        sourceTitle = 'NAVINY.BY'
        break;

      default:
        url = '';
        break;
    }
    if (!url) continue;
    const chunk = await asyncRequest(url, sourceTitle);
    data.push(...chunk.body)
  }

  res.send(data.sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate)));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));