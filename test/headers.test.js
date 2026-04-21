import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import sinon from 'sinon';
import '../src/header/Header.js';

async function waitForLocale(el) {
  await el.updateComplete;
  await new Promise(r => setTimeout(r, 80));
  await el.updateComplete;
}

describe('loan-header', () => {
  afterEach(() => sinon.restore());

  // ── Rendering ─────────────────────────────────────────────────────────────
  describe('Rendering', () => {
    it('is defined as a custom element', () => {
      expect(customElements.get('loan-header')).to.not.be.undefined;
    });

    it('renders without throwing', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it('renders the <header> element', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      expect(el.shadowRoot.querySelector('header')).to.exist;
    });

    it('renders the EN (#en-GB) language button', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      expect(el.shadowRoot.querySelector('#en-GB')).to.exist;
    });

    it('renders the NL (#nl-NL) language button', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      expect(el.shadowRoot.querySelector('#nl-NL')).to.exist;
    });

    it('EN button has .bg-btn-color (active) by default', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      expect(el.shadowRoot.querySelector('#en-GB').classList.contains('bg-btn-color')).to.be.true;
    });

    it('NL button has .btn-cursor (inactive) by default', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      expect(el.shadowRoot.querySelector('#nl-NL').classList.contains('btn-cursor')).to.be.true;
    });

    it('renders the .container div', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      expect(el.shadowRoot.querySelector('.container')).to.exist;
    });

    it('passes the a11y audit', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      await waitForLocale(el);
      await expect(el).to.be.accessible();
    });
  });

  // ── Localised Heading ─────────────────────────────────────────────────────
  describe('Localised Heading (en-GB)', () => {
    it('renders non-empty heading text after locale loads', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      await waitForLocale(el);
      const heading = el.shadowRoot.querySelector('header p');
      expect(heading).to.exist;
      expect(heading.textContent.trim().length).to.be.greaterThan(0);
    });

    it('heading contains "Apply Loan" (en-GB locale)', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      await waitForLocale(el);
      const heading = el.shadowRoot.querySelector('header p');
      expect(heading.textContent).to.include('Apply Loan');
    });
  });

  // ── Locale Switching ──────────────────────────────────────────────────────
  describe('localeChanged()', () => {
    it('NL button gains .bg-btn-color after NL is clicked', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      el.shadowRoot.querySelector('#nl-NL').click();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector('#nl-NL').classList.contains('bg-btn-color')).to.be.true;
    });

    it('NL button loses .btn-cursor after NL is clicked', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      el.shadowRoot.querySelector('#nl-NL').click();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector('#nl-NL').classList.contains('btn-cursor')).to.be.false;
    });

    it('EN button loses .bg-btn-color after NL is clicked', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      el.shadowRoot.querySelector('#nl-NL').click();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector('#en-GB').classList.contains('bg-btn-color')).to.be.false;
    });

    it('EN button gains .btn-cursor after NL is clicked', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      el.shadowRoot.querySelector('#nl-NL').click();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector('#en-GB').classList.contains('btn-cursor')).to.be.true;
    });

    it('switches back to EN active state when EN is clicked after NL', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      el.shadowRoot.querySelector('#nl-NL').click();
      await el.updateComplete;
      el.shadowRoot.querySelector('#en-GB').click();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector('#en-GB').classList.contains('bg-btn-color')).to.be.true;
      expect(el.shadowRoot.querySelector('#nl-NL').classList.contains('btn-cursor')).to.be.true;
    });

    it('clicking EN while already active is a no-op', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      el.shadowRoot.querySelector('#en-GB').click();
      await el.updateComplete;
      // EN should still be active — state unchanged
      expect(el.shadowRoot.querySelector('#en-GB').classList.contains('bg-btn-color')).to.be.true;
    });

    it('calls localeChanged when NL button is clicked', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      const spy = sinon.spy(el, 'localeChanged');
      el.shadowRoot.querySelector('#nl-NL').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await el.updateComplete;
      expect(spy.called).to.be.true;
    });

    it('calls localeChanged when EN button is clicked (after NL was active)', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      // Activate NL first so EN becomes clickable
      el.shadowRoot.querySelector('#nl-NL').click();
      await el.updateComplete;
      const spy = sinon.spy(el, 'localeChanged');
      el.shadowRoot.querySelector('#en-GB').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await el.updateComplete;
      expect(spy.called).to.be.true;
    });
  });

  // ── Sinon Stub ────────────────────────────────────────────────────────────
  describe('Sinon – stub localeChanged side-effects', () => {
    it('stubbing localeChanged prevents DOM class changes', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      const localeStub = stub(el, 'localeChanged');

      el.shadowRoot.querySelector('#nl-NL').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await el.updateComplete;

      // The stub intercepts the call, so DOM class should stay unchanged
      expect(localeStub.calledOnce).to.be.true;
      expect(el.shadowRoot.querySelector('#en-GB').classList.contains('bg-btn-color')).to.be.true;
    });
  });
});
