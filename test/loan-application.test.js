import { html, fixture, expect } from '@open-wc/testing';

import '../loan-application.js';

describe('LoanApplication', () => {
    it('has a default title "Hey there"', async () => {
        const el = await fixture(html`<loan-application></loan-application>`);
        expect(el.title).to.equal('Hey there');
      });
    
      it('can override the title via attribute', async () => {
        const el = await fixture(html`<loan-application title="different"></loan-application>`);
        expect(el.title).to.equal('different');
      });
    
      it('increments the counter on button click', async () => {
        const el = await fixture(html`<loan-application></loan-application>`);
        el.shadowRoot.querySelector('button').click();
        expect(el.counter).to.equal(6);
      });
    
      it('passes properties to dashboard component', async () => {
        const el = await fixture(html`<loan-application></loan-application>`);
        const dashboard = el.shadowRoot.querySelector('dash-board');
        expect(dashboard).to.exist;
        expect(dashboard.title).to.equal(el.title);
        expect(dashboard.counter).to.equal(el.counter);
      });
});
