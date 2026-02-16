import { html, fixture, expect } from '@open-wc/testing';
import '../loan-application.js';

describe('LoanApplication', () => {
  let element;
  before(async () => {
    element = await fixture(html`<loan-application></loan-application>`);
  });

  it('should check component accessibility', () => {
    expect(element).to.be.accessible;
  });

  it('should check for counter value', () => {
    expect(element.counter).to.equal(5);
  });
});
