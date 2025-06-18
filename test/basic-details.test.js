import { html, fixture, expect, nextFrame } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/LoanBasicDetails/BasicDetails.js';

describe('Basic details', () => {
  // Write test cases inside this block
  // refer basic-details.js files
  it('Test label on basic details', async () => {
    const el = await fixture(html`<basic-details></basic-details>`);
    const lionInput = el.shadowRoot.querySelector('lion-input');
    expect(lionInput.label).to.exist;
  });

  // it('Test type of Loan', async () => {
  //   localStorage.setItem('type', 'Home Loan');
  //   const el = await fixture(html`<basic-details></basic-details>`);
  //   const lionInput = el.shadowRoot.querySelector('lion-input');
  //   expect(lionInput.value).to.equal('Home Loan');
  // });

  it('Test Amount label on basic details', async () => {
    const el = await fixture(html`<basic-details></basic-details>`);
    const lionInput = el.shadowRoot.querySelector('lion-input-amount');
    expect(lionInput.name).to.exist;
  });

  // it('Test type of Loan', async () => {
  //   const el = await fixture(html`<basic-details></basic-details>`);
  //   const lionInputrange = el.shadowRoot.querySelector('lion-input-range');
  //   expect('Loan Period').to.equal('Loan Period');
  // });
  it('should display amount in words', async () => {
    const el = await fixture(html`<basic-details></basic-details>`);

    const amountInput = el.shadowRoot.querySelector('.amount');
    const wordDiv = el.shadowRoot.querySelector('#word');

    amountInput.value = '20000';
    amountInput.dispatchEvent(new Event('keyup'));

    await el.updateComplete;

    expect(wordDiv.innerHTML.trim().length).to.be.greaterThan(0);
  });
});
