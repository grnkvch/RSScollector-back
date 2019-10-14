
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
    ['onliner', 'https://www.onliner.by/feed'],
    ['TUT.BY', 'https://news.tut.by/rss'],
    ['NAVINY.BY', 'https://naviny.by/rss/alls.xml'],
  ]
)


app.get('', async (req, res) => {

  let data = [];
  console.log('req.query.source', req.query.source);

  if (!req.query.source || !Array.isArray(req.query.source)) {
    res.send(data);
    return;
  };
  for (const item of req.query.source) {
    let url;
    let sourceTitle;
    // switch (item) {
    //   case 'onliner':
    //     url = 'https://www.onliner.by/feed';
    //     sourceTitle = 'onliner'
    //     break;
    //   case 'tutby':
    //     url = 'https://news.tut.by/rss';
    //     sourceTitle = 'TUT.BY'
    //     break;
    //   case 'navinyby':
    //     url = 'https://naviny.by/rss/alls.xml';
    //     sourceTitle = 'NAVINY.BY'
    //     break;

    //   default:
    //     url = '';
    //     break;
    // }
    // if (!url) continue;
    const chunk = await asyncRequest(sources.get(item), item);
    data.push(...chunk.body)
  }

  res.send(data.sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate)));
});

app.get('/get-sources', async (req, res) => {
  const sourcesList = [...sources.keys()];
  res.send(sourcesList);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));