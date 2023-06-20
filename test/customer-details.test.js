import { html, fixture, expect } from '@open-wc/testing';

import '../src/Customer/Customer-details.js';

describe('customer details', () => {
  it('Trail and error test case', async () => {
    const el = await fixture(html`<customer-details></customer-details>`);
    const inputElement = el.shadowRoot.querySelector('lion-input');

    expect(inputElement.type).to.equal('text');
  });
});