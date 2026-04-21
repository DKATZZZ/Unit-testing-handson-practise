import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import sinon from 'sinon';
import '../src/LoanBasicDetails/BasicDetails.js';

async function waitForLocale(el) {
  await el.updateComplete;
  await new Promise(r => setTimeout(r, 150));
  await el.updateComplete;
}

async function spyAndRerender(el, methodName) {
  const spy = sinon.spy(el, methodName);
  el.requestUpdate();
  await el.updateComplete;
  return spy;
}

describe('Basic Details', () => {
  beforeEach(() => {
    localStorage.setItem('type', 'Home Loan');
  });

  afterEach(() => {
    localStorage.clear();
    sinon.restore();
  });

  describe('Rendering', () => {
    it('is defined as a custom element', () => {
      expect(customElements.get('basic-details')).to.not.be.undefined;
    });

    it('renders without throwing', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it('renders the loan type input (.type)', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el.shadowRoot.querySelector('.type')).to.exist;
    });

    it('renders the amount input (.amount)', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el.shadowRoot.querySelector('.amount')).to.exist;
    });

    it('renders the loan period range slider (.period)', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el.shadowRoot.querySelector('.period')).to.exist;
    });

    it('renders the Previous button (.btn-previous)', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el.shadowRoot.querySelector('.btn-previous')).to.exist;
    });

    it('renders the Next button (.btn-next)', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el.shadowRoot.querySelector('.btn-next')).to.exist;
    });

    it('renders the #word element for amount-in-words', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el.shadowRoot.querySelector('#word')).to.exist;
    });

    it('passes the a11y audit (suppressing known source-component violations)', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      await waitForLocale(el);
      await expect(el).to.be.accessible({
        ignoredRules: ['aria-command-name', 'label', 'label-title-only', 'empty-heading'],
      });
    });
  });

  describe('Default State', () => {
    it('has default amount of 10000', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el.amount).to.equal(10000);
    });

    it('has default range (period) of 2', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el.range).to.equal(2);
    });

    it('has default emiCalc of 0', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el.emiCalc).to.equal(0);
    });

    it('reads loan type from localStorage on connectedCallback', async () => {
      localStorage.setItem('type', 'Car Loan');
      const el = await fixture(html`<basic-details></basic-details>`);
      expect(el.type).to.equal('Car Loan');
    });
  });

  describe('_numToWord()', () => {
    it('converts 500000 → shows "lakh" in #word', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      el.shadowRoot.querySelector('.amount').value = '500,000';
      el._numToWord();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector('#word').innerHTML.toLowerCase()).to.include('lakh');
    });

    it('converts 10000 → shows "ten thousand" in #word', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      el.shadowRoot.querySelector('.amount').value = '10,000';
      el._numToWord();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector('#word').innerHTML.toLowerCase()).to.include('ten thousand');
    });
  });

  describe('Amount Validation in _captureDetails()', () => {
    it('adds e-handle class to amount input when value < 10000', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      const amountInput = el.shadowRoot.querySelector('.amount');
      Object.defineProperty(amountInput, 'value', { get: () => '5,000', configurable: true });
      el._captureDetails();
      expect(amountInput.classList.contains('e-handle')).to.be.true;
    });

    it('does NOT call fetch when amount is below 10000', async () => {
      const fetchStub = stub(window, 'fetch');
      const el = await fixture(html`<basic-details></basic-details>`);
      const amountInput = el.shadowRoot.querySelector('.amount');
      Object.defineProperty(amountInput, 'value', { get: () => '100', configurable: true });
      el._captureDetails();
      expect(fetchStub.called).to.be.false;
    });
  });

  describe('API Integration', () => {
    function mockEmiResponse(data = { interestRate: 10.5, monthlyEMI: 16133, principal: 500000, interest: 80788, totalAmount: 580788 }) {
      return stub(window, 'fetch').resolves(
        new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })
      );
    }

    function stubInputs(el, amount, type, period) {
      Object.defineProperty(el.shadowRoot.querySelector('.amount'), 'value', { get: () => amount, configurable: true });
      Object.defineProperty(el.shadowRoot.querySelector('.type'),   'value', { get: () => type,   configurable: true });
      Object.defineProperty(el.shadowRoot.querySelector('.period'), 'value', { get: () => period,  configurable: true });
    }

    it('calls the EMI API with POST on valid submission', async () => {
      const fetchStub = mockEmiResponse();
      const el = await fixture(html`<basic-details></basic-details>`);
      stubInputs(el, '500,000', 'Home Loan', '3');
      el._captureDetails();
      await new Promise(r => setTimeout(r, 0));
      expect(fetchStub.calledOnce).to.be.true;
      const [url, options] = fetchStub.firstCall.args;
      expect(url).to.include('calculate-emi');
      expect(options.method).to.equal('POST');
      expect(options.headers['Content-Type']).to.equal('application/json');
    });

    it('sends name, amount, and period in the POST body', async () => {
      const fetchStub = mockEmiResponse();
      const el = await fixture(html`<basic-details></basic-details>`);
      stubInputs(el, '300,000', 'Personal Loan', '4');
      el._captureDetails();
      await new Promise(r => setTimeout(r, 0));
      const body = JSON.parse(fetchStub.firstCall.args[1].body);
      expect(body).to.deep.include({ name: 'Personal Loan', amount: '300,000', period: '4' });
    });

    it('stores API response in localStorage under "emi" key', async () => {
      const emiData = { interestRate: 10, monthlyEMI: 9000, principal: 300000, interest: 24000, totalAmount: 324000 };
      const fetchStub = mockEmiResponse(emiData);
      const el = await fixture(html`<basic-details></basic-details>`);
      stubInputs(el, '300,000', 'Car Loan', '5');
      el._captureDetails();
      await new Promise(r => setTimeout(r, 50));
      expect(JSON.parse(localStorage.getItem('emi'))).to.deep.equal(emiData);
      fetchStub.restore();
    });
  });

  describe('Navigation', () => {
    it('calls _toDashboard when Previous lion-button is clicked', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      // Re-render after spy so LitElement re-binds @click=${this._toDashboard} to the spy
      const spy = await spyAndRerender(el, '_toDashboard');
      el.shadowRoot.querySelector('.btn-previous').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('calls _captureDetails when Next lion-button is clicked', async () => {
      const el = await fixture(html`<basic-details></basic-details>`);
      const spy = await spyAndRerender(el, '_captureDetails');
      el.shadowRoot.querySelector('.btn-next').click();
      expect(spy.calledOnce).to.be.true;
    });
  });
});
