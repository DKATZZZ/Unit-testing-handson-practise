import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

describe('Success screen', () => {
  let instance;

  beforeEach(async () => {
    instance = await fixture(html`<loan-success></loan-success>`);
  });

  it('checks heading and paragraph rendering', () => {
    const heading = instance.shadowRoot.querySelector('h2');
    const paragraph = instance.shadowRoot.querySelector('p');
    expect(heading).to.exist;
    expect(paragraph).to.exist;
  });

  it('checks button rendering and class', () => {
    const button = instance.shadowRoot.querySelector('lion-button');
    expect(button).to.exist;
    expect(button.classList.contains('home-btn')).to.be.true;
  });

  it('checks navigation on button click', () => {
    const routerStub = sinon.stub(Router, 'go');
    const button = instance.shadowRoot.querySelector('lion-button');
    button.click();
    expect(routerStub.calledOnceWith('/')).to.be.true;
    routerStub.restore(); 
  });
});

describe('error screen', () => {
  let instance;

  beforeEach(async () => {
    instance = await fixture(html`<loan-error></loan-error>`);
  });

  it('checks heading, paragraph, and button rendering', () => {
    const heading = instance.shadowRoot.querySelector('h2');
    const paragraph = instance.shadowRoot.querySelector('p');
    const button = instance.shadowRoot.querySelector('lion-button');
    expect(heading).to.exist;
    expect(paragraph).to.exist;
    expect(button).to.exist;
  });

  it('checks button rendering and class', () => {
    const button = instance.shadowRoot.querySelector('lion-button');
    expect(button).to.exist;
    expect(button.classList.contains('home-btn')).to.be.true;
  });

  it('checks navigation on button click', () => {
    const routerStub = sinon.stub(Router, 'go');
    const button = instance.shadowRoot.querySelector('lion-button');
    button.click();
    expect(routerStub.calledOnceWith('/')).to.be.true;
    routerStub.restore();
  });
});