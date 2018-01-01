/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const server = require('../../bin/server');
const config = require('../../config');

chai.use(chaiHttp);

describe('MIDDLEWARE checkApiKey', () => {
  it('it should return a 403 error if no API key is provided', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(403);
        res.should.be.a('object');
        done();
      });
  });

  it('it should return a 401 error if the provided API key is wrong', (done) => {
    chai.request(server)
      .get('/')
      .set(config.apiKeyHeader, 'ThisIsAWrongAPIKey')
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.a('object');
        done();
      });
  });

  it('it should get through the security middleware if the provided API key is correct', (done) => {
    chai.request(server)
      .get('/')
      .set(config.apiKeyHeader, config.apiKey)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        done();
      });
  });
});
