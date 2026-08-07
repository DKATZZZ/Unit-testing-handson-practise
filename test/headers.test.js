import { html, fixture, expect } from '@open-wc/testing';
import { localize } from '@lion/localize';
import '../src/header/Header'; 

describe('Header Component', () => {
  let element;

  beforeEach(async () => {
    localize.locale = 'en-GB';

    element = await fixture(html`<loan-header></loan-header>`);
  });

  // 1. RENDER & INITIAL DOM STATE
  describe('Render & Initial State', () => {
    it('renders header, title paragraph, and language buttons', () => {
      expect(element).to.exist;

      const header = element.shadowRoot.querySelector('header');
      const title = element.shadowRoot.querySelector('header p');
      const enBtn = element.shadowRoot.querySelector('#en-GB');
      const nlBtn = element.shadowRoot.querySelector('#nl-NL');

      expect(header).to.exist;
      expect(title).to.exist;
      expect(enBtn).to.exist;
      expect(nlBtn).to.exist;
    });

    it('sets initial button active/cursor classes correctly for en-GB', () => {
      const enBtn = element.shadowRoot.querySelector('#en-GB');
      const nlBtn = element.shadowRoot.querySelector('#nl-NL');

      expect(enBtn.classList.contains('bg-btn-color')).to.be.true;
      expect(enBtn.classList.contains('btn-cursor')).to.be.false;

      expect(nlBtn.classList.contains('bg-btn-color')).to.be.false;
      expect(nlBtn.classList.contains('btn-cursor')).to.be.true;
    });
  });

  // 2. LANGUAGE SWITCHING (localeChanged)
  describe('Language Switching', () => {
  it('switches locale to nl-NL when NL button is clicked', async () => {
    const enBtn = element.shadowRoot.querySelector('#en-GB');
    const nlBtn = element.shadowRoot.querySelector('#nl-NL');

    nlBtn.click();
    await element.updateComplete;

    expect(localize.locale).to.equal('nl-NL');
    expect(nlBtn.classList.contains('bg-btn-color')).to.be.true;
    expect(enBtn.classList.contains('btn-cursor')).to.be.true;
  });

  it('switches back to en-GB when EN button is clicked after NL (Hits lines 80-84)', async () => {
    const enBtn = element.shadowRoot.querySelector('#en-GB');
    const nlBtn = element.shadowRoot.querySelector('#nl-NL');

    // 1. First switch to NL (adds 'btn-cursor' to enBtn)
    nlBtn.click();
    await element.updateComplete;

    // 2. Now click EN (this triggers lines 80-84!)
    enBtn.click();
    await element.updateComplete;

    expect(localize.locale).to.equal('en-GB');
    expect(enBtn.classList.contains('bg-btn-color')).to.be.true;
    expect(nlBtn.classList.contains('btn-cursor')).to.be.true;
  });

  it('does not execute language change if clicking an already active button', async () => {
    const enBtn = element.shadowRoot.querySelector('#en-GB');
    const spy = sinon.spy(localize, 'locale', ['set']);

    // en-GB is active initially (doesn't have 'btn-cursor'), so click should be ignored
    enBtn.click();
    await element.updateComplete;

    // Proves lines 80-84 & 89-94 were completely bypassed!
    expect(spy.set.called).to.be.false;

    spy.set.restore();
  });
});
});