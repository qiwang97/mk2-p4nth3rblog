const Config = require("../../lib/config");
const DateUtils = require("../../lib/dateUtils");
const RichText = require("../_components/richText");

exports.data = {
  permalink: "/feed.xml",
};

function buildCategories(topics) {
  if (!topics) {
    return;
  }
  return topics
    .map((topic) => {
      return `<category>${topic.name}</category>`;
    })
    .join("");
}

function buildContent(postBody) {
  return `
  <content:encoded><![CDATA[ 
    ${RichText(postBody, { renderRssFriendlyImg: true, absoluteUrls: true, renderHeadingLinks: false })}
  ]]></content:encoded>`;
}

function chooseUrl(item, urlSlug) {
  return item.externalUrl || `https://${Config.site.domain}/${urlSlug}/${item.slug}/`;
}

function removeUrlParamsFromLink(url) {
  return url.split("?")[0];
}

function buildRssItems(items) {
  return items
    .map((item) => {
      const isTalk = item.speakerDeckLink;
      const urlSlug = isTalk ? "talks" : "blog";
      const contentBody = isTalk ? item.transcript : item.body;

      return `
        <item>
          <title>${item.title}</title>
          <description>${item.excerpt}</description>
          <author>${Config.site.email} (${Config.site.owner})</author>
          <link>${removeUrlParamsFromLink(chooseUrl(item, urlSlug))}</link>
          <guid>${removeUrlParamsFromLink(chooseUrl(item, urlSlug))}</guid>
          <pubDate>${DateUtils.makeForRss(item.date)}</pubDate>
          ${buildCategories(item.topicsCollection.items)}
          ${buildContent(contentBody)}
        </item>
        `;
    })
    .join("");
}
exports.render = function (data) {
  const { sortedItems } = data;

  return /* xml */ `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0"
  xmlns:atom="https://www.w3.org/2005/Atom"
  xmlns:content="https://purl.org/rss/1.0/modules/content/">
  <channel>
  <title>${Config.site.title} RSS Feed</title>
  <atom:link href="https://${Config.site.domain}/feed.xml" rel="self" type="application/rss+xml" />
  <link>https://${Config.site.domain}</link>
  <description>Posts, talks and more about web development, accessibility, Jamstack, JavaScript, and more from whitep4nth3r.</description>
    ${buildRssItems(sortedItems)}
    </channel>
    </rss>
  `;
};
