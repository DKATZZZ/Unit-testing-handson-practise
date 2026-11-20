import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import { localize } from '@lion/localize';
import { Router } from '@vaadin/router';
import '../locale/inline-data.js';
import '../src/LoanBasicDetails/BasicDetails.js';

const EMI_RESPONSE = {
  interestRate: 8.5,
  monthlyEMI: 4531,
  principal: 100000,
  interest: 8744,
  totalAmount: 108744,
};

describe('Basic details', () => {
  const originalLocale = localize.locale;

  let el;
  let sandbox;
  let routerGo;
  let fetchStub;

  const control = selector => el.shadowRoot.querySelector(selector);

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    routerGo = sandbox.stub(Router, 'go');
    fetchStub = sandbox.stub(window, 'fetch').resolves({
      json: async () => EMI_RESPONSE,
    });
    localize.locale = 'en-GB';

    localStorage.setItem('type', 'Home Loan');

    el = await fixture(html`<basic-details></basic-details>`);
  });

  afterEach(() => {
    sandbox.restore();
    localStorage.removeItem('type');
    localStorage.removeItem('emi');
    localize.locale = originalLocale;
  });

  describe('rendering', () => {
    it('renders the localized Loan Details heading', () => {
      expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal(
        'Loan Details',
      );
    });

    it('picks up the loan type the dashboard menu stored in localStorage', () => {
      expect(el.type).to.equal('Home Loan');
      expect(control('.type').value).to.equal('Home Loan');
    });

    it('renders the type field as disabled, because it is not user editable', () => {
      expect(control('.type').hasAttribute('disabled')).to.be.true;
    });

    it('starts with the default amount and loan period', () => {
      expect(el.amount).to.equal(10000);
      expect(el.range).to.equal(2);
      expect(control('.period').modelValue).to.equal(2);
    });

    it('constrains the loan period slider to 1-20 years', () => {
      const period = control('.period');
      expect(period.getAttribute('min')).to.equal('1');
      expect(period.getAttribute('max')).to.equal('20');
      expect(period.getAttribute('step')).to.equal('1');
    });

    it('renders localized Previous and Next buttons', () => {
      expect(control('.btn-previous').textContent.trim()).to.equal('Previous');
      expect(control('.btn-next').textContent.trim()).to.equal('Next');
    });
  });

  describe('amount in words', () => {
    it('spells out the entered amount into the word box', () => {
      control('.amount').modelValue = 250000;
      el._numToWord();
      // inWords() uses the Indian numbering system: lakh, not hundred thousand.
      expect(control('#word').innerHTML).to.contain('lakh');
      expect(control('#word').innerHTML).to.contain('two');
    });

    it('updates the word box on keyup in the amount field', async () => {
      control('.amount').modelValue = 5000;
      control('.amount').dispatchEvent(new Event('keyup', { bubbles: true }));
      await el.updateComplete;
      expect(control('#word').innerHTML).to.contain('five thousand');
    });
  });

  describe('capturing the details', () => {
    it('rejects an amount below ten thousand without calling the API', () => {
      control('.amount').modelValue = 5000;
      el._captureDetails();
      expect(fetchStub).to.have.callCount(0);
      expect(routerGo).to.have.callCount(0);
    });

    it('flags the amount field, then clears the flag after two seconds', () => {
      control('.amount').modelValue = 5000;

      const clock = sandbox.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout'],
      });
      try {
        el._captureDetails();
        expect(control('.amount').classList.contains('e-handle')).to.be.true;

        clock.tick(1999);
        expect(control('.amount').classList.contains('e-handle')).to.be.true;

        clock.tick(1);
        expect(control('.amount').classList.contains('e-handle')).to.be.false;
      } finally {
        clock.restore();
      }
    });

    it('POSTs the loan details to the EMI calculator', async () => {
      control('.amount').modelValue = 100000;
      el._captureDetails();
      await aTimeout(0);

      expect(fetchStub).to.have.been.calledOnce;
      const [url, init] = fetchStub.firstCall.args;
      expect(url).to.equal('https://loanfeapi.herokuapp.com/calculate-emi');
      expect(init.method).to.equal('POST');
      expect(init.headers['Content-Type']).to.equal('application/json');

      const body = JSON.parse(init.body);
      expect(body.name).to.equal('Home Loan');
      expect(body).to.have.property('amount');
      expect(body).to.have.property('period');
    });

    it('stores the calculated EMI so the next screen can read it', async () => {
      control('.amount').modelValue = 100000;
      el._captureDetails();
      await aTimeout(0);

      expect(JSON.parse(localStorage.getItem('emi'))).to.deep.equal(
        EMI_RESPONSE,
      );
      expect(el.emiCalc).to.deep.equal(EMI_RESPONSE);
    });

    it('advances to the EMI details screen once the API answers', async () => {
      control('.amount').modelValue = 100000;
      el._captureDetails();
      await aTimeout(0);

      expect(routerGo).to.have.been.calledOnceWithExactly('/emidetails');
    });

    it('submits when the Next button is clicked', async () => {
      control('.amount').modelValue = 100000;
      control('.btn-next').click();
      await aTimeout(0);

      expect(fetchStub).to.have.been.calledOnce;
    });
  });

  describe('navigation', () => {
    it('returns to the dashboard from _toDashboard', () => {
      el._toDashboard();
      expect(routerGo).to.have.been.calledOnceWithExactly('/');
    });

    it('returns to the dashboard when Previous is clicked', async () => {
      control('.btn-previous').click();
      await aTimeout(0);
      expect(routerGo).to.have.been.calledWithExactly('/');
    });
  });

  it('re-renders in Dutch when the locale changes', async () => {
    localize.locale = 'nl-NL';
    await aTimeout(0);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal(
      'Leninggegevens',
    );
  });
});
