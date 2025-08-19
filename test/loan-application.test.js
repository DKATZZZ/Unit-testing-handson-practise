import { html, fixture, expect } from '@open-wc/testing';
import '../loan-application.js';

describe('LoanApplication', () => {
  let instance;

  beforeEach(async () => {
    instance = await fixture(html`<loan-application></loan-application>`);
  });

  it('checks if dash-board is rendered', () => {
    const dashboard = instance.shadowRoot.querySelector('dash-board');
    expect(dashboard).to.exist;
  });

  it('checks default values', () => {
    expect(instance.title).to.equal('Hey there');
    expect(instance.counter).to.equal(5);
  });

  it('checks increment functionality', () => {
    instance.__increment();
    expect(instance.counter).to.equal(6);
  });
});