import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/LoanEMIDetails/LoanEMIDetails.js';

const SAMPLE_EMI = {
  interestRate: 10.5,
  monthlyEMI: 16133,
  principal: 500000,
  interest: 80788,
  totalAmount: 580788,
};

function seedLocalStorage(data = SAMPLE_EMI) {
  localStorage.setItem('emi', JSON.stringify(data));
}

async function waitForLocale(el) {
  await el.updateComplete;
  await new Promise(r => setTimeout(r, 150));
  await el.updateComplete;
}

/**
 * Spy on a method then force LitElement to re-render so the new @click
 * binding in the template picks up the spy instead of the original method.
 */
async function spyAndRerender(el, methodName) {
  const spy = sinon.spy(el, methodName);
  el.requestUpdate();
  await el.updateComplete;
  return spy;
}

describe('Loan EMI Details', () => {
  afterEach(() => {
    localStorage.removeItem('emi');
    sinon.restore();
  });

  describe('Rendering', () => {
    it('is defined as a custom element', () => {
      expect(customElements.get('loanemi-details')).to.not.be.undefined;
    });

    it('renders without throwing when localStorage data is present', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it('displays the "EMI Details" heading', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      const h2 = el.shadowRoot.querySelector('h2');
      expect(h2).to.exist;
      expect(h2.textContent.trim()).to.equal('EMI Details');
    });

    it('renders the Cancel button', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      expect(el.shadowRoot.querySelector('.cancel-btn')).to.exist;
    });

    it('renders the Continue button', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      expect(el.shadowRoot.querySelector('.continue-btn')).to.exist;
    });

    it('passes the a11y audit (suppressing known lion-button slot label rule)', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      await waitForLocale(el);
      await expect(el).to.be.accessible({ ignoredRules: ['aria-command-name'] });
    });
  });

  describe('Data Display from localStorage', () => {
    it('displays interest rate from localStorage', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      expect(el.shadowRoot.innerHTML).to.include('10.5');
    });

    it('displays monthly EMI from localStorage', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      expect(el.shadowRoot.innerHTML).to.include('16133');
    });

    it('displays principal from localStorage', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      expect(el.shadowRoot.innerHTML).to.include('500000');
    });

    it('displays total amount from localStorage', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      expect(el.shadowRoot.innerHTML).to.include('580788');
    });

    it('re-renders with updated _data property', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      el._data = { interestRate: 12, monthlyEMI: 22244, principal: 1000000, interest: 334640, totalAmount: 1334640 };
      await el.updateComplete;
      expect(el.shadowRoot.innerHTML).to.include('22244');
    });
  });

  describe('Navigation', () => {
    it('calls _toBasicDetails when Cancel lion-button is clicked', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      // Spy first, then re-render so LitElement re-binds @click to the spy
      const spy = await spyAndRerender(el, '_toBasicDetails');
      el.shadowRoot.querySelector('.cancel-btn').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('calls _toCustomer when Continue lion-button is clicked', async () => {
      seedLocalStorage();
      const el = await fixture(html`<loanemi-details></loanemi-details>`);
      const spy = await spyAndRerender(el, '_toCustomer');
      el.shadowRoot.querySelector('.continue-btn').click();
      expect(spy.calledOnce).to.be.true;
    });
  });
});
