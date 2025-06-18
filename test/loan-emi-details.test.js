import { html, fixture, expect } from '@open-wc/testing';
import { localize } from '@lion/localize';
import '../src/LoanEMIDetails/LoanEMIDetails.js';

describe('Loan EMI details', () => {
  beforeEach(() => {
    localStorage.setItem(
      'emi',
      JSON.stringify({
        interestRate: 7.5,
        monthlyEMI: 5000,
        principal: 100000,
        interest: 20000,
        totalAmount: 120000,
      })
    );
  });

  it('should render the EMI title', async () => {
    const emi = await fixture(html`<loanemi-details></loanemi-details>`);
    const emiTitle = emi.shadowRoot.querySelector('h2');
    expect(emiTitle.innerHTML.trim()).to.equal('EMI Details');
  });

  it('should show "Interest Rate" label in English', async () => {
    localize.locale = 'en-GB';
    const el = await fixture(html`<loanemi-details></loanemi-details>`);
    const expectedLabel = localize.msg('change-language:intRate');
    const firstParagraph = el.shadowRoot.querySelector('p');

    expect(firstParagraph.textContent.trim()).to.include(expectedLabel);
  });
});
