const { test, describe, expect, beforeEach } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'John Doe',
        username: 'johndoe',
        password: 'pass123',
      },
    });
    await request.post('/api/users', {
      data: {
        name: 'Jane Smith',
        username: 'janesmith',
        password: 'pass456',
      },
    });

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('blogs');
    await expect(locator).toBeVisible();
    await expect(page.getByText('username')).toBeVisible();
    await expect(page.getByText('password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'johndoe', 'pass123');
      await expect(page.getByText('John Doe logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'johndoe', 'wrongpass');

      const errorDiv = page.locator('.error');
      await expect(errorDiv).toContainText('wrong username or password');
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');

      await expect(page.getByText('John Doe logged in')).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'johndoe', 'pass123');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'testTitle',
        author: 'testAuthor',
        url: 'testurl.com',
      });

      await expect(page.getByText('testTitle by testAuthor')).toBeVisible();
    });

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: 'testTitle',
          author: 'testAuthor',
          url: 'testurl.com',
        });
      });

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(
          page.getByText('You liked testTitle by testAuthor')
        ).toBeVisible();
      });

      test('blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click();
        page.once('dialog', (dialog) => dialog.accept());
        await page.getByRole('button', { name: 'remove' }).click();
        await expect(
          page.getByText('Blog testTitle, by testAuthor removed')
        ).toBeVisible();
      });

      test('only creator sees delete button', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click();
        await expect(
          page.getByRole('button', { name: 'remove' })
        ).toBeVisible();

        await page.getByRole('button', { name: 'logout' }).click();

        await loginWith(page, 'janesmith', 'pass456');

        await page.getByRole('button', { name: 'view' }).click();

        await expect(
          page.getByRole('button', { name: 'remove' })
        ).not.toBeVisible();
      });
    });

    describe('and three blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: 'testTitle',
          author: 'testAuthor',
          url: 'testurl.com',
        });
        await createBlog(page, {
          title: 'testTitle2',
          author: 'testAuthor2',
          url: 'testurl2.com',
        });
        await createBlog(page, {
          title: 'testTitle3',
          author: 'testAuthor3',
          url: 'testurl3.com',
        });
      });

      test('and are arranged in order', async ({ page }) => {
        // Let's make "Second blog" the most liked (e.g., 2 likes)
        const secondBlog = page
          .locator('.blog')
          .filter({ hasText: 'testTitle2' })
          .first();
        await secondBlog.getByRole('button', { name: 'view' }).click();

        await secondBlog.getByRole('button', { name: 'like' }).click();
        await secondBlog.getByText('likes 1').waitFor(); // Wait for count to update

        await secondBlog.getByRole('button', { name: 'like' }).click();
        await secondBlog.getByText('likes 2').waitFor(); // Wait for second update

        const blogs = page.locator('.blog');
        // Most liked should be first
        await expect(blogs.nth(0)).toContainText('testTitle2');
      });
    });
  });
});
