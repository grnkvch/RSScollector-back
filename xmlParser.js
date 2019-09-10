const { get } = require('lodash');

const parseString = require('xml2js').parseString;

function dataConditioner(parsedXML) {
  // let searchStop = 0;
  let obj = {};
  try {
    const {
      title: [title],
      link: [link],
      pubDate: [pubDate],
      description: [description],
      // 'media:thumbnail': [{ '$': { url: thumbnail } }],
    } = parsedXML;

    console.dir(parsedXML);

    const thumbnail = get(parsedXML, ['media:thumbnail', '0', '$', 'url'], '')
      || get(parsedXML, ['media:content', '0', '$', 'url'], '');

    obj = {
      title,
      link,
      pubDate,
      thumbnail
    }
  } catch (error) {
    console.dir(parsedXML);
    obj = error;
  }


  return obj;
}

function parseFeed(feed) {
  let items;
  parseString(feed, function (err, result) {
    items = result.rss.channel[0].item.map((item) => {
      return dataConditioner(item);
    });
  });
  return items;
}

module.exports = { parseFeed };




