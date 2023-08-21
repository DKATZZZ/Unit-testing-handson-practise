import { html, fixture, expect} from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/LoanBasicDetails/BasicDetails.js';

describe('Basic details test default values', () => {
  let basicDetails;

  beforeEach(() => {
    basicDetails = document.createElement('basic-details');
    document.body.appendChild(basicDetails);
  });

  afterEach(() => {
    document.body.removeChild(basicDetails);
  });

  it('should have default values after construction', () => {
    expect(basicDetails.amount).to.equal(10000);
  });
  it('should have default values after construction', () => {
    expect(basicDetails.range).to.equal(2);
  });
  it('should have default values after construction', () => {
    expect(basicDetails.emiCalc).to.equal(0);
  });
  it('should have default values after construction', () => {
    expect(basicDetails.type).to.equal(null);
  });

});
