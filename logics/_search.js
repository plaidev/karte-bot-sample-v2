/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const algoliasearch = require('algoliasearch');

module.exports = function({text, count}, cb) {
  if (cb == null) { cb = function(){}; }
  return _search_by_algolia({text, count}, function(err, result) {
    if (err) { return cb(err); }
    return cb(null, result);
  });
};

var _search_by_algolia = function({text, count}, cb) {
  const {ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME} = require('../config');
  const ag_client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY);
  const ag_index = ag_client.initIndex(ALGOLIA_INDEX_NAME);

  return ag_index.search({
      query: text,
      hitsPerPage: count
    }, function(err, content) {
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
