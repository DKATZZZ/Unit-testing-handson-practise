import { html, fixture, expect } from '@open-wc/testing';

import '../loan-application.js';

describe('LoanApplication', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<loan-application></loan-application>`);
  });

  it('should check component accessibility', () => {
    expect(element).to.be.accessible;
  });

  it('should render and includes dash-board', () => {
    const dashboard = element.shadowRoot.querySelector('dash-board');

    expect(element).to.be.accessible;
    expect(dashboard).to.be.accessible;
  });

  it('should default title and counter values', () => {
    expect(element.title).to.equal('Hey there');
    expect(element.counter).to.equal(5);
  });
});
