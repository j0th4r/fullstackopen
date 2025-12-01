const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, currentBlog) => {
    return sum + currentBlog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((mostLikedBlog, currentBlog) => {
    return mostLikedBlog.likes > currentBlog.likes
      ? mostLikedBlog
      : currentBlog;
  }, {});
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = _.countBy(blogs, 'author');
  const authorEntries = _.toPairs(authorCounts);
  const maxEntry = _.maxBy(authorEntries, (entry) => entry[1]);
  const [author, blogCount] = maxEntry;
  return { author, blogs: blogCount };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const blogsByAuthor = _.groupBy(blogs, 'author');
  const authorLikesTotals = _.toPairs(blogsByAuthor).map(
    ([author, authorBlogs]) => ({
      author,
      likes: _.sumBy(authorBlogs, 'likes'),
    })
  );

  return _.maxBy(authorLikesTotals, 'likes');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
