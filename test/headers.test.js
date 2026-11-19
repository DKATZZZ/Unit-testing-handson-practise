import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import { localize } from '@lion/localize';
import '../src/header/Header.js';

describe('loan-header', () => {
  const originalLocale = localize.locale;

  let el;
  let enButton;
  let nlButton;

  beforeEach(async () => {
    localize.locale = 'en-GB';
    el = await fixture(html`<loan-header></loan-header>`);

    if (el.localizeNamespacesLoaded) {
      el.localizeNamespacesLoaded.catch(() => { });
    }

    enButton = el.shadowRoot.getElementById('en-GB');
    nlButton = el.shadowRoot.getElementById('nl-NL');
  });

  afterEach(() => {
    localize.locale = originalLocale;
  });

  it('renders the localized application heading', () => {
    expect(el.shadowRoot.querySelector('p').textContent.trim()).to.equal(
      'Apply Loan',
    );
  });

  it('renders an EN and an NL language button', () => {
    expect(enButton).to.exist;
    expect(nlButton).to.exist;
    expect(enButton.textContent.trim()).to.equal('EN');
    expect(nlButton.textContent.trim()).to.equal('NL');
  });

  it('starts with English selected and Dutch offered', () => {
    expect(enButton.classList.contains('bg-btn-color')).to.be.true;
    expect(enButton.classList.contains('btn-cursor')).to.be.false;
    expect(nlButton.classList.contains('btn-cursor')).to.be.true;
    expect(nlButton.classList.contains('bg-btn-color')).to.be.false;
  });

  it('switches the global locale to nl-NL when NL is clicked', async () => {
    nlButton.click();
    await el.updateComplete;
    expect(localize.locale).to.equal('nl-NL');
  });

  it('swaps the highlight and the cursor when NL is clicked', async () => {
    nlButton.click();
    await el.updateComplete;

    expect(nlButton.classList.contains('bg-btn-color')).to.be.true;
    expect(nlButton.classList.contains('btn-cursor')).to.be.false;
    expect(enButton.classList.contains('bg-btn-color')).to.be.false;
    expect(enButton.classList.contains('btn-cursor')).to.be.true;
  });

  it('translates the heading into Dutch when NL is clicked', async () => {
    nlButton.click();
    await aTimeout(0);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('p').textContent.trim()).to.equal(
      'Lening toepassen',
    );
  });

  it('switches back to en-GB when EN is clicked afterwards', async () => {
    nlButton.click();
    await el.updateComplete;
    enButton.click();
    await aTimeout(0);
    await el.updateComplete;

    expect(localize.locale).to.equal('en-GB');
    expect(enButton.classList.contains('bg-btn-color')).to.be.true;
    expect(el.shadowRoot.querySelector('p').textContent.trim()).to.equal(
      'Apply Loan',
    );
  });

  it('ignores a click on the language that is already selected', async () => {
    enButton.click();
    await el.updateComplete;

    expect(localize.locale).to.equal('en-GB');
    expect(nlButton.classList.contains('btn-cursor')).to.be.true;
    expect(nlButton.classList.contains('bg-btn-color')).to.be.false;
  });

  it('is accessible', async () => {
    await expect(el).to.be.accessible();
  });
});
