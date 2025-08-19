import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/LoanEMIDetails/LoanEMIDetails.js';

describe('Loan EMI details', () => {
  let instance, router;

  before(() => {
    localStorage.setItem('emi', JSON.stringify({
      interestRate: 8.5,
      monthlyEMI: 15000,
      principal: 500000,
      interest: 50000,
      totalAmount: 550000,
    }));
  });

  beforeEach(async () => {
    instance = await fixture(html`<loanemi-details></loanemi-details>`);
    router = sinon.stub(Router, 'go');
  });

  afterEach(() => {
    router.restore();
  });

  it('checks EMI details rendering from localStorage', () => {
    const content = instance.shadowRoot.textContent;

    expect(content).to.include(8.5);
    expect(content).to.include(15000);
    expect(content).to.include(500000);
    expect(content).to.include(50000);
    expect(content).to.include(550000);
  });

  it('checks navigation on Cancel button click', () => {
    const cancelButton = instance.shadowRoot.querySelector('.cancel-btn');
    cancelButton.click();
    expect(router.calledOnceWith('/details')).to.be.true;
  });

  it('checks navigation on Continue button click', () => {
    const continueButton = instance.shadowRoot.querySelector('.continue-btn');
    continueButton.click();
    expect(router.calledOnceWith('/customer')).to.be.true;
  });
});