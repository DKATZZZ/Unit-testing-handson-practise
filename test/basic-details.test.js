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

});
