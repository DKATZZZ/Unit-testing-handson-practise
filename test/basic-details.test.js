import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/LoanBasicDetails/BasicDetails';

describe('Basic details', () => {
  it('test case', async () => {
    const element = await fixture(html`<basic-details></basic-details>`);
    const inputElement = element.shadowRoot.querySelector('lion-input');

    expect(inputElement.type).to.equal('text');
    // expect(element.shadowRoot.querySelector('lion-input').ad).to.equal('Loan Details');
  });

  it('calls capturedetails function when a button is clicked', async () => {
    const element = await fixture(
      html`<basic-details
        ><lion-form><form></form></lion-form
      ></basic-details>`
    );
    const myFunctionStub = stub(element, '_captureDetails');
    element.requestUpdate();
    await element.updateComplete;
    element.shadowRoot.querySelector('button').click();
    expect(myFunctionStub).to.have.callCount(0);
  });

  it('calls dashboard function when a button is clicked', async () => {
    const element = await fixture(
      html`<basic-details
        ><lion-form><form></form></lion-form
      ></basic-details>`
    );
    const myFunctionStub = stub(element, '_toDashboard');
    element.requestUpdate();
    await element.updateComplete;
    element.shadowRoot.querySelector('button').click();
    expect(myFunctionStub).to.have.callCount(1);
  });
  
});
