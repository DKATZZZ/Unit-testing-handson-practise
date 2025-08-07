import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

describe('Success screen', () => {
  let element;
  let routerStub;
  let fetchStub;

  beforeEach(async () => {
    element = await fixture(html`<loan-success></loan-success>`);
    routerStub = sinon.stub(Router, 'go');
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    routerStub.restore();
    fetchStub.restore();
  });
  it('should render heading and description', () => {
    const heading = element.shadowRoot.querySelector('h2');
    const paragraph = element.shadowRoot.querySelector('p');

    expect(heading).to.be.accessible;
    expect(paragraph).to.be.accessible;
  });

  it('should render a button with correct class and label', () => {
    const button = element.shadowRoot.querySelector('lion-button');

    expect(button).to.be.accessible;
    expect(button.classList.contains('home-btn')).to.be.true;
  });

  it('should navigate to home / on button click', () => {
    const button = element.shadowRoot.querySelector('lion-button');

    button.click();

    expect(routerStub.calledOnceWith('/')).to.be.true;
  });
});

describe('error screen', () => {
  let element;

  let routerStub;
  let fetchStub;

  beforeEach(async () => {
    element = await fixture(html`<loan-error></loan-error>`);
    routerStub = sinon.stub(Router, 'go');
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    routerStub.restore();
    fetchStub.restore();
  });
  it('should render heading, paragraph, and button', () => {
    const heading = element.shadowRoot.querySelector('h2');
    const paragraph = element.shadowRoot.querySelector('p');
    const button = element.shadowRoot.querySelector('lion-button');

    expect(heading).to.exist;
    expect(paragraph).to.exist;
    expect(button).to.exist;
  });

  it('should navigate to home / on button click', () => {
    const button = element.shadowRoot.querySelector('lion-button');

    button.click();

    expect(routerStub.calledOnceWith('/')).to.be.true;
  });
});
