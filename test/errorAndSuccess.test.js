import { html, fixture, expect } from '@open-wc/testing';
import Sinon, { stub } from 'sinon';
import { Router } from '@vaadin/router';
import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

describe('Success screen ', () => {
  // Write test cases inside this block
  let sM;
  before( async() => {
    sM = await fixture(html `<loan-success><loan-success>`);
  });

  it('is accessible', () => {
    expect(sM).to.be.accessible;
  });

  it('_toHome() method called ', () => {
    const spy = Sinon.spy(Router, 'go');
    sM._toHome();
    expect(spy).to.have.called;
    expect(spy.firstCall.args[0]).to.equal('/');
    spy.restore();
  });
});

describe('error screen', () => {
  // Write test cases inside this block
  let eM;
  before( async() => {
    eM = await fixture(html `<loan-error><loan-error>`);
  });
  it('is accessible', () => {
    expect(eM).to.be.accessible;
  });

  it('_toHome() method called ', () => {
    const spy = Sinon.spy(Router, 'go');
    eM._toHome();
    expect(spy).to.have.called;
    expect(spy.firstCall.args[0]).to.equal('/');
    spy.restore();
  });
});
