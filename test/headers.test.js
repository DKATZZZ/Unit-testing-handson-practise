import { html, fixture, expect } from '@open-wc/testing';
import '../src/header/Header.js';

describe('loan-header', () => {
  let instance, enButton, nlButton;

  beforeEach(async () => {
    instance = await fixture(html`<loan-header></loan-header>`);
    enButton = instance.shadowRoot.getElementById('en-GB');
    nlButton = instance.shadowRoot.getElementById('nl-NL');
    expect(enButton).to.exist;
    expect(nlButton).to.exist;
  });

  it('checks buttons and labels', () => {
    expect(enButton.textContent.trim()).to.equal('EN');
    expect(nlButton.textContent.trim()).to.equal('NL');
  });

  it('checks EN has active class by default', () => {
    expect(enButton.classList.contains('bg-btn-color')).to.be.true;
    expect(nlButton.classList.contains('bg-btn-color')).to.be.false;
  });

  it('when NL button is clicked', () => {
    nlButton.click();
    expect(nlButton.classList.contains('bg-btn-color')).to.be.true;
    expect(nlButton.classList.contains('btn-cursor')).to.be.false;
    expect(enButton.classList.contains('bg-btn-color')).to.be.false;
    expect(enButton.classList.contains('btn-cursor')).to.be.true;
  });

  it('when EN button is clicked', () => {
    enButton.click();
    expect(enButton.classList.contains('bg-btn-color')).to.be.true;
    expect(enButton.classList.contains('btn-cursor')).to.be.false;
    expect(nlButton.classList.contains('bg-btn-color')).to.be.false;
    expect(nlButton.classList.contains('btn-cursor')).to.be.true;
  });
});