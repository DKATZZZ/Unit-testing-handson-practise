import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/LoanEMIDetails/LoanEMIDetails';

describe('LoanEMIDetails Component', () => {
  let element;
  let routerStub;

  const mockEmiData = {
    interestRate: 8.5,
    monthlyEMI: 12500,
    principal: 500000,
    interest: 100000,
    totalAmount: 600000,
  };

  beforeEach(async () => {
    routerStub = sinon.stub(Router, 'go');

    window.localStorage.setItem('emi', JSON.stringify(mockEmiData));

    element = await fixture(html`<loanemi-details></loanemi-details>`);
    await element.updateComplete;
  });

  afterEach(() => {
    sinon.restore();
    window.localStorage.removeItem('emi');
  });

  // 1. RENDER & LOCALSTORAGE DATA BINDING
  describe('Render & Data Binding', () => {
    it('populates _data from localStorage on connectedCallback', () => {
      expect(element._data).to.deep.equal(mockEmiData);
    });

    it('renders EMI values correctly in the DOM', () => {
      const spans = element.shadowRoot.querySelectorAll('.emi-details span');

      expect(spans[0].textContent).to.include('8.5 %');
      expect(spans[1].textContent).to.equal('12500');
      expect(spans[2].textContent).to.equal('500000');
      expect(spans[3].textContent).to.equal('100000');
      expect(spans[4].textContent).to.equal('600000');
    });

    it('renders action buttons correctly', () => {
      const cancelBtn = element.shadowRoot.querySelector('.cancel-btn');
      const continueBtn = element.shadowRoot.querySelector('.continue-btn');

      expect(cancelBtn).to.exist;
      expect(continueBtn).to.exist;
    });
  });

  // 2. NAVIGATION ACTIONS
  describe('Navigation Handlers', () => {
    it('navigates to /details when Cancel button is clicked', () => {
      const cancelBtn = element.shadowRoot.querySelector('.cancel-btn');
      cancelBtn.click();

      expect(routerStub.calledOnce).to.be.true;
      expect(routerStub.calledWith('/details')).to.be.true;
    });

    it('navigates to /customer when Continue button is clicked', () => {
      const continueBtn = element.shadowRoot.querySelector('.continue-btn');
      continueBtn.click();

      expect(routerStub.calledOnce).to.be.true;
      expect(routerStub.calledWith('/customer')).to.be.true;
    });

    it('executes _toBasicDetails handler directly', () => {
      element._toBasicDetails();
      expect(routerStub.calledWith('/details')).to.be.true;
    });

    it('executes _toCustomer handler directly', () => {
      element._toCustomer();
      expect(routerStub.calledWith('/customer')).to.be.true;
    });
  });
});