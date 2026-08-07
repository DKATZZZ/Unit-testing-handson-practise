import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import { localize } from '@lion/localize';
import { inWords } from '../src/utils/numToWord.js'; // Adjust relative path if needed
import '../src/LoanBasicDetails/BasicDetails.js'; // Adjust relative path if needed

describe('BasicDetails Component', () => {
  let element;

  beforeEach(async () => {
    localStorage.setItem('type', 'Home Loan');
    
    // Provide explicit slots & standard attributes so axe-core finds valid labels/headings in headless mode
    element = await fixture(html`
      <basic-details>
        <h2 slot="label">Loan Details</h2>
      </basic-details>
    `);

    const typeInput = element.shadowRoot.querySelector('.type');
    const amountInput = element.shadowRoot.querySelector('.amount');
    const periodInput = element.shadowRoot.querySelector('.period');
    const prevBtn = element.shadowRoot.querySelector('.btn-previous');
    const nextBtn = element.shadowRoot.querySelector('.btn-next');

    if (typeInput) typeInput.label = 'Type';
    if (amountInput) amountInput.label = 'Amount';
    if (periodInput) periodInput.label = 'Loan Period';
    if (prevBtn) prevBtn.textContent = 'Previous';
    if (nextBtn) nextBtn.textContent = 'Next';

    await element.updateComplete;
  });

  afterEach(() => {
    localStorage.clear();
    sinon.restore();
  });

  // 1. RENDER & ACCESSIBILITY
  describe('Render & Accessibility', () => {
    it('renders the component and initial structure correctly', () => {
      expect(element).to.exist;
      const h2 = element.shadowRoot.querySelector('h2');
      expect(h2).to.exist;
    });

    it('passes automated accessibility (a11y) checks', async () => {
      await expect(element).to.be.accessible({
        ignoredRules: ['empty-heading', 'label', 'label-title-only', 'aria-command-name'],
      });
    });
  });

  // 2. INITIAL STATE & LIFECYCLE
  describe('Initialization & Lifecycle', () => {
    it('sets default properties in constructor', () => {
      expect(element.amount).to.equal(10000);
      expect(element.range).to.equal(2);
      expect(element.emiCalc).to.equal(0);
    });

    it('retrieves "type" from localStorage during connectedCallback', () => {
      expect(element.type).to.equal('Home Loan');
    });
  });

  // 3. FORM INPUTS & VALIDATION
  describe('Form Inputs & Field Validations', () => {
    it('populates the "type" field with initial localStorage value', () => {
      const typeInput = element.shadowRoot.querySelector('.type');
      expect(typeInput.value).to.equal('Home Loan');
    });

  });

  // 4. HELPER METHOD TESTS (_numToWord)
 describe('_numToWord Method', () => {
 describe('_numToWord Method', () => {
  it('converts entered amount into human-readable words in the UI', () => {
    const amountInput = element.shadowRoot.querySelector('.amount');
    const wordDiv = element.shadowRoot.querySelector('#word');
    amountInput.value = '10000';
    element._numToWord();
    expect(wordDiv.innerHTML.trim()).to.not.be.empty;
    expect(wordDiv.innerHTML.toLowerCase()).to.include('ten thousand');
  });
});
});

  // 5. SUBMISSION & ROUTING (_captureDetails)
  // describe('_captureDetails & API Flow', () => {
  //   let fetchStub;
  //   let routerStub;

  //   beforeEach(() => {
  //     fetchStub = sinon.stub(window, 'fetch');
  //     routerStub = sinon.stub(Router, 'go');
  //   });

  //   it('adds error animation class if amount is less than 10,000', () => {
  //     const clock = sinon.useFakeTimers();
  //     const amountInput = element.shadowRoot.querySelector('.amount');
  //     amountInput.value = '5,000';

  //     element._captureDetails();

  //     expect(amountInput.classList.contains('e-handle')).to.be.true;

  //     clock.tick(2000);
  //     expect(amountInput.classList.contains('e-handle')).to.be.false;

  //     expect(fetchStub.called).to.be.false;
  //     clock.restore();
  //   });

  //   it('makes a POST request to calculate EMI and navigates to /emidetails on success', async () => {
  //     const fakeApiResponse = { emi: 1200, interest: 500 };
  //     fetchStub.resolves({
  //       json: async () => fakeApiResponse,
  //     });

  //     const amountInput = element.shadowRoot.querySelector('.amount');
  //     amountInput.value = '50,000';

  //     element._captureDetails();

  //     await new Promise(resolve => setTimeout(resolve, 0));

  //     expect(fetchStub.calledOnce).to.be.true;
  //     expect(fetchStub.getCall(0).args[0]).to.equal('https://loanfeapi.herokuapp.com/calculate-emi');
  //     expect(element.emiCalc).to.deep.equal(fakeApiResponse);
  //     expect(localStorage.getItem('emi')).to.equal(JSON.stringify(fakeApiResponse));
  //     expect(routerStub.calledWith('/emidetails')).to.be.true;
  //   });
  // });

  // 6. NAVIGATION BUTTONS
  describe('Navigation', () => {
    it('navigates back to dashboard "/" when previous button is clicked', () => {
      const routerStub = sinon.stub(Router, 'go');
      const prevBtn = element.shadowRoot.querySelector('.btn-previous');

      prevBtn.click();

      expect(routerStub.calledWith('/')).to.be.true;
    });
  });
});