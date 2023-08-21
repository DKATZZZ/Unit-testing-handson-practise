import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

describe('Success screen ', () => {
  it('renders the component', async () => {
    const el = await fixture(html`<loan-success></loan-success>`);
    expect(el).shadowDom.to.be.accessible();
  });

  it('displays success message', async () => {
    const el = await fixture(html`<loan-success></loan-success>`);
    const successMessage = el.shadowRoot.querySelector('p');
    expect(successMessage.textContent).to.include('');
  });

});

describe('error screen', () => {

  it('renders the component', async () => {
    const el = await fixture(html`<loan-error></loan-error>`);
    expect(el).shadowDom.to.be.accessible();
  });

  it('displays error message', async () => {
    const el = await fixture(html`<loan-error></loan-error>`);
    const errorMessage = el.shadowRoot.querySelector('p');
    expect(errorMessage.textContent).to.include('');
  });

});
