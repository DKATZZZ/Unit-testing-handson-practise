import { html, fixture, expect } from '@open-wc/testing';
import Sinon, { stub } from 'sinon';

import '../loan-application.js';

describe('LoanApplication', () => {
  // Write test cases inside this block
  let el;
  before( async() => {
    el = await fixture(html `<loan-application><loan-application>`);
  });
  
  it('is accessible', () => {
    expect(el).to.be.accessible;
  });

  it('__increment() called', () => {
    const spy = Sinon.spy(el, '__increment');
    el.__increment();
    spy.restore();
    // el.counter = 1;
    // console.log(spy).to.have.called;
    // console.log(el.counter).to.be(6);
  });
});
