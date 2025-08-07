import { html, fixture, expect } from '@open-wc/testing';
import '../src/LoanBasicDetails/BasicDetails.js';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import { inWords } from '../src/utils/numToWord.js';

describe('Basic details', () => {
  // Write test cases inside this block
  // refer basic-details.js files
  let element;
  let fetchStub;
  let routerStub;

  beforeEach(async () => {
    localStorage.setItem('type', 'Personal Loan');
    element = await fixture(html`<basic-details></basic-details>`);
    routerStub = sinon.stub(Router, 'go');
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    localStorage.clear();
    sinon.restore();
    routerStub.restore();
    fetchStub.restore();
  });

  it('should renders input fields and buttons correctly', () => {
    const shadow = element.shadowRoot;
    expect(shadow.querySelector('lion-input[name="type"]')).to.be.accessible;
    expect(shadow.querySelector('lion-input-amount[name="amount"]')).to.be
      .accessible;
    expect(shadow.querySelector('lion-input-range[name="Period"]')).to.be
      .accessible;
    expect(shadow.querySelector('.btn-next')).to.be.accessible;
    expect(shadow.querySelector('.btn-previous')).to.be.accessible;
  });

  it('should sets loan type from localStorage', () => {
    expect(element.type).to.equal('Personal Loan');
  });

  it('should call inWords()', () => {
    const amountInput = element.shadowRoot.querySelector('.amount');
    const wordDiv = element.shadowRoot.querySelector('#word');
    amountInput.value = '1000';
    element._numToWord();

    expect(wordDiv.innerHTML).to.equal(inWords(1000));
  });

  it('should submit valid data and navigates to /emidetails', async () => {
    fetchStub.resolves({
      json: () => Promise.resolve({ emi: 1234 }),
    });
    element.shadowRoot.querySelector('.amount').value = '15000';
    element.shadowRoot.querySelector('.period').value = '5';

    element._captureDetails();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(fetchStub.calledOnce).to.be.true;
    expect(routerStub.calledOnceWith('/emidetails')).to.be.true;
  });

  it('should navigate to / on back button click', () => {
    element.shadowRoot.querySelector('.btn-previous').click();
    expect(routerStub.calledOnceWith('/')).to.be.true;
  });
});
