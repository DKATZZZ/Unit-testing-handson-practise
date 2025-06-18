import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/Customer/Customer-details.js';

describe('customer details', () => {
  // Write test cases inside this block
  it('First Name', async () => {
    const customer = await fixture(html`<customer-details></customer-details>`);
    const item = customer.shadowRoot.querySelector('lion-input');
    expect(item.name).to.exist;
    expect(item.label).to.exist;
  });
});
