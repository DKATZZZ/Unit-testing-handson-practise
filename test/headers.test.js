import { html, fixture, expect } from '@open-wc/testing';
import sinon, { stub } from 'sinon';
import { Header } from '../src/header/Header.js';
import { localize } from '@lion/localize';
let element;

beforeEach(async () => {
  element = await fixture(html`<loan-header></loan-header>`);
});

afterEach(() => {
  sinon.restore();
});
describe('loan-header', () => {
  it('should check component accessibility', () => {
    expect(element).to.be.accessible;
  });

  it('should render the header with all required elements', async () => {
    expect(element).to.exist;

    const container = element.shadowRoot.querySelector('.container');
    expect(container).to.exist;

    const header = element.shadowRoot.querySelector('header');
    expect(header).to.exist;

    const heading = element.shadowRoot.querySelector('header p');
    expect(heading).to.exist;

    const enButton = element.shadowRoot.querySelector('#en-GB');
    const nlButton = element.shadowRoot.querySelector('#nl-NL');

    expect(enButton).to.exist;
    expect(nlButton).to.exist;
    expect(enButton.textContent.trim()).to.equal('EN');
    expect(nlButton.textContent.trim()).to.equal('NL');
  });

  it('should have correct CSS classes and structure', async () => {
    const container = element.shadowRoot.querySelector('.container');
    expect(container).to.exist;

    const header = element.shadowRoot.querySelector('header');
    expect(header).to.exist;

    const btnContainer = element.shadowRoot.querySelector('.btn');
    expect(btnContainer).to.exist;

    const buttonsInContainer = btnContainer.querySelectorAll('button');
    expect(buttonsInContainer).to.have.lengthOf(2);

    const enButton = btnContainer.querySelector('#en-GB');
    const nlButton = btnContainer.querySelector('#nl-NL');

    expect(enButton.id).to.equal('en-GB');
    expect(nlButton.id).to.equal('nl-NL');

    expect(enButton).to.have.property('onclick');
    expect(nlButton).to.have.property('onclick');
  });

  it('should have correct initial styling for language buttons', async () => {
    const enButton = element.shadowRoot.querySelector('#en-GB');
    const nlButton = element.shadowRoot.querySelector('#nl-NL');

    expect(enButton.classList.contains('en-GB')).to.be.true;
    expect(enButton.classList.contains('bg-btn-color')).to.be.true;

    expect(nlButton.classList.contains('nl-NL')).to.be.true;
    expect(nlButton.classList.contains('btn-cursor')).to.be.true;
  });
});
