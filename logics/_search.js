const algoliasearch = require('algoliasearch');

module.exports = ({text, count}, cb) => {
  if (!cb) { cb = () => {}; }
  return _search_by_algolia({text, count}, (err, result) => {
    if (err) { return cb(err); }
    return cb(null, result);
  });
};

const _search_by_algolia = ({text, count}, cb) => {
  const {ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME} = require('../config');
  const ag_client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY);
  const ag_index = ag_client.initIndex(ALGOLIA_INDEX_NAME);

  return ag_index.search({
      query: text,
      hitsPerPage: count
    }, (err, content) => {
      if (err) { return cb(err); }
      const result = {
        count: 0,
        hits: []
      };
      for (let h in content.hits) {
        result.hits.push({
          title: content.hits[h].title,
          url: `https://support.karte.io/hc/ja/articles/${content.hits[h].id}`
        });
      }
      result.count = result.hits.length;
      return cb(null, result);
  });
};
