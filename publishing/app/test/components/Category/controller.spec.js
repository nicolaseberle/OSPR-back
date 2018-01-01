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
  published: 1,
});

const newCategory = new Category({
  name: 'Biology',
})

describe('Categories', () => {
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

  describe('GET /categories', () => {
    it('it should GET categories', (done) => {
      newCategory.save((err, category) => {
        chai.request(server)
          .get('/categories')
          .set(config.apiKeyHeader, config.apiKey)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.eql(1);
            res.body[0].should.have.property('slug').startsWith('biology');
            done();
          });
      });
    });
  });

  describe('GET /categories/:slug', () => {
    it('it should GET articles of a category', (done) => {
      newCategory.save((err, category) => {
        newArticle.categories.push(category);
        newArticle.save((err, article) => {
          category.articles.push(article);
          category.save((err, category) => {
            chai.request(server)
              .get(`/categories/${category.slug}`)
              .set(config.apiKeyHeader, config.apiKey)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('articles').be.a('array');
                res.body.pages.should.be.a('number');
                res.body.articles.length.should.eql(1);
                done();
              });
          });
        });
      });
    });
  });

  describe('POST /categories', () => {
    it('it should not POST a category without a name', (done) => {
      const invalidCategory = { name: '' };
      chai.request(server)
        .post('/categories')
        .set(config.apiKeyHeader, config.apiKey)
        .send(invalidCategory)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.errors.should.be.a('array');
          res.body.errors.length.should.be.eql(1);
          res.body.errors[0].should.have.property('param').eql('name');
          done();
        });
    });

    it('it should POST a category', (done) => {
      const validCategory = { name: 'Physics' };
      chai.request(server)
        .post('/categories')
        .set(config.apiKeyHeader, config.apiKey)
        .send(validCategory)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('slug').startsWith('physics');
          done();
        });
    })
  });
});
