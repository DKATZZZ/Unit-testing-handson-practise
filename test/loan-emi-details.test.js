
import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/LoanEMIDetails/LoanEMIDetails.js'; 

describe('LoanEMIDetails Component', () => {
  let element;

  beforeEach(async () => {
    localStorage.setItem('emi', JSON.stringify({
      interestRate: 8.5,
      monthlyEMI: 1200,
      principal: 10000,
      interest: 2000,
      totalAmount: 12000,
    }));
    element = await fixture(html`<loanemi-details></loanemi-details>`);
  });

  it('should instantiate and render EMI details', () => {
    expect(element).to.exist;
    const shadow = element.shadowRoot;
    expect(shadow.textContent).to.include('EMI Details');
    expect(shadow.textContent).to.include('1200');
  });

  it('should navigate to /details when cancel is clicked', () => {
    const routerStub = sinon.stub(window.history, 'pushState');
    const cancelBtn = element.shadowRoot.querySelector('.cancel-btn');
    cancelBtn.click();
    expect(routerStub.called).to.be.true;
    routerStub.restore();
  });

  it('should navigate to /customer when continue is clicked', () => {
    const routerStub = sinon.stub(window.history, 'pushState');
    const continueBtn = element.shadowRoot.querySelector('.continue-btn');
    continueBtn.click();
    expect(routerStub.called).to.be.true;
    routerStub.restore();
  });
});
