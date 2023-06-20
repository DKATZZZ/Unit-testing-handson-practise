import { html, fixture, expect } from '@open-wc/testing';
import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

describe('Success screen ', () => {
  it('is defined', async () => {
    const element = await fixture(html`<loan-error></loan-error>`);
    expect(element).dom.exist;
  });
  
});

describe('error screen', () => {
  it('is defined', async () => {
    const element = await fixture(html`<loan-success></loan-success>`);
    expect(element).dom.exist;
  });
 
});