import { html, fixture, expect } from '@open-wc/testing';
import '../loan-application.js';

describe('LoanApplication', () => {
  let el;

  beforeEach(async () => {
    el = await fixture(html`<loan-application></loan-application>`);
  });

  it('is defined as a custom element', () => {
    expect(customElements.get('loan-application')).to.not.be.undefined;
  });

  it('renders without throwing', () => {
    expect(el).to.exist;
  });

  it('has a shadow root', () => {
    expect(el.shadowRoot).to.exist;
  });

  it('renders the dash-board child component', () => {
    const dashboard = el.shadowRoot.querySelector('dash-board');
    expect(dashboard).to.exist;
  });

  it('has default title property "Hey there"', () => {
    expect(el.title).to.equal('Hey there');
  });

  it('has default counter property of 5', () => {
    expect(el.counter).to.equal(5);
  });

  it('increments counter when __increment() is called', () => {
    el.__increment();
    expect(el.counter).to.equal(6);
  });

  it('increments counter multiple times correctly', () => {
    el.__increment();
    el.__increment();
    el.__increment();
    expect(el.counter).to.equal(8);
  });

  it('reflects title attribute change', async () => {
    el.title = 'New Title';
    await el.updateComplete;
    expect(el.title).to.equal('New Title');
  });

  it('reflects counter property update', async () => {
    el.counter = 99;
    await el.updateComplete;
    expect(el.counter).to.equal(99);
  });

  it('passes the a11y audit', async () => {
    await expect(el).to.be.accessible();
  });
});
