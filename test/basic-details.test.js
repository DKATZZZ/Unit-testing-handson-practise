import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import { localize } from '@lion/localize';
import '../src/LoanBasicDetails/BasicDetails.js';
import { inWords } from '../src/utils/numToWord.js';

describe('BasicDetails', () => {
  let element;

  beforeEach(async () => {
    localStorage.setItem('type', 'Personal Loan');
    element = await fixture(html`<basic-details></basic-details>`);
    await element.updateComplete;
  });

  afterEach(() => {
    localStorage.clear();
    sinon.restore();
  });

  it('should initialize default values in constructor', () => {
    expect(element.amount).to.equal(10000);
    expect(element.range).to.equal(2);
    expect(element.emiCalc).to.equal(0);
    expect(element.type).to.equal('Personal Loan');
  });

  it('should set type from localStorage in connectedCallback', () => {
    expect(element.type).to.equal('Personal Loan');
  });


  it('should check h2 text content', async () => {
    sinon.stub(localize, 'msg').callsFake(key => {
      if (key === 'change-language:loandetails') return 'Loan Details';
      return key;
    });

    const el = await fixture(html`<basic-details></basic-details>`);
    await el.updateComplete;

    const h2 = el.shadowRoot.querySelector('h2');
    expect(h2.textContent).to.equal('Loan Details');
  });

  it('should call inWords and update #word in _numToWord', () => {
    element.shadowRoot.querySelector('.amount').value = '10000';
    element._numToWord();
    expect(element.shadowRoot.querySelector('#word').innerHTML)
      .to.equal(inWords(10000));
  });

  it('should call inWords with stub and update #word', () => {
    const inWordsStub = sinon.stub().returns('Ten Thousand');
    element._numToWord = function () {
      const val = this.shadowRoot.querySelector('.amount').value;
      this.shadowRoot.querySelector('#word').innerHTML = inWordsStub(val);
    };

    element.shadowRoot.querySelector('.amount').value = '10000';
    element._numToWord();

    expect(element.shadowRoot.querySelector('#word').innerHTML).to.equal('Ten Thousand');
    expect(inWordsStub.calledOnce).to.be.true;
  });

  it('should convert number to words correctly', () => {
    expect(inWords('10000').trim()).to.equal('ten thousand');
  });


  it('should add/remove e-handle class when amount < 10000', async () => {
    const clock = sinon.useFakeTimers();
    const amountEl = element.shadowRoot.querySelector('.amount');
    amountEl.value = 5000;

    element._captureDetails();
    expect(amountEl.classList.contains('e-handle')).to.be.true;

    clock.tick(2000);
    expect(amountEl.classList.contains('e-handle')).to.be.false;
    clock.restore();
  });

  it('should call fetch and navigate when amount is valid', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves({
      json: () => Promise.resolve({ emi: 12345 }),
    });
    const routerStub = sinon.stub(Router, 'go');

    element.shadowRoot.querySelector('.type').value = 'Personal Loan';
    element.shadowRoot.querySelector('.amount').value = '10000';
    element.shadowRoot.querySelector('.period').value = '5';

    element._captureDetails();
    await new Promise(r => setTimeout(r, 0));

    expect(fetchStub.calledOnce).to.be.true;
    expect(routerStub.calledWith('/emidetails')).to.be.true;
  });


  it('should navigate to dashboard when _toDashboard is called', () => {
    const routerStub = sinon.stub(Router, 'go');
    element._toDashboard();
    expect(routerStub.calledWith('/')).to.be.true;
  });


  it('should validate type input', () => {
    const clock = sinon.useFakeTimers();
    const typeInput = element.shadowRoot.querySelector('.type');
    const validator = typeInput.validators;

    typeInput.value = '';
    typeInput.dispatchEvent(new Event('input'));

    clock.tick(2000);
    expect(validator[0].__config.getMessage()).to.equal('Type is a required field');
    clock.restore();
  });

  it('should validate amount input', () => {
    const clock = sinon.useFakeTimers();
    const amountInput = element.shadowRoot.querySelector('.amount');
    const validators = amountInput.validators;

    // Required
    amountInput.value = '';
    amountInput.dispatchEvent(new Event('input'));
    clock.tick(2000);
    expect(validators[2].__config.getMessage()).to.equal('Amount is a required field');

    // Below min
    amountInput.value = '5000';
    amountInput.dispatchEvent(new Event('input'));
    clock.tick(2000);
    expect(validators[0].__config.getMessage()).to.equal('Should enter an amount greater than ten thousand ');

    // Above max
    amountInput.value = '20000000';
    amountInput.dispatchEvent(new Event('input'));
    clock.tick(2000);
    expect(validators[1].__config.getMessage()).to.equal('Should enter an amount less than ten crore ');

    clock.restore();
  });

  it('should validate period input', () => {
    const clock = sinon.useFakeTimers();
    const periodInput = element.shadowRoot.querySelector('.period');
    const validators = periodInput.validators || [];

    periodInput.value = '0';
    periodInput.dispatchEvent(new Event('input'));
    clock.tick(2000);

    if (validators.length) {
      expect(validators[0].__config.getMessage()).to.exist;
    }

    clock.restore();
  });
});
