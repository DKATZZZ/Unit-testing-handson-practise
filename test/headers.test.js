import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/header/Header.js';

describe('loan-header', () => {
  it('is defined', async () => {
    const element = await fixture(html`<loan-header></loan-header>`);
    expect(element).dom.exist;
  });
  it('calls localeChanged function when a button is clicked', async () => {
    const element= await fixture(html`<loan-header></loan-header>`);
    const myFunctionStub = stub(element, 'localeChanged');
    element.requestUpdate();
    await element.updateComplete;
    element.shadowRoot.querySelector('button').click();
    expect(myFunctionStub).to.have.callCount(1);
  });
  
});