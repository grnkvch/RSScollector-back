const { get } = require('lodash');

const parseString = require('xml2js').parseString;

function dataConditioner(parsedXML, sourceTitle = '') {
  console.log('parsedXML', parsedXML);
  let obj = {};
  try {
    const {
      title: [title],
      link: [link],
      pubDate: [pubDate],
    } = parsedXML;

    const thumbnail = get(parsedXML, ['media:thumbnail', '0', '$', 'url'], '')
      || get(parsedXML, ['media:content', '0', '$', 'url'], '');

    obj = {
      title,
      link,
      pubDate,
      thumbnail,
      sourceTitle
    }
  } catch (error) {
    console.dir(parsedXML);
    obj = error;
  }


  return obj;
}

function parseFeed(feed, sourceTitle = '') {
  let items;
  parseString(feed, function (err, result) {
    items = result.rss.channel[0].item.map((item) => {
      return dataConditioner(item, sourceTitle);
    });
  });
  return items;
}

module.exports = { parseFeed };




