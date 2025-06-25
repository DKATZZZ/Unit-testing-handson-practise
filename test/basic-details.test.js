import { fixture, html, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/LoanBasicDetails/BasicDetails.js'; 
import { inWords } from '../src/utils/numToWord.js'; 

describe('BasicDetails Component', () => {
  let element;

  beforeEach(async () => {
    localStorage.setItem('type', 'Personal Loan');
    element = await fixture(html`<basic-details></basic-details>`);
  });

  afterEach(() => {
    localStorage.clear();
    sinon.restore();
  });

  it('renders input fields and buttons correctly', () => {
    const shadow = element.shadowRoot;
    expect(shadow.querySelector('lion-input[name="type"]')).to.exist;
    expect(shadow.querySelector('lion-input-amount[name="amount"]')).to.exist;
    expect(shadow.querySelector('lion-input-range[name="Period"]')).to.exist;
    expect(shadow.querySelector('.btn-next')).to.exist;
    expect(shadow.querySelector('.btn-previous')).to.exist;
  });

  it('sets loan type from localStorage', () => {
    expect(element.type).to.equal('Personal Loan');
  });

  it('calls inWords() and updates #word div on keyup', () => {
    const amountInput = element.shadowRoot.querySelector('.amount');
    const wordDiv = element.shadowRoot.querySelector('#word');
    amountInput.value = '15000';
    element._numToWord();

    expect(wordDiv.innerHTML).to.equal(inWords(15000));
  });

  it('shows error border if amount is less than 10000', async () => {
    const amountInput = element.shadowRoot.querySelector('.amount');
    amountInput.value = '9000';

    element._captureDetails();

    expect(amountInput.classList.contains('e-handle')).to.be.true;

    await new Promise(resolve => setTimeout(resolve, 2100));

    expect(amountInput.classList.contains('e-handle')).to.be.false;
  });

  it('submits valid data and navigates to /emidetails', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves({
      json: () => Promise.resolve({ emi: 1234 }),
    });

    const routerStub = sinon.stub(Router, 'go');

    element.shadowRoot.querySelector('.amount').value = '15000';
    element.shadowRoot.querySelector('.period').value = '5';

    element._captureDetails();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(fetchStub.calledOnce).to.be.true;
    expect(routerStub.calledOnceWith('/emidetails')).to.be.true;

    fetchStub.restore();
    routerStub.restore();
  });

  it('navigates to / on back button click', () => {
    const routerStub = sinon.stub(Router, 'go');
    element.shadowRoot.querySelector('.btn-previous').click();
    expect(routerStub.calledOnceWith('/')).to.be.true;
    routerStub.restore();
  });
});
