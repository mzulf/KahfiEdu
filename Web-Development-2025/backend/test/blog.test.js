// ============================
// MOCK HELPERS
// ============================
jest.mock('../helpers/helperFunction', () => ({
  createSuccessResponse: (message, data) => ({
    success: true,
    message,
    ...data
  }),
  AppError: class AppError {
    constructor(message, status) {
      this.message = message;
      this.status = status;
    }
  },
  handleError: (err, res) => {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message
    });
  }
}));

jest.mock('../utils/validateBlogData', () => jest.fn());
jest.mock('../helpers/validationRole', () => ({
  isAdmin: jest.fn()
}));
jest.mock('../utils/getFileUrl', () => jest.fn());
jest.mock('../utils/paginationUtil', () => ({
  getPagination: jest.fn(() => ({
    limit: 10,
    offset: 0,
    statusCondition: null,
    paranoid: true,
    meta: { total: 0, totalPages: 0 }
  }))
}));
jest.mock('../helpers/searchQueryHelper', () => ({
  createSearchWhereClauseWithTags: jest.fn(() => ({}))
}));

// ============================
// MOCK MODELS + SEQUELIZE
// ============================
jest.mock('../models', () => ({
  Blog: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    count: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
    restore: jest.fn()
  },
  sequelize: {
    query: jest.fn()
  }
}));

// ============================
// IMPORT
// ============================
const request = require('supertest');
const express = require('express');

const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  restoreBlog,
  getUniqueTags
} = require('../controllers/blogController');

const { Blog, sequelize } = require('../models');
const validateBlogData = require('../utils/validateBlogData');
const { isAdmin } = require('../helpers/validationRole');
const getFileUrl = require('../utils/getFileUrl');

// ============================
// APP SETUP
// ============================
const app = express();
app.use(express.json());

app.post('/blog', createBlog);
app.get('/blogs', getBlogs);
app.get('/blog/:id', getBlogById);
app.put('/blog/:id', updateBlog);
app.delete('/blog/:id', deleteBlog);
app.patch('/blog/restore/:id', restoreBlog);
app.get('/blog/tags/unique', getUniqueTags);

// ============================
// TESTS
// ============================
describe("BLOG CONTROLLER FULL TEST", () => {

  // ------------------------------------------------
  // GET BLOG BY ID
  // ------------------------------------------------
  it("GET /blog/:id - success", async () => {
    Blog.findByPk.mockResolvedValue({ id: 1, title: "Test" });

    const res = await request(app).get('/blog/1');

    expect(res.status).toBe(200);
    expect(res.body.blog.id).toBe(1);
  });

  it("GET /blog/:id - not found", async () => {
    Blog.findByPk.mockResolvedValue(null);

    const res = await request(app).get('/blog/999');

    expect(res.status).toBe(404);
  });

  // ------------------------------------------------
  // CREATE BLOG
  // ------------------------------------------------
  it("POST /blog - success", async () => {
    validateBlogData.mockResolvedValue({
      isValid: true,
      data: { title: "A", content: "B" }
    });

    isAdmin.mockReturnValue({ isValid: true, userId: 1 });
    getFileUrl.mockReturnValue(null);

    Blog.create.mockResolvedValue({ id: 1 });
    Blog.findByPk.mockResolvedValue({ id: 1, title: "A" });

    const res = await request(app)
      .post('/blog')
      .send({ title: "A", content: "B" });

    expect(res.status).toBe(201);
    expect(res.body.blog.id).toBe(1);
  });

  // ------------------------------------------------
  // GET BLOGS
  // ------------------------------------------------
  it("GET /blogs - success", async () => {
    Blog.count.mockResolvedValue(2);
    Blog.findAndCountAll.mockResolvedValue({
      rows: [{ id: 1 }, { id: 2 }]
    });

    const res = await request(app).get('/blogs');

    expect(res.status).toBe(200);
    expect(res.body.blogs.length).toBe(2);
  });

  // ------------------------------------------------
  // UPDATE BLOG
  // ------------------------------------------------
  it("PUT /blog/:id - success", async () => {
    validateBlogData.mockReturnValue({
      isValid: true,
      data: { title: "New" }
    });

    isAdmin.mockReturnValue({ isValid: true, userId: 1 });

    const mockBlog = {
      update: jest.fn(),
      id: 1
    };

    Blog.findByPk.mockResolvedValue(mockBlog);
    Blog.findByPk.mockResolvedValueOnce(mockBlog).mockResolvedValueOnce({ id: 1, title: "New" });

    const res = await request(app)
      .put('/blog/1')
      .send({ title: "New" });

    expect(res.status).toBe(200);
  });

  // ------------------------------------------------
  // DELETE BLOG
  // ------------------------------------------------
  it("DELETE /blog/:id - success", async () => {
    isAdmin.mockReturnValue({ isValid: true, userId: 1 });

    Blog.findByPk.mockResolvedValue({ destroy: jest.fn() });

    const res = await request(app).delete('/blog/1');

    expect(res.status).toBe(200);
  });

  // ------------------------------------------------
  // RESTORE BLOG
  // ------------------------------------------------
  it("PATCH /blog/restore/:id - success", async () => {
    isAdmin.mockReturnValue({ isValid: true, userId: 1 });

    Blog.findByPk.mockResolvedValue({ deletedAt: true, restore: jest.fn() });

    const res = await request(app).patch('/blog/restore/1');

    expect(res.status).toBe(200);
  });

  // ------------------------------------------------
  // GET UNIQUE TAGS
  // ------------------------------------------------
  it("GET /blog/tags/unique - success", async () => {
    sequelize.query.mockResolvedValue([
      [{ tag: "tech" }, { tag: "code" }]
    ]);

    const res = await request(app).get('/blog/tags/unique');

    expect(res.status).toBe(200);
    expect(res.body.tags.length).toBe(2);
  });

});
