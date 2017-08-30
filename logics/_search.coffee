algoliasearch = require('algoliasearch')

module.exports = ({text, count}, cb=()->) ->
  _search_by_algolia {text, count}, (err, result) ->
    return cb err if err
    return cb null, result

_search_by_algolia = ({text, count}, cb) ->
  {ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME} = require('../config')
  ag_client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY)
  ag_index = ag_client.initIndex(ALGOLIA_INDEX_NAME)

  ag_index.search {
      query: text
      hitsPerPage: count
    }, (err, content) ->
      return cb err if err
      result =
        count: 0
        hits: []
      for h of content.hits
        result.hits.push
          title: content.hits[h].title
          url: "https://support.karte.io/hc/ja/articles/#{content.hits[h].id}"
      result.count = result.hits.length
      return cb null, result
