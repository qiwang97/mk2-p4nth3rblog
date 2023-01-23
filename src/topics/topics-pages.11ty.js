const Config = require("../../lib/config");
const Topics = require("../_components/topics");
const PostCard = require("../_components/postCard");
const OpenGraph = require("../../lib/openGraph");

exports.data = {
  layout: "base.html",
  pagination: {
    data: "topics",
    alias: "topic",
    size: 1,
    addAllPagesToCollections: true,
  },
  permalink: (data) => {
    return `topics/${data.topic.slug}/`;
  },
  eleventyComputed: {
    title: (data) => `Learn ${data.topic.name} from Salma Alam-Naylor`,
    metaDescription: (data) => `Learn about ${data.topic.name} and more from ${Config.meta.jobDescription}.`,
    openGraphImageUrl: (data) =>
      OpenGraph.generateImageUrl({ title: `Posts about ${data.topic.name} from whitep4nth3r`, topics: [data.topic] }),
    openGraphImageAlt: (data) => OpenGraph.generateImageAlt(`Posts about ${data.topic.name} from whitep4nth3r`),
    openGraphImageWidth: OpenGraph.imgWidth,
    openGraphImageHeight: OpenGraph.imgHeight,
    openGraphUrl: (data) => `https://whitep4nth3r.com/topics/${data.topic.slug}/`,
  },
};

exports.render = function (data) {
  const { topic, topics, allPosts } = data;
  const postsByTopic = Array.from(allPosts.get(topic.slug));

  return /* html */ `
    <section class="page__index">
      <div class="page__header">
        <h1 class="page__headerTitle">Topic: <span class="colorHighlight">${topic.name}</span></h1>
      </div>

      ${Topics({ topics, selected: topic.slug, showLinkToBlog: true })}

      <ol class="grid">
        ${postsByTopic
          .map(function (item) {
            return `
          <li class="grid__item blog__item">
            ${PostCard({ post: item, baseSlug: "blog", isTalk: false })}
          </li>`;
          })
          .join("")}
      </ol>
  </section>`;
};
