const ContentfulBlogPosts = require("../../lib/contentfulBlogPosts");
const ContentfulTopics = require("../../lib/contentfulTopics");
const fetch = require("node-fetch");

async function getAllWebMentions() {
  const res = await fetch(
    `https://webmention.io/api/mentions.jf2?domain=whitep4nth3r.com&token=${process.env.INDIEAUTH_TOKEN}`,
  );

  const data = await res.json();
  return data.children;
}

function getLikesForPost(allMentions, postSlug) {
  const likes = allMentions.filter((mention) => mention["like-of"] === `https://whitep4nth3r.com/blog/${postSlug}/`);

  return likes;
}

// TODO: comments are mention.content

function getRepostsForPost(allMentions, postSlug) {
  const reposts = allMentions.filter(
    (mention) => mention["repost-of"] === `https://whitep4nth3r.com/blog/${postSlug}/`,
  );

  return reposts;
}

module.exports = async function () {
  const topics = await ContentfulTopics.getAll();
  const postSummaries = await ContentfulBlogPosts.getAllSummaries();
  const postsRaw = await ContentfulBlogPosts.getAll();
  const mentions = await getAllWebMentions();

  const posts = postsRaw.map((post) => {
    const likes = getLikesForPost(mentions, post.slug);
    const reposts = getRepostsForPost(mentions, post.slug);

    return { ...post, likes, reposts };
  });

  return {
    postSummaries,
    posts,
    topics,
  };
};
