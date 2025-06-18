import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../loan-application.js';

describe('LoanApplication', () => {
  let el;

  beforeEach(async () => {
    el = await fixture(html`<loan-application></loan-application>`);
  });

  it('should have default title and counter', () => {
    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('should render dashboard component', () => {
    const dashboard = el.shadowRoot.querySelector('dash-board');
    expect(dashboard).to.exist;
  });

  it('should increment the counter when __increment is called', () => {
    el.__increment();
    expect(el.counter).to.equal(6);
  });

  it('should reflect updated counter on multiple __increment calls', () => {
    el.__increment();
    el.__increment();
    expect(el.counter).to.equal(7);
  });

  it('is accessible', async () => {
    await expect(el).to.be.accessible();
  });
});
