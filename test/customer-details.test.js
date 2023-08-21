import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/Customer/Customer-details.js';

describe('customer details', () => {
  it('renders the component', async () => {
    const el = await fixture(html`<customer-details></customer-details>`);
    expect(el).shadowDom.to.be.accessible();
  });

  it('submits the form successfully', async () => {
    const el = await fixture(html`<customer-details></customer-details>`);
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));
  });
});
