module.exports = function (eleventyConfig) {
    // #region agent log
    const fs = require('fs');
    const path = require('path');
    const logPath = '/Users/vparedes/Documents/Dev/hvac-answers/.cursor/debug.log';
    const logEntry = {
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A',
      location: '.eleventy.js:1',
      message: 'Eleventy config function entry',
      data: { timestamp: Date.now() },
      timestamp: Date.now()
    };
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
    // #endregion
    
    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy("admin");
  
    // Create categories collection
    eleventyConfig.addCollection("categories", function(collectionApi) {
      return collectionApi.getFilteredByTag("categories");
    });
  
    // Create tags collection
    eleventyConfig.addCollection("tags", function(collectionApi) {
      return collectionApi.getFilteredByTag("tags");
    });
  
    // Explicitly create the posts collection (from posts directory)
    eleventyConfig.addCollection("posts", function(collectionApi) {
      return collectionApi.getAll().filter(function(item) {
        return item.inputPath && item.inputPath.includes("/posts/") && !item.inputPath.includes("/_posts.json");
      });
    });
  
    // Create published posts collection (only published status)
    eleventyConfig.addCollection("publishedPosts", function(collectionApi) {
      return collectionApi.getAll().filter(function(item) {
        return item.inputPath && item.inputPath.includes("/posts/") && 
               !item.inputPath.includes("/_posts.json") &&
               item.data.status === "published";
      });
    });
  
    // Filter to find category by slug
    eleventyConfig.addFilter("findCategory", function(categories, slug) {
      if (!categories || !slug) return null;
      return categories.find(cat => cat.data.slug === slug || cat.fileSlug === slug);
    });
  
    // Filter to find tag by slug
    eleventyConfig.addFilter("findTag", function(tags, slug) {
      if (!tags || !slug) return null;
      return tags.find(tag => tag.data.slug === slug || tag.fileSlug === slug);
    });
  
    // Permalink function for custom slugs
    eleventyConfig.addFilter("postPermalink", function(post) {
      if (post.data.slug) {
        return `/posts/${post.data.slug}/`;
      }
      return post.url;
    });
  
    // Date formatting filter
    eleventyConfig.addFilter("formatDate", function(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    });
  
    // #region agent log
    const config = {
      dir: {
        input: "src",
        output: "_site",
        includes: "includes"
      }
    };
    const logEntry2 = {
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A',
      location: '.eleventy.js:58',
      message: 'Eleventy config return value',
      data: { config, includesDir: config.dir.includes, defaultIncludes: '_includes' },
      timestamp: Date.now()
    };
    fs.appendFileSync(logPath, JSON.stringify(logEntry2) + '\n');
    // #endregion
    
    return config;
  };
  