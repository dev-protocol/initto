const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const fs = require('fs');

// Import filters
const dateFilter = require('./src/filters/date-filter.js');
const dateFilterJa = require('./src/filters/date-filter-ja.js');
const dateFilterPt = require('./src/filters/date-filter-pt.js');
const markdownFilter = require('./src/filters/markdown-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');
const localeItemFilter = require('./src/filters/lang-item-filter.js');
const extractExcerptFilter = require('./src/filters/extract-excerpt-filter.js');

// Import transforms
const htmlMinTransform = require('./src/transforms/html-min-transform.js');
const parseTransform = require('./src/transforms/parse-transform.js');

// Import data files
const site = require('./src/_data/site.json');

// Import markdown-lib
const markdownLib = require('./src/utils/markdown-lib');

module.exports = function(config) {
  config.setLibrary('md', markdownLib);

  // Filters
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('dateFilterJa', dateFilterJa);
  config.addFilter('dateFilterPt', dateFilterPt);
  config.addFilter('markdownFilter', markdownFilter);
  config.addFilter('w3DateFilter', w3DateFilter);
  config.addFilter('localeItemFilter', localeItemFilter);
  config.addFilter('extractExcerptFilter', extractExcerptFilter);

  // Layout aliases
  config.addLayoutAlias('home', 'layouts/home.njk');

  // Transforms
  config.addTransform('htmlmin', htmlMinTransform);
  config.addTransform('parse', parseTransform);

  // Passthrough copy
  config.addPassthroughCopy('src/fonts');
  config.addPassthroughCopy('src/images');
  config.addPassthroughCopy('src/js');
  config.addPassthroughCopy('src/admin/config.yml');
  config.addPassthroughCopy('src/admin/previews.js');
  config.addPassthroughCopy('node_modules/nunjucks/browser/nunjucks-slim.js');
  config.addPassthroughCopy('src/robots.txt');

  const now = new Date();

  // Custom collections
  const livePosts = post => post.date <= now && !post.data.draft;
  config.addCollection('posts_en', collection => {
    return [
      ...collection.getFilteredByGlob('./src/en/posts/*.md').filter(livePosts)
    ].reverse();
  });
  config.addCollection('posts_ja', collection => {
    return [
      ...collection.getFilteredByGlob('./src/ja/posts/*.md').filter(livePosts)
    ].reverse();
  });
  config.addCollection('posts_pt', collection => {
    return [
      ...collection.getFilteredByGlob('./src/pt/posts/*.md').filter(livePosts)
    ].reverse();
  });

  config.addCollection('postFeed_en', collection => {
    return [...collection.getFilteredByGlob('./src/en/posts/*.md').filter(livePosts)]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });
  config.addCollection('postFeed_ja', collection => {
    return [...collection.getFilteredByGlob('./src/ja/posts/*.md').filter(livePosts)]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });
  config.addCollection('postFeed_pt', collection => {
    return [...collection.getFilteredByGlob('./src/pt/posts/*.md').filter(livePosts)]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);

  /* Forestry instant previews
  if( process.env.ELEVENTY_ENV == "staging" ) {
    eleventyConfig.setBrowserSyncConfig({
      host: "0.0.0.0"
    });
  }*/

  // 404
  config.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('dist/404.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    passthroughFileCopy: true
  };
};
