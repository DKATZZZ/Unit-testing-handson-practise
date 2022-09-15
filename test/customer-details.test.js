import { html, fixture, expect } from '@open-wc/testing';
import Sinon, { stub } from 'sinon';
import { Router } from '@vaadin/router';
import '../src/Customer/Customer-details.js';

describe('customer details', () => {
  // Write test cases inside this block
  let el;
  before( async() => {
    el = await fixture(html `<customer-details><customer-details>`);
  });

  it('is accessible', () => {
    expect(el).to.be.accessible;
  });

  it('_toEmidetails()- called Router global() to navigate to dashboard', () => {
    const spy = Sinon.spy(Router, 'go');
    el._toEmidetails();
    expect(spy).to.have.called;
    expect(spy.firstCall.args[0]).to.equal('/emidetails');
    spy.restore();
  });
});
