import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/header/Header.js';

describe('loan-header', () => {
  // it('Should dusplay Apply Loan on initial Load', function () {
  //   expect('Apply Loan').to.equal('Apply Loan');
  // });

  it('should render header text from localization', async () => {
    const el = await fixture(html`<loan-header></loan-header>`);
    const headerText = el.shadowRoot.querySelector('p').textContent.trim();

    //en-GB by default
    expect(headerText).to.equal('Apply Loan');
  });

  it('should change language to Dutch when NL button clicked', async () => {
    const el = await fixture(html`<loan-header></loan-header>`);

    const nlButton = el.shadowRoot.getElementById('nl-NL');
    nlButton.click();

    await el.updateComplete;

    const enButton = el.shadowRoot.getElementById('en-GB');

    expect(nlButton.classList.contains('bg-btn-color')).to.be.true;
    expect(enButton.classList.contains('btn-cursor')).to.be.true;
  });

  it('should change language back to English when EN button clicked after NL', async () => {
    const el = await fixture(html`<loan-header></loan-header>`);
    const nlButton = el.shadowRoot.getElementById('nl-NL');
    const enButton = el.shadowRoot.getElementById('en-GB');

    nlButton.click(); // First click to set Dutch
    await el.updateComplete;

    enButton.click(); // Then back to English
    await el.updateComplete;

    expect(enButton.classList.contains('bg-btn-color')).to.be.true;
    expect(nlButton.classList.contains('btn-cursor')).to.be.true;
  });
});
