/* eslint-disable */
const chai = require('chai');

const expect = chai.expect;

const renameObjectProperty = require('../../src/helpers/renameObjectProperty');

describe('HELPER renameObjectProperty', () => {
  let object = {};
  let correctObject = {};

  beforeEach((done) => {
    object = { firstName: 'Jane', lastname: 'Doe' };
    correctObject = { firstName: 'Jane', lastName: 'Doe' };
    done();
  });

  it('it should rename an object property', (done) => {
    renameObjectProperty(object, 'lastname', 'lastName');
    expect(object).to.deep.equal(correctObject);
    done();
  });

  it('it should not rename an object property if the property does not exist', (done) => {
    renameObjectProperty(object, 'lastName', 'LastName');
    expect(object).to.deep.equal(object);
    done();
  });
})
