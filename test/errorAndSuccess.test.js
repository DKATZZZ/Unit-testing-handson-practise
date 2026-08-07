import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';

import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

describe('Success screen', () => {
  let element;
  let routerStub;

  beforeEach(async () => {
    element = await fixture(html`<loan-success></loan-success>`);
    routerStub = sinon.stub(Router, 'go');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('renders initial UI elements correctly (heading, description, and button)', () => {
    expect(element).to.exist;

    const heading = element.shadowRoot.querySelector('h2');
    const paragraph = element.shadowRoot.querySelector('p');
    const homeBtn = element.shadowRoot.querySelector('.home-btn');

    expect(heading).to.exist;
    expect(paragraph).to.exist;
    expect(homeBtn).to.exist;
  });

  it('navigates to dashboard "/" when the home button is clicked', () => {
    const homeBtn = element.shadowRoot.querySelector('.home-btn');

    homeBtn.click();

    expect(routerStub.calledOnce).to.be.true;
    expect(routerStub.calledWith('/')).to.be.true;
  });
});


describe('error screen', () => {
  let element;
  let routerStub;

  beforeEach(async () => {
    element = await fixture(html`<loan-error></loan-error>`);
    routerStub = sinon.stub(Router, 'go');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('renders initial UI elements correctly (heading, description, and button)', () => {
    expect(element).to.exist;

    const heading = element.shadowRoot.querySelector('h2');
    const paragraph = element.shadowRoot.querySelector('p');
    const homeBtn = element.shadowRoot.querySelector('.home-btn');

    expect(heading).to.exist;
    expect(paragraph).to.exist;
    expect(homeBtn).to.exist;
  });

  it('navigates to dashboard "/" when the home button is clicked', () => {
    const homeBtn = element.shadowRoot.querySelector('.home-btn');

    homeBtn.click();

    expect(routerStub.calledOnce).to.be.true;
    expect(routerStub.calledWith('/')).to.be.true;
  });
});