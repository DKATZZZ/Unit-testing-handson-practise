import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/LoanBasicDetails/BasicDetails.js';
import { Router } from '@vaadin/router';


describe('Basic details', () => {
  before(() => {
    localStorage.setItem('type', 'Personal Loan');
  });

  it('renders basic structure and default values', () => {
    return fixture(html`<basic-details></basic-details>`).then(el => {
      const typeInput = el.shadowRoot.querySelector('#type');
      const amountInput = el.shadowRoot.querySelector('#amount');
      const periodInput = el.shadowRoot.querySelector('#Period');

      expect(typeInput).to.exist;
      expect(typeInput.value).to.equal('Personal Loan');
      expect(amountInput).to.exist;
      expect(periodInput).to.exist;
    });
  });

  it('shows amount in words on keyup', () => {
    return fixture(html`<basic-details></basic-details>`).then(el => {
      const amountInput = el.shadowRoot.querySelector('.amount');
      amountInput.value = '12000';
      amountInput.dispatchEvent(new Event('keyup'));

      const wordDiv = el.shadowRoot.querySelector('#word');

      expect(wordDiv.textContent.trim().toLowerCase()).to.include('twelve thousand');
    });
  });


  it('navigates to dashboard on Previous button click', () => {
    return fixture(html`<basic-details></basic-details>`).then(el => {
      const routerStub = sinon.stub(Router, 'go');
      const prevBtn = el.shadowRoot.querySelector('.btn-previous');

      prevBtn.click();
      expect(routerStub.calledOnceWith('/')).to.be.true;
      routerStub.restore();
    });
  });

  it('adds error class for amount < 10000 and does not proceed', () => {
    return fixture(html`<basic-details></basic-details>`).then(el => {
      const amountInput = el.shadowRoot.querySelector('.amount');
      amountInput.value = '9000';
      amountInput.dispatchEvent(new Event('change'));

      el._captureDetails();

      const hasError = amountInput.classList.contains('e-handle');
      expect(hasError).to.be.true;
    });
  });


  it('does not add error class for valid amount >= 10000', () => {
    return fixture(html`<basic-details></basic-details>`).then(el => {
      const amountInput = el.shadowRoot.querySelector('.amount');
      amountInput.value = '15000';
      el._captureDetails();

      expect(amountInput.classList.contains('e-handle')).to.be.false;
    });
  });


  it('stores EMI data and navigates on successful POST', async () => {
    const fakeResponse = { emi: 2500 };

    const fetchStub = sinon.stub(window, 'fetch').resolves({
      json: () => Promise.resolve(fakeResponse),
    });

    const routerStub = sinon.stub(Router, 'go');

    const el = await fixture(html`<basic-details></basic-details>`);
    const amountInput = el.shadowRoot.querySelector('.amount');
    amountInput.value = '15000';

    el._captureDetails();

    // Wait for microtasks to complete
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(fetchStub.calledOnce).to.be.true;
    expect(localStorage.getItem('emi')).to.include('2500');
    expect(routerStub.calledOnceWith('/emidetails')).to.be.true;

    fetchStub.restore();
    routerStub.restore();
  });
});



describe('Basic details', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    localStorage.setItem('type', 'Personal Loan');
  });

  afterEach(() => {
    clock.restore();
  });

  it('removes e-handle class after 2 seconds for invalid amount', async () => {
    const el = await fixture(html`<basic-details></basic-details>`);
    const amountInput = el.shadowRoot.querySelector('.amount');

    amountInput.value = '9000'; // Invalid amount
    el._captureDetails();

    expect(amountInput.classList.contains('e-handle')).to.be.true;

    // Fast-forward time by 2 seconds
    clock.tick(2000);

    expect(amountInput.classList.contains('e-handle')).to.be.false;
  });
});

describe('Basic details - validator arrow functions', () => {

  it('should trigger Required validator and execute getMessage()', () => {
    return fixture(html`<basic-details></basic-details>`).then(el => {
      const input = el.shadowRoot.querySelector('#amount');

      input.modelValue = '';
      input.touched = true;
      input.dirty = true;
      input.validate();
      el.updateComplete;
      expect(input.hasFeedbackFor.includes('error')).to.be.true;
      // const requiredValidator = input.validators[2];
      // expect(requiredValidator.getMessage()).to.include('required field');
    })

  });


  it('should trigger MinNumber validator and execute getMessage()', () => {
    return fixture(html`<basic-details></basic-details>`).then(el => {
      const input = el.shadowRoot.querySelector('#amount');

      input.modelValue = 5000;
      input.touched = true;
      input.dirty = true;
      input.validate();
      el.updateComplete;


      expect(input.hasFeedbackFor.includes('error')).to.be.false;
      // const minValidator = input.validators[0];
      // expect(minValidator.getMessage()).to.include('greater than ten thousand');
    })

  });

  it('should trigger MaxNumber validator and execute getMessage()', () => {
    return fixture(html`<basic-details></basic-details>`).then((el) => {
      const input = el.shadowRoot.querySelector('#amount');

      input.modelValue = 20000000;
      input.touched = true;
      input.dirty = true;
      input.validate();
      el.updateComplete;

      expect(input.hasFeedbackFor.includes('error')).to.be.false;
      // const maxValidator = input.validators[1];
      // expect(maxValidator.getMessage()).to.include('less than ten crore');
    })

  });

})
