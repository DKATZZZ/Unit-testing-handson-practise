import { html, fixture, expect } from '@open-wc/testing';
import '../src/LoanEMIDetails/LoanEMIDetails.js';
import sinon from 'sinon';
import { Router } from '@vaadin/router';

describe('Loan EMI details', () => {
 before(() => {
    localStorage.setItem('emi', JSON.stringify({
      interestRate: 8.5,
      monthlyEMI: 15000,
      principal: 500000,
      interest: 50000,
      totalAmount: 550000,
    }));
  });

  it('renders EMI details from localStorage', () => {
    return fixture(html`<loanemi-details></loanemi-details>`).then(el => {
      const content = el.shadowRoot.textContent;

      expect(content).to.include('8.5');
      expect(content).to.include('15000');
      expect(content).to.include('500000');
      expect(content).to.include('50000');
      expect(content).to.include('550000');
    });
  });

  it('navigates to / details on Cancel button click', () => {
    return fixture(html`<loanemi-details></loanemi-details>`).then(el => {
      const routerStub = sinon.stub(Router, 'go');
      const cancelBtn = el.shadowRoot.querySelector('.cancel-btn');

      cancelBtn.click();

      expect(routerStub.calledOnceWith('/details')).to.be.true;
      routerStub.restore();
    });
  });

  it('navigates to /customer on Continue button click', () => {
    return fixture(html`<loanemi-details></loanemi-details>`).then(el => {
      const routerStub = sinon.stub(Router, 'go');
      const contBtn = el.shadowRoot.querySelector('.continue-btn');

      contBtn.click();

      expect(routerStub.calledOnceWith('/customer')).to.be.true;
      routerStub.restore();
    });
  });
});
