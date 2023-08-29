import { html, fixture, expect } from '@open-wc/testing';
import '../src/LoanEMIDetails/LoanEMIDetails.js';

describe('Loan EMI details', () => {
  // Write test cases inside this block
  it('renders EMI details correctly', async () => {
    const emiDetails = {
      interestRate: 5,
      monthlyEMI: 1000,
      principal: 5000,
      interest: 1000,
      totalAmount: 6000,
    };

    const el = await fixture(html`<loanemi-details></loanemi-details>`);
    el._data = emiDetails;

    const detailsParagraphs = el.shadowRoot.querySelectorAll('.emi-details p');
    expect(detailsParagraphs.length).to.equal(5);
    expect(detailsParagraphs[0].textContent).to.include('Interest Rate:');
    expect(detailsParagraphs[0].querySelector('span').textContent).to.equal('5 %');

    const buttons = el.shadowRoot.querySelectorAll('.btn-cont lion-button');
    expect(buttons.length).to.equal(2);
  });

  it('navigates to basic details page on cancel button click', async () => {
    const el = await fixture(html`<loanemi-details></loanemi-details>`);
    const cancelButton = el.shadowRoot.querySelector('.cancel-btn');
    const goSpy = sinon.spy(el, '_toBasicDetails');

    cancelButton.click();
    expect(goSpy).to.have.been.calledOnce;
  });

  it('navigates to customer page on continue button click', async () => {
    const el = await fixture(html`<loanemi-details></loanemi-details>`);
    const continueButton = el.shadowRoot.querySelector('.continue-btn');
    const goSpy = sinon.spy(el, '_toCustomer');

    continueButton.click();
    expect(goSpy).to.have.been.calledOnce;
  });
});
