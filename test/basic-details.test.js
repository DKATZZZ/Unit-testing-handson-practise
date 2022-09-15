import { html, fixture, expect } from '@open-wc/testing';
import { triggerFocusFor, triggerBlurFor } from '@open-wc/testing';
import Sinon, { stub } from 'sinon';
import { Router } from '@vaadin/router';
import '../src/LoanBasicDetails/BasicDetails.js';

describe('Basic details', () => {
  // Write test cases inside this block
  // refer basic-details.js files
  let el;
  before( async() => {
    el = await fixture(html `<basic-details><basic-details>`);
  });

  it('it should accessible the component', () => {
    expect(el).to.be.accessible;
  });

  it('it should not accessible the component', () => {
    let el;
    before( async() => {
      el = await fixture(html `<basic-details><basic-details>`);
    });
    expect(el).not.to.be.accessible;
  });

  it('_numToWord() method called to convert number into word from "Amount" input field', () => {
    const spy = Sinon.spy(el, '_numToWord');
    el._numToWord();
    el.shadowRoot.querySelector('.amount').value = 10000;
    expect(spy).to.have.called;
    expect(el.shadowRoot.querySelector('#word').innerHTML.trim()).to.equal('ten thousand');
    spy.restore();
  });

  it('_captureDetails() method called ', () => {    
    // const sampleArr = ["amount","form-field","e-handle"];
    const spy = Sinon.spy(el, '_captureDetails');
    el._captureDetails();
    el.shadowRoot.querySelector('.type').value = 'Home Loan';
    el.shadowRoot.querySelector('.amount').value = '10000';
    el.shadowRoot.querySelector('.period').value = '2';
    // el.shadowRoot.querySelector('.amount').classList[2] = 'e-handle';
    expect(spy).to.have.called;
    // expect(el.shadowRoot.querySelector('.amount')).to.equal(sampleArr[2]);
    spy.restore();
  });

  it('_toDashboard()- called Router global() to navigate to dashboard', () => {
    const spy = Sinon.spy(Router, 'go');
    el._toDashboard();
    expect(spy).to.have.called;
    expect(spy.firstCall.args[0]).to.equal('/');
    spy.restore();
  });  
});