import { html, fixture, expect } from '@open-wc/testing';
import sinon, { stub } from 'sinon';
import '../src/LoanEMIDetails/LoanEMIDetails.js';
import { Router } from '@vaadin/router';
import { localize } from '@lion/localize';

describe('Loan EMI details', () => {
  let element;
  let localStorageStub;

  beforeEach(async () => {
    localStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageStub,
      writable: true,
    });

    const mockEmiData = {
      interestRate: 8.5,
      monthlyEMI: 5000,
      principal: 100000,
      interest: 20000,
      totalAmount: 120000,
    };

    localStorageStub.getItem
      .withArgs('emi')
      .returns(JSON.stringify(mockEmiData));

    element = await fixture(html`<loanemi-details></loanemi-details>`);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should check component accessibility', () => {
    expect(element).to.be.accessible;
  });

  it('should render EMI details component with all required elements', async () => {
    expect(element).to.exist;

    const container = element.shadowRoot.querySelector('div');
    expect(container).to.exist;

    const emiDetails = element.shadowRoot.querySelector('.emi-details');
    expect(emiDetails).to.exist;

    const heading = element.shadowRoot.querySelector('h2');
    expect(heading).to.exist;
    expect(heading.textContent.trim()).to.equal('EMI Details');

    const paragraphs = element.shadowRoot.querySelectorAll('.emi-details p');
    expect(paragraphs).to.have.lengthOf(5); // Should have 5 data fields

    const btnContainer = element.shadowRoot.querySelector('.btn-cont');
    expect(btnContainer).to.exist;

    const cancelBtn = element.shadowRoot.querySelector('.cancel-btn');
    const continueBtn = element.shadowRoot.querySelector('.continue-btn');
    expect(cancelBtn).to.exist;
    expect(continueBtn).to.exist;
  });

  it('should display EMI data from localStorage correctly', async () => {
    await element.updateComplete;

    expect(localStorageStub.getItem.calledWith('emi')).to.be.true;

    const spans = element.shadowRoot.querySelectorAll('.emi-details span');
    expect(spans).to.have.length.greaterThan(0);

    spans.forEach(span => {
      expect(span.textContent.trim()).to.not.be.empty;
    });

    const spanTexts = Array.from(spans).map(span => span.textContent.trim());
    expect(spanTexts).to.include('8.5 %'); // Interest rate
    expect(spanTexts).to.include('5000'); // Monthly EMI
    expect(spanTexts).to.include('100000'); // Principal
    expect(spanTexts).to.include('20000'); // Interest
    expect(spanTexts).to.include('120000'); // Total amount
  });

  it('should navigate to basic details when cancel button is clicked', async () => {
    const routerSpy = sinon.spy(Router, 'go');

    const cancelBtn = element.shadowRoot.querySelector('.cancel-btn');
    expect(cancelBtn).to.exist;

    cancelBtn.click();

    expect(routerSpy.calledOnce).to.be.true;
    expect(routerSpy.calledWith('/details')).to.be.true;
  });

  it('should navigate to customer page when continue button is clicked', async () => {
    const routerSpy = sinon.spy(Router, 'go');

    const continueBtn = element.shadowRoot.querySelector('.continue-btn');
    expect(continueBtn).to.exist;

    continueBtn.click();

    expect(routerSpy.calledOnce).to.be.true;
    expect(routerSpy.calledWith('/customer')).to.be.true;
  });

  it('should have correct CSS classes on buttons', async () => {
    const cancelBtn = element.shadowRoot.querySelector('.cancel-btn');
    const continueBtn = element.shadowRoot.querySelector('.continue-btn');

    expect(cancelBtn).to.exist;
    expect(continueBtn).to.exist;

    expect(cancelBtn.classList.contains('cancel-btn')).to.be.true;
    expect(cancelBtn.classList.contains('btn')).to.be.true;

    expect(continueBtn.classList.contains('continue-btn')).to.be.true;
    expect(continueBtn.classList.contains('btn')).to.be.true;

    expect(cancelBtn.tagName.toLowerCase()).to.equal('lion-button');
    expect(continueBtn.tagName.toLowerCase()).to.equal('lion-button');

    expect(cancelBtn).to.have.property('onclick');
    expect(continueBtn).to.have.property('onclick');
  });
});
