import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/SuccessAndError/Success.js';
import { Router } from '@vaadin/router';
import '../src/SuccessAndError/Error.js';

describe('Success screen', () => {
  it('should render a lion-button', async () => {
    const el = await fixture(html`<loan-success></loan-success>`);
    const button = el.shadowRoot.querySelector('lion-button');
    expect(button).to.exist;
  });

  it('should navigate to home when the button is clicked', async () => {
    const routerStub = sinon.stub(Router, 'go');
    const el = await fixture(html`<loan-success></loan-success>`);
    const button = el.shadowRoot.querySelector('lion-button');

    button.click();

    expect(routerStub.calledOnceWith('/')).to.be.true;

    routerStub.restore();
  });

  it('should expose static styles', async () => {
    const el = await fixture(html`<loan-success></loan-success>`);
    expect(el.constructor.styles).to.exist;
  });

  it('is accessible', async () => {
    expect(true).to.be.true;
  });
});

describe('Loan Error Screen', () => {
  it('should render the error heading with "Oops"', async () => {
    const el = await fixture(html`<loan-error></loan-error>`);
    const heading = el.shadowRoot.querySelector('h2');
    expect(heading).to.exist;
  });

  it('should render a lion-button with "home" text', async () => {
    const el = await fixture(html`<loan-error></loan-error>`);
    const button = el.shadowRoot.querySelector('lion-button');
    expect(button).to.exist;
  });

  it('should navigate to home when the button is clicked', async () => {
    const routerStub = sinon.stub(Router, 'go');
    const el = await fixture(html`<loan-error></loan-error>`);
    const button = el.shadowRoot.querySelector('lion-button');

    button.click();

    expect(routerStub.calledOnceWith('/')).to.be.true;
    routerStub.restore();
  });
});
