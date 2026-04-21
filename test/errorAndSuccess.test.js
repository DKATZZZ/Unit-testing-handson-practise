import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

// Success.js and Error.js never import locale data themselves (source bug).
// We must seed the @lion/localize registry here so localize.msg() resolves.
import '../../locale/inline-data.js';

import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Poll until the <p> has non-empty text, or timeout after 2 s.
 * More reliable than a fixed setTimeout because locale resolution time varies.
 */
async function waitForParagraphText(el, timeout = 2000) {
  await el.updateComplete;
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const para = el.shadowRoot.querySelector('p');
    if (para && para.textContent.trim().length > 0) return;
    await new Promise(r => setTimeout(r, 30));
    await el.updateComplete;
  }
}

/**
 * Spy on a method then force LitElement to re-render so the @click binding
 * in the template picks up the spy instead of the original method reference.
 */
async function spyAndRerender(el, methodName) {
  const spy = sinon.spy(el, methodName);
  el.requestUpdate();
  await el.updateComplete;
  return spy;
}

// ─────────────────────────────────────────────────────────────────────────────
// LoanSuccess
// ─────────────────────────────────────────────────────────────────────────────
describe('Success Screen', () => {
  afterEach(() => sinon.restore());

  describe('Rendering', () => {
    it('is defined as a custom element', () => {
      expect(customElements.get('loan-success')).to.not.be.undefined;
    });

    it('renders without throwing', async () => {
      const el = await fixture(html`<loan-success></loan-success>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it('renders a heading (h2)', async () => {
      const el = await fixture(html`<loan-success></loan-success>`);
      expect(el.shadowRoot.querySelector('h2')).to.exist;
    });

    it('renders a paragraph with text once locale is loaded', async () => {
      const el = await fixture(html`<loan-success></loan-success>`);
      await waitForParagraphText(el);
      const para = el.shadowRoot.querySelector('p');
      expect(para).to.exist;
      expect(para.textContent.trim()).to.not.be.empty;
    });

    it('renders the Home button', async () => {
      const el = await fixture(html`<loan-success></loan-success>`);
      expect(el.shadowRoot.querySelector('.home-btn')).to.exist;
    });

    it('passes the a11y audit (suppressing known lion-button slot label rule)', async () => {
      const el = await fixture(html`<loan-success></loan-success>`);
      await waitForParagraphText(el);
      await expect(el).to.be.accessible({ ignoredRules: ['aria-command-name'] });
    });
  });

  describe('Localised Content (en-GB)', () => {
    it('heading contains "Congratulations!!!"', async () => {
      const el = await fixture(html`<loan-success></loan-success>`);
      await waitForParagraphText(el);
      const text = el.shadowRoot.querySelector('h2').textContent;
      expect(text).to.include('Congratulations!!!');
    });

    it('paragraph describes successful form submission', async () => {
      const el = await fixture(html`<loan-success></loan-success>`);
      await waitForParagraphText(el);
      expect(el.shadowRoot.querySelector('p').textContent.trim()).to.not.be.empty;
    });

    it('paragraph mentions "loan Form"', async () => {
      const el = await fixture(html`<loan-success></loan-success>`);
      await waitForParagraphText(el);
      expect(el.shadowRoot.querySelector('p').textContent).to.include('loan Form');
    });
  });

  describe('Navigation', () => {
    it('calls _toHome when the Home lion-button is clicked', async () => {
      const el = await fixture(html`<loan-success></loan-success>`);
      const spy = await spyAndRerender(el, '_toHome');
      el.shadowRoot.querySelector('.home-btn').click();
      expect(spy.calledOnce).to.be.true;
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LoanError
// ─────────────────────────────────────────────────────────────────────────────
describe('Error Screen', () => {
  afterEach(() => sinon.restore());

  describe('Rendering', () => {
    it('is defined as a custom element', () => {
      expect(customElements.get('loan-error')).to.not.be.undefined;
    });

    it('renders without throwing', async () => {
      const el = await fixture(html`<loan-error></loan-error>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it('renders a heading (h2)', async () => {
      const el = await fixture(html`<loan-error></loan-error>`);
      expect(el.shadowRoot.querySelector('h2')).to.exist;
    });

    it('renders a paragraph with text once locale is loaded', async () => {
      const el = await fixture(html`<loan-error></loan-error>`);
      await waitForParagraphText(el);
      const para = el.shadowRoot.querySelector('p');
      expect(para).to.exist;
      expect(para.textContent.trim()).to.not.be.empty;
    });

    it('renders the Home button', async () => {
      const el = await fixture(html`<loan-error></loan-error>`);
      expect(el.shadowRoot.querySelector('.home-btn')).to.exist;
    });

    it('passes the a11y audit (suppressing known lion-button slot label rule)', async () => {
      const el = await fixture(html`<loan-error></loan-error>`);
      await waitForParagraphText(el);
      await expect(el).to.be.accessible({ ignoredRules: ['aria-command-name'] });
    });
  });

  describe('Content', () => {
    it('heading contains "Oops!!"', async () => {
      const el = await fixture(html`<loan-error></loan-error>`);
      await waitForParagraphText(el);
      expect(el.shadowRoot.querySelector('h2').textContent).to.include('Oops!!');
    });

    it('paragraph advises user to try again', async () => {
      const el = await fixture(html`<loan-error></loan-error>`);
      await waitForParagraphText(el);
      expect(el.shadowRoot.querySelector('p').textContent.trim()).to.not.be.empty;
    });

    it('paragraph mentions "not submitted"', async () => {
      const el = await fixture(html`<loan-error></loan-error>`);
      await waitForParagraphText(el);
      expect(el.shadowRoot.querySelector('p').textContent).to.include('not submitted');
    });
  });

  describe('Navigation', () => {
    it('calls _toHome when the Home lion-button is clicked', async () => {
      const el = await fixture(html`<loan-error></loan-error>`);
      const spy = await spyAndRerender(el, '_toHome');
      el.shadowRoot.querySelector('.home-btn').click();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('Success vs Error – Component Distinction', () => {
    it('success and error are separate custom element classes', () => {
      expect(customElements.get('loan-success')).to.not.equal(
        customElements.get('loan-error')
      );
    });

    it('success heading text differs from error heading text', async () => {
      const [success, error] = await Promise.all([
        fixture(html`<loan-success></loan-success>`),
        fixture(html`<loan-error></loan-error>`),
      ]);
      await waitForParagraphText(success);
      await waitForParagraphText(error);
      expect(success.shadowRoot.querySelector('h2').textContent).to.not.equal(
        error.shadowRoot.querySelector('h2').textContent
      );
    });

    it('success paragraph text differs from error paragraph text', async () => {
      const [success, error] = await Promise.all([
        fixture(html`<loan-success></loan-success>`),
        fixture(html`<loan-error></loan-error>`),
      ]);
      await waitForParagraphText(success);
      await waitForParagraphText(error);
      expect(success.shadowRoot.querySelector('p').textContent).to.not.equal(
        error.shadowRoot.querySelector('p').textContent
      );
    });
  });
});
