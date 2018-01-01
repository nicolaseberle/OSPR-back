/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../bin/server');
const config = require('../../../config');

const should = chai.should();

const Article = require('../../../src/components/Article/model');
const Comment = require('../../../src/components/Comment/model');

chai.use(chaiHttp);

const newArticle = new Article({
  title: 'This is a title',
  abstract: 'This is an abstract',
  content: 'This is the content of the article',
  published: 1,
});

const newComment = new Comment({
  userId: '123456789',
  content: 'This is a comment',
  article: newArticle,
});

describe('Comments', () => {
  before((done) => {
    Article.remove({}, () => {
      Comment.remove({}, err => done());
    });
  });
  after((done) => {
    Article.remove({}, () => {
      Comment.remove({}, err => done());
    });
  });

  describe('GET /articles/:slug/comments', () => {
    it('it should GET comments of an article by given slug', (done) => {
      newArticle.save((err, article) => {
        newComment.save((err, comment) => {
          article.comments.push(comment);
          article.save((err, article) => {
            chai.request(server)
              .get(`/articles/${article.slug}/comments`)
              .set(config.apiKeyHeader, config.apiKey)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.comments.should.be.a('array');
                res.body.pages.should.be.a('number');
                res.body.comments.length.should.be.eql(1);
                done();
              });
          });
        });
      });
    });
  });

  describe('GET /articles/:slug/comments/:id', () => {
    it('it should GET a single comment by given id of an article by given slug', (done) => {
      newArticle.save((err, article) => {
        newComment.save((err, comment) => {
          article.comments.push(comment);
          article.save((err, article) => {
            chai.request(server)
              .get(`/articles/${article.slug}/comments/${comment._id}`)
              .set(config.apiKeyHeader, config.apiKey)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('content').eql('This is a comment');
                res.body.should.have.property('userId').eql('123456789');
                res.body.should.have.property('article').eql(`${article._id}`);
                done();
              });
          });
        });
      });
    });
  });

  describe('POST /articles/:slug/comments', () => {
    it('it should not POST a comment without content for an article by given slug', (done) => {
      newArticle.save((err, article) => {
        chai.request(server)
          .post(`/articles/${article.slug}/comments`)
          .set(config.apiKeyHeader, config.apiKey)
          .send(new Comment({ userId: '12356789', content: '', article }))
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.errors.should.be.a('array');
            res.body.errors.length.should.be.eql(1);
            res.body.errors[0].should.have.property('param').eql('content');
            done();
          });
      });
    });

    it('it should POST a comment for an article by given slug', (done) => {
      newArticle.save((err, article) => {
        chai.request(server)
          .post(`/articles/${article.slug}/comments`)
          .set(config.apiKeyHeader, config.apiKey)
          .send(newComment)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('content').eql('This is a comment');
            res.body.should.have.property('userId').eql('123456789');
            res.body.should.have.property('article').be.a('object');
            res.body.article.should.have.property('slug').eql(article.slug);
            done();
          });
      });
    });
  });

  describe('PUT /articles/:slug/comments/:id', () => {
    it('it should UPDATE a comment by given id of an article by given slug', (done) => {
      newArticle.save((err, article) => {
        newComment.save((err, comment) => {
          article.comments.push(comment);
          article.save((err, article) => {
            chai.request(server)
              .put(`/articles/${article.slug}/comments/${comment._id}`)
              .set(config.apiKeyHeader, config.apiKey)
              .send({ userId: '123456789', content: 'This is really a comment' })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('content').eql('This is really a comment');
                res.body.should.have.property('userId').eql('123456789');
                res.body.should.have.property('article').eql(`${article._id}`);
                done();
              });
          });
        });
      });
    });
  });

  describe('DELETE /articles/:slug/comments/:id', () => {
    it('it should DELETE a comment by given id of an article by given slug', (done) => {
      newArticle.save((err, article) => {
        newComment.save((err, comment) => {
          article.comments.push(comment);
          article.save((err, article) => {
            chai.request(server)
              .delete(`/articles/${article.slug}/comments/${comment._id}`)
              .set(config.apiKeyHeader, config.apiKey)
              .end((err, res) => {
                res.should.have.status(204);
                done();
              });
          });
        });
      });
    });
  });
});
