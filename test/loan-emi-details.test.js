import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import { Router } from '@vaadin/router';
import '../src/LoanEMIDetails/LoanEMIDetails.js';

describe('Loan EMI Details Component', () => {
  let element;

  function testNavigation(buttonSelector, expectedRoute) {
    const routerStub = stub(Router, 'go');
    const button = element.shadowRoot.querySelector(buttonSelector);

    button.click();

    expect(routerStub.calledOnce).to.be.true;
    expect(routerStub.calledWith(expectedRoute)).to.be.true;

    routerStub.restore();
  }

  beforeEach(async () => {
    localStorage.setItem('emi', JSON.stringify({ interestRate: 20 }));
    element = await fixture(html`<loanemi-details></loanemi-details>`);
  });

  it('renders component correctly', () => {
    expect(element).to.exist;
    expect(customElements.get('loanemi-details')).to.not.be.undefined;
  });

  it('displays correct interest rate from localStorage', () => {
    const emiData = { interestRate: 20 };
    const interestRateElement =
    element.shadowRoot.querySelector('.emi-details p span');
    expect(interestRateElement).to.exist;
    expect(interestRateElement.textContent).to.equal('20 %');
    expect(element._data).to.deep.equal(emiData);
  });

  it('navigates to "/details" on ".cancel-btn" click', () => {
    testNavigation('.cancel-btn', '/details');
  });

  it('navigates to "/customer" on ".continue-btn" click', () => {
    testNavigation('.continue-btn', '/customer');
  });
});
