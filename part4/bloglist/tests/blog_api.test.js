const assert = require('node:assert');
const { describe, test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test('all blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test('blog posts unique identifier is named id', async () => {
  const blogs = await helper.blogsInDb();
  blogs.forEach((blog) => {
    assert.ok(blog.id, 'Blog is missing id attribute');
    assert.strictEqual(blog._id, undefined, 'Blog should not have _id');
  });
});

describe('when adding a new blog', () => {
  test('blog count increases by one and added blog can be found', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((r) => r.title);
    assert(titles.includes('First class tests'));
  });

  test('likes attribute get default value 0 if not passed with request', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find(
      (blog) => blog.title === 'First class tests'
    );

    assert.strictEqual(addedBlog.likes, 0);
  });

  test('blog without title or url is not added', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      likes: 10,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });
});

describe('when deleting a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    const titles = blogsAtEnd.map((b) => b.title);

    assert(!titles.includes(blogToDelete.title));
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
  });
});

describe('when modificating a blog', () => {
  test('all fields will be updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const editedBlog = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'Updated url',
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(editedBlog)
      .expect(200);

    const updatedBlog = await Blog.findById(blogToUpdate.id);

    assert.strictEqual(updatedBlog.title, editedBlog.title);
    assert.strictEqual(updatedBlog.author, editedBlog.author);
    assert.strictEqual(updatedBlog.url, editedBlog.url);
    assert.strictEqual(updatedBlog.likes, editedBlog.likes);
  });
});

after(async () => {
  await mongoose.connection.close();
});
