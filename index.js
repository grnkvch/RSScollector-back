
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
          resolve({ error: response.status(500).json({ type: 'error', message: error.message }) });
        }

        resolve({ body: parseFeed(body, sourceTitle) });
      }
    )
  });
}


const sources = new Map(
  [
    ['onliner.by', [
      'https://people.onliner.by/feed',
      'https://auto.onliner.by/feed',
      'https://tech.onliner.by/feed',
      'https://realt.onliner.by/feed'
    ]
    ],
    ['tut.by', 'https://news.tut.by/rss'],
    ['naviny.by', 'https://naviny.by/rss/alls.xml'],
  ]
)


app.get('', async (req, res) => {

  let data = [];
  if (!req.query.source || !Array.isArray(req.query.source)) {
    res.send(data);
    return;
  };
  for (const item of req.query.source) {
    const sourceLink = sources.get(item);
    if (Array.isArray(sourceLink)) {
      console.log('sourceLink', sourceLink);
      for (const link of sourceLink) {
        const chunk = await asyncRequest(link, item);
        data.push(...chunk.body)
      }
    } else {
      const chunk = await asyncRequest(sourceLink, item);
      data.push(...chunk.body)
    }
  }

  res.send(data.sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate)));
});

app.get('/get-sources', async (req, res) => {
  const sourcesList = [...sources.keys()];
  res.send(sourcesList);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));