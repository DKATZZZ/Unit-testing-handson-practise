import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import { localize } from '@lion/localize';
import { Router } from '@vaadin/router';
import '../locale/inline-data.js';
import '../src/LoanEMIDetails/LoanEMIDetails.js';

const EMI = {
  interestRate: 8.5,
  monthlyEMI: 4531,
  principal: 100000,
  interest: 8744,
  totalAmount: 108744,
};

describe('Loan EMI details', () => {
  const originalLocale = localize.locale;

  let el;
  let sandbox;
  let routerGo;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    routerGo = sandbox.stub(Router, 'go');
    localize.locale = 'en-GB';
    localStorage.setItem('emi', JSON.stringify(EMI));

    el = await fixture(html`<loanemi-details></loanemi-details>`);
  });

  afterEach(() => {
    sandbox.restore();
    localStorage.removeItem('emi');
    localize.locale = originalLocale;
  });

  const paragraphs = () =>
    Array.from(el.shadowRoot.querySelectorAll('p')).map(p =>
      p.textContent.replace(/\s+/g, ' ').trim(),
    );

  it('reads the EMI breakdown that BasicDetails stored in localStorage', () => {
    expect(el._data).to.deep.equal(EMI);
  });

  it('renders the static EMI Details heading', () => {
    expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal(
      'EMI Details',
    );
  });

  it('renders every figure from the stored breakdown', () => {
    const text = paragraphs().join(' | ');
    expect(text).to.contain('8.5 %');
    expect(text).to.contain('4531');
    expect(text).to.contain('100000');
    expect(text).to.contain('8744');
    expect(text).to.contain('108744');
  });

  it('labels each figure from the en-GB locale data', () => {
    const text = paragraphs().join(' | ');
    expect(text).to.contain('Interest Rate');
    expect(text).to.contain('Monthly EMI');
    expect(text).to.contain('Principal');
    expect(text).to.contain('Total Amount');
  });

  it('renders localized Cancel and Continue buttons', () => {
    expect(
      el.shadowRoot.querySelector('.cancel-btn').textContent.trim(),
    ).to.equal('Cancel');
    expect(
      el.shadowRoot.querySelector('.continue-btn').textContent.trim(),
    ).to.equal('Continue');
  });

  it('goes back to the basic details screen from _toBasicDetails', () => {
    el._toBasicDetails();
    expect(routerGo).to.have.been.calledOnceWithExactly('/details');
  });

  it('goes back to the basic details screen when Cancel is clicked', async () => {
    el.shadowRoot.querySelector('.cancel-btn').click();
    await aTimeout(0);
    expect(routerGo).to.have.been.calledWithExactly('/details');
  });

  it('advances to the customer screen from _toCustomer', () => {
    el._toCustomer();
    expect(routerGo).to.have.been.calledOnceWithExactly('/customer');
  });

  it('advances to the customer screen when Continue is clicked', async () => {
    el.shadowRoot.querySelector('.continue-btn').click();
    await aTimeout(0);
    expect(routerGo).to.have.been.calledWithExactly('/customer');
  });

  it('re-renders in Dutch when the locale changes', async () => {
    localize.locale = 'nl-NL';
    await aTimeout(0);
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector('.cancel-btn').textContent.trim(),
    ).to.equal('annuleren');
  });

  it('is accessible', async () => {
    await expect(el).to.be.accessible();
  });
});
