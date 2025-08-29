import { html, fixture, expect } from '@open-wc/testing';
import '../loan-application.js';

describe('LoanApplication Component', () => {
  let el;

  beforeEach(async () => {
    el = await fixture(html`<loan-application></loan-application>`);
  });

  it('should have default properties: title "Hey there" and counter 5', () => {
    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('should allow overriding the title via attribute', async () => {
    const elAttr = await fixture(
      html`<loan-application title="Custom Title"></loan-application>`
    );
    expect(elAttr.title).to.equal('Custom Title');
  });

  it('should increment the counter when __increment() is called', () => {
    el.__increment();
    expect(el.counter).to.equal(6);
  });

  it('should render a <dash-board> element inside the shadow DOM', () => {
    const dashboardEl = el.shadowRoot.querySelector('dash-board');
    expect(dashboardEl).to.exist;
  });

  it('should pass accessibility audit', () => {
    expect(el).shadowDom.to.be.accessible();
  });
});
