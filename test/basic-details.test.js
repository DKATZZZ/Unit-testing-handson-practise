import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/LoanBasicDetails/BasicDetails.js';

describe('Basic details', () => {
  let instance, amountInput;

  beforeEach(async () => {
    instance = await fixture(html`<basic-details></basic-details>`);
    amountInput = instance.shadowRoot.querySelector('.amount');
  });

  before(() => {
    localStorage.setItem('type', 'Personal Loan');
  });

  it('checks inputs and default values', () => {
    const typeInput = instance.shadowRoot.querySelector('#type');
    const periodInput = instance.shadowRoot.querySelector('#Period');

    expect(typeInput).to.exist;
    expect(periodInput).to.exist;
    expect(amountInput).to.exist;
    expect(typeInput.value.trim().toLowerCase()).to.equal('personal loan');
  });

  it('checks amount input and its word representation', () => {
    amountInput.value = '11000';
    amountInput.dispatchEvent(new Event('keyup'));
    const wordDiv = instance.shadowRoot.querySelector('#word');
    expect(wordDiv.textContent.trim().toLowerCase()).to.include('eleven thousand');
  });

  it('checks navigation on Previous button click', () => {
    const router = sinon.stub(Router, 'go');
    const prevBtn = instance.shadowRoot.querySelector('.btn-previous');
    prevBtn.click();
    expect(router.calledOnceWith('/')).to.be.true;
    router.restore();
  });

  it('checks amount input for invalid values', () => {
    amountInput.value = '8000';
    instance._captureDetails();
    expect(amountInput.classList.contains('e-handle')).to.be.true;
  });

  it('checks amount input for valid values', () => {
    amountInput.value = '13000';
    instance._captureDetails();
    expect(amountInput.classList.contains('e-handle')).to.be.false;
  });

  it('checks API call and response handling', async () => {
    const response = { emi: 2500 };
    const fetch = sinon.stub(window, 'fetch').resolves({
      json: () => Promise.resolve(response),
    });

    const router = sinon.stub(Router, 'go');
    amountInput.value = '13000';
    instance._captureDetails();

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(fetch.calledOnce).to.be.true;
    expect(localStorage.getItem('emi')).to.include('2500');
    expect(router.calledOnceWith('/emidetails')).to.be.true;

    fetch.restore();
    router.restore();
  });

  it('checks input validation for type field', async () => {
    const typeInput = instance.shadowRoot.querySelector('#type');
    typeInput.liveValidate = true;
    typeInput.disabled = false;
    typeInput.modelValue = '';
    typeInput.touched = true;
    typeInput.dirty = true;

    await typeInput.validate();
    await typeInput.updateComplete;
  });

  it('checks input validation for amount field', async () => {
    const amountInput = instance.shadowRoot.querySelector('#amount');
    amountInput.liveValidate = true;
    amountInput.modelValue = '';
    amountInput.touched = true;
    amountInput.dirty = true;

    await amountInput.validate();
    await amountInput.updateComplete;
    await amountInput.feedbackComplete;
    const { _feedbackNode } = amountInput;
    expect(_feedbackNode.feedbackData[0].message).to.equal('Amount is a required field')
  });
});

describe('Basic details - Timers', () => {
  let clock, instance;

  beforeEach(async () => {
    instance = await fixture(html`<basic-details></basic-details>`);
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('checks amount input for invalid values', async () => {
    const amountInput = instance.shadowRoot.querySelector('.amount');
    amountInput.value = '9000';
    instance._captureDetails();
    expect(amountInput.classList.contains('e-handle')).to.be.true;
    clock.tick(2000);
    expect(amountInput.classList.contains('e-handle')).to.be.false;
  });
});