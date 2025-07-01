import { html, fixture, expect } from '@open-wc/testing';

import '../loan-application.js';

describe('LoanApplication', () => {
  it('renders and includes dash-board', () => {
    return fixture(html`<loan-application></loan-application>`).then(el => {
      const dashboard = el.shadowRoot.querySelector('dash-board');

      expect(el).to.exist;
      expect(dashboard).to.exist;
    });
  });

  it('default title and counter values', () => {
    return fixture(html`<loan-application></loan-application>`).then(el => {
      expect(el.title).to.equal('Hey there');
      expect(el.counter).to.equal(5);
    });
  });

  it('increments counter using increment method', () => {
    return fixture(html`<loan-application></loan-application>`).then(el => {
      el.__increment();
      expect(el.counter).to.equal(6);
    });
  });
});
