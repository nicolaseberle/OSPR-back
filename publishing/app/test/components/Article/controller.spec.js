/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiString = require('chai-string');
const server = require('../../../bin/server');
const config = require('../../../config');

const should = chai.should();

const Article = require('../../../src/components/Article/model');
const Category = require('../../../src/components/Category/model');

chai.use(chaiHttp);
chai.use(chaiString);

const newArticle = new Article({
  title: 'This is a title',
  abstract: 'This is an abstract',
  content: 'This is the content of the article',
  published: true,
});

const newCategory = new Category({
  name: 'Biology',
});

describe('Articles', () => {
  before((done) => {
    Article.remove({}, () => {
      Category.remove({}, err => done());
    });
  });
  after((done) => {
    Article.remove({}, () => {
      Category.remove({}, err => done());
    });
  });

  describe('GET /articles', () => {
    it('it should GET an object with an array of articles', (done) => {
      newArticle.save((err, article) => {
        chai.request(server)
          .get('/articles')
          .set(config.apiKeyHeader, config.apiKey)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.articles.should.be.a('array');
            res.body.pages.should.be.a('number');
            res.body.articles.length.should.be.eql(1);
            done();
          });
      })
    });
  });

  describe('POST /articles', () => {
    // Test an error
    it('it should not POST an article without a title', (done) => {
      const article = {
        abstract: 'This is an abstract',
        content: 'This is the content of the article',
      };
      chai.request(server)
        .post('/articles')
        .set(config.apiKeyHeader, config.apiKey)
        .send(article)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.errors.should.be.a('array');
          res.body.errors.length.should.be.eql(1);
          res.body.errors[0].should.have.property('param').eql('title');
          done();
        });
    });

    // Test a success
    it('it should POST an article', (done) => {
      const article = {
        title: 'This is a title',
        abstract: 'This is an abstract',
        content: 'This is the content of the article',
      };
      chai.request(server)
        .post('/articles')
        .set(config.apiKeyHeader, config.apiKey)
        .send(article)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('slug').startsWith('this-is-a-title');
          res.body.published.should.be.eql(false);
          done();
        });
    });
  });

  describe('GET /articles/:slug', () => {
    it('it should GET an article by given slug', (done) => {
      newArticle.save((err, article) => {
        chai.request(server)
          .get(`/articles/${article.slug}`)
          .set(config.apiKeyHeader, config.apiKey)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('slug').eql(article.slug);
            res.body.should.have.property('title');
            res.body.should.have.property('abstract');
            res.body.should.have.property('content');
            done();
          });
      });
    });
  });

  describe('PUT /articles/:slug', () => {
    it('it should UPDATE an article by given slug', (done) => {
      newArticle.save((err, article) => {
        chai.request(server)
          .put(`/articles/${article.slug}`)
          .set(config.apiKeyHeader, config.apiKey)
          .send({
            title: 'This is really a title',
            abstract: 'This is really an abstract',
            content: 'This is really the content of the article',
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title').eql('This is really a title');
            res.body.should.have.property('abstract').eql('This is really an abstract');
            res.body.should.have.property('content').eql('This is really the content of the article');
            done();
          });
      });
    });
  });

  describe('DELETE /articles/:slug', () => {
    it('it should DELETE an article by given slug', (done) => {
      newArticle.save((err, article) => {
        chai.request(server)
          .delete(`/articles/${article.slug}`)
          .set(config.apiKeyHeader, config.apiKey)
          .end((err, res) => {
            res.should.have.status(204);
            done();
          });
      });
    });
  });

  describe('PUT /articles/:slug/toggle', () => {
    it('it should toggle published property of an article', (done) => {
      newArticle.save((err, article) => {
        article.should.have.property('published').eql(true);
        chai.request(server)
          .put(`/articles/${article.slug}/toggle`)
          .set(config.apiKeyHeader, config.apiKey)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('published').eql(false);
            done();
          });
      });
    });
  });

  describe('GET /articles/:slug/categories', () => {
    it('it should GET categories of an article by given slug', (done) => {
      newArticle.save((err, article) => {
        newCategory.articles.push(article);
        newCategory.save((err, category) => {
          article.categories.push(category);
          article.save((err, article) => {
            chai.request(server)
              .get(`/articles/${article.slug}/categories`)
              .set(config.apiKeyHeader, config.apiKey)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0].slug.should.startsWith('biology');
                done();
              });
          });
        });
      });
    });
  });

  describe('PUT /articles/:slug/categories', () => {
    it('it should add a category to an article by given slug', (done) => {
      newArticle.save((err, article) => {
        newCategory.save((err, category) => {
          chai.request(server)
            .put(`/articles/${article.slug}/categories`)
            .set(config.apiKeyHeader, config.apiKey)
            .send({ slug: category.slug })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('slug').startsWith('this-is-a-title');
              res.body.should.have.property('categories').include(`${category.id}`);
              done();
            });
        });
      });
    });
  });

  describe('DELETE /articles/:slug/categories', () => {
    it('it should remove a category of an article by given slug', (done) => {
      newArticle.save((err, article) => {
        newCategory.articles.push(article);
        newCategory.save((err, category) => {
          article.categories.push(category);
          article.save((err, article) => {
            chai.request(server)
              .delete(`/articles/${article.slug}/categories`)
              .set(config.apiKeyHeader, config.apiKey)
              .send({ slug: category.slug })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('slug').startsWith('this-is-a-title');
                res.body.categories.length.should.eql(0);
                done();
              });
          });
        });
      });
    });
  });
});
